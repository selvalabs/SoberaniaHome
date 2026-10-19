import '../styles/motion-edition.css';
import { createLeafFlight, leafGust, lifeOrbit, LEAF_SCROLL_PACE } from './leaf-physics';

/** One source of movement: the document's native scroll position.
 * Scenes use CSS sticky, never JS pin spacers. All rendering sleeps at rest. */
type SceneKind = 'horizontal' | 'process' | 'spiral';
type Scene = {
  id: string; kind: SceneKind; section: HTMLElement; sequence: HTMLElement;
  frame: HTMLElement; panels: HTMLElement[]; track: HTMLElement | null;
  reverse: boolean; start: number; run: number; progress: number; index: number;
  offsets: number[]; active: boolean; stage?: HTMLElement; stageWidth: number; stageHeight: number; flow: boolean; static: boolean;
};
type MotionApi = {
  pause: () => void; resume: () => void; jumpSection: (id: string) => void;
  jumpScene: (id: string, index: number) => void; setReading: (reading: boolean) => void;
  request: () => void; getActive: () => string;
};
declare global { interface Window { SLMotion: MotionApi; __SL_DEBUG: any; } }

const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const smooth = (n: number) => { const p = clamp(n); return p * p * (3 - 2 * p); };
const all = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(selector));
const controls = 'a,button,input,textarea,select,summary,[contenteditable],dialog,.landing-phone-rail,.landing-phone-screen,[data-independent-scroll]';
export const sceneProgress: Record<string, number> = {};

export function initMotion() {
  if (window.__SL_DEBUG?.ready) return;
  const root = document.documentElement;
  const mast = document.getElementById('mast');
  const flight = document.getElementById('leaf-flight');
  const depth = document.getElementById('leaf-depth');
  const leaf = document.getElementById('wind-leaf');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let requestedReading = false;
  try { requestedReading = localStorage.getItem('sl-reading') === 'true'; } catch { /* Storage is optional. */ }
  let enabled = false, leafEnabled = false, paused = false, raf = 0, resizeTimer = 0, layoutTimer = 0;
  let layoutWidth = innerWidth, layoutLandscape = matchMedia('(orientation: landscape)').matches;
  let resizedWidth = document.documentElement.clientWidth, resizedHeight = innerHeight;
  let layoutHeight = smallViewportHeight();
  let pausedAnchor: {id:string;offset:number}|null=null, modeChangedWhilePaused=false;
  let mastHeight = 72, height = innerHeight, width = innerWidth, maxScroll = 1;
  let previousY = scrollY, directionTravel = 0, activeId = 'hero', leafDrag: {x:number;y:number} | null = null;
  let sections: {element: HTMLElement; top: number; bottom: number}[] = [];
  let origin = {x: innerWidth * .31, y: 240}, dock = {x: innerWidth * .65, y: 0};
  const leafFlight = createLeafFlight();
  const metrics = {frames: 0, measurements: 0, idle: true};
  const scenes: Scene[] = [];
  let pendingSceneJump: {scene: Scene; index: number} | null = null;
  let navigationRevision=0;
  // Cache editorial targets once. Product interfaces and controls keep their own colors.
  const glowTargets = all<HTMLElement>('h1,h2,h3,p,figcaption,.technology-note,.knowledge-note', document.querySelector('main') || document)
    .filter(el => !el.closest('button,a,.work-evidence,.process-panels,.orbit-view,#referencias,dialog'))
    .flatMap(el => {
      const marks=all<HTMLElement>('strong,em,.hero-future,.choices-pencil,.choices-paper,.choices-ink',el);
      return marks.length ? marks : [el];
    });
  const litMarks = new Set<HTMLElement>();
  for(const mark of glowTargets) {
    mark.style.setProperty('--leaf-ink',getComputedStyle(mark).color);
    // Paint the ink without replacing paper labels or other editorial backgrounds.
    const walker=document.createTreeWalker(mark,NodeFilter.SHOW_TEXT);
    const texts:Text[]=[];
    while(walker.nextNode())if(walker.currentNode.textContent?.trim()&&!walker.currentNode.parentElement?.closest('.leaf-ink,a,button'))texts.push(walker.currentNode as Text);
    const plainBlock=mark.childNodes.length===1&&getComputedStyle(mark).display==='block';
    for(const text of texts){const ink=document.createElement('span');ink.className='leaf-ink';if(plainBlock)ink.style.display='block';text.replaceWith(ink);ink.append(text);}
  }
  document.addEventListener('sl:themechange',()=>{
    clearLeafGlow();
    for(const mark of glowTargets){mark.style.removeProperty('--leaf-ink');mark.style.setProperty('--leaf-ink',getComputedStyle(mark).color);}
    request();
  });
  const processNodes = all<HTMLButtonElement>('#processo .process-node');
  const assembled = new Set<number>();
  let puzzleDrag: {id:number; pointer:number; x:number; y:number; dx:number; dy:number; moved:boolean} | null = null;
  let puzzleSuppressClick = false;
  let orbitSelection: number | null = null, orbitSelectionAt = 0;
  const orbitNodes = all<HTMLButtonElement>('#espiral [data-orbit-node]');
  const processOrigins = [[20,88],[518,88],[1016,88],[20,507],[518,507],[1016,507]];
  const debug: any = window.__SL_DEBUG = {ready:false,enabled:false,activeId:'hero',scenes:[],leaf:{},metrics,scroll:scrollY,maxScroll:1};

  for (const [id,kind] of [['trabalho','horizontal'],['processo','process'],['laboratorio','horizontal'],['espiral','spiral']] as const) {
    const section = document.getElementById(id);
    const sequence = section?.querySelector<HTMLElement>('.sequence');
    const frame = sequence?.querySelector<HTMLElement>('.scene-frame');
    if (!section || !sequence || !frame) continue;
    const panels = all<HTMLElement>(kind === 'horizontal' ? '.portfolio-card' : kind === 'process' ? '.process-panel' : '.spiral-caption', section);
    const scene: Scene = {id,kind,section,sequence,frame,panels,track:section.querySelector('.portfolio-track'),reverse:id==='laboratorio',start:0,run:1,progress:0,index:0,offsets:[],active:false,stageWidth:0,stageHeight:0,flow:false,static:false};
    scene.stage = section.querySelector<HTMLElement>(kind === 'process' ? '.process-periphery' : '.orbit-view') || undefined;
    sequence.dataset.motionScene = kind;
    if(kind==='horizontal') { frame.tabIndex=0; frame.setAttribute('aria-label',id==='trabalho'?'Projetos. Use as setas para explorar.':'Laboratório. Use as setas para explorar.'); }
    scenes.push(scene);
  }

  function smallViewportHeight() {
    // svh represents the space with browser chrome present. Cache it until a
    // width/orientation change: the URL bar must not rebuild the whole page.
    const probe = document.createElement('span');
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;height:100svh;width:0;';
    document.body.append(probe);
    const result = probe.getBoundingClientRect().height || innerHeight;
    probe.remove();
    return result;
  }
  function compactViewport() { return layoutHeight < (layoutWidth < 760 ? 620 : 540); }

  function syncControls() {
    const forcedReading = reduced.matches;
    const readingSwitch = document.getElementById('reading-switch') as HTMLInputElement | null;
    if(readingSwitch) { readingSwitch.checked=!leafEnabled; readingSwitch.disabled=forcedReading; }
    const toggle = document.getElementById('toggle-motion-footer') as HTMLButtonElement | null;
    if(toggle) { toggle.textContent=reduced.matches?'Movimento reduzido':leafEnabled?'Modo de leitura':'Ativar experiência';toggle.disabled=forcedReading;toggle.setAttribute('aria-pressed',String(!leafEnabled)); }
    all<HTMLButtonElement>('[data-edition-reading]').forEach(button=>{button.setAttribute('aria-pressed',String(!leafEnabled));button.textContent=reduced.matches?'Leitura tranquila':leafEnabled?'Modo de leitura':'Ativar experiência';button.disabled=forcedReading;});
    debug.enabled=enabled;
    debug.leafEnabled=leafEnabled;
    root.dataset.reading=String(!leafEnabled);
  }

  function configure(preserve = true) {
    const anchor = preserve ? sections.find(item=>item.element.id===activeId)?.element : null;
    const oldOffset = anchor ? (scenes.some(scene=>scene.id===activeId&&scene.active&&!scene.flow)?mastHeight:anchor.getBoundingClientRect().top) : 0;
    leafEnabled=!requestedReading&&!reduced.matches;
    const nextEnabled=leafEnabled;
    if(paused&&nextEnabled!==enabled)modeChangedWhilePaused=true;
    enabled=nextEnabled;
    root.classList.toggle('motion',enabled);
    root.classList.toggle('leaf-motion',leafEnabled);
    root.classList.add('motion-edition');
    root.dataset.mastHidden='false';
    for(const item of all<HTMLElement>('#hero,#folha,#deslocamento-1,#deslocamento-2')) item.dataset.pin='false';
    for(const scene of scenes) {
      scene.sequence.style.removeProperty('height');
      scene.track?.style.removeProperty('transform');
      scene.panels.forEach(panel=>{panel.inert=false;panel.removeAttribute('aria-hidden');panel.style.removeProperty('opacity');panel.hidden=false;});
    }
    if(flight) flight.hidden=!leafEnabled;
    if(!leafEnabled) clearLeafGlow();
    syncControls(); measure();
    if(anchor&&!paused) scrollTo({top:scrollY+anchor.getBoundingClientRect().top-oldOffset,behavior:'instant'});
    request();
  }

  function measure() {
    if(paused) return;
    metrics.measurements++;
    width=document.documentElement.clientWidth;height=innerHeight;
    mastHeight=mast?.offsetHeight||64;
    root.style.setProperty('--motion-stage-height',`${Math.max(1,height-mastHeight)}px`);
    root.style.setProperty('--motion-mast-height',`${mastHeight}px`);
    for(const scene of scenes) {
      const steps=Math.max(1,scene.panels.length-1);
      // On phones the gallery owns the viewport. Its header reserves space for
      // the returning mast; the hidden mast no longer leaves a vacant strip.
      const fullViewport=scene.kind==='horizontal'&&(width<760||height<620);
      scene.sequence.style.setProperty('--motion-stage-height',`${fullViewport?height:Math.max(1,height-mastHeight)}px`);
      scene.sequence.style.setProperty('--motion-mast-height',`${fullViewport?0:mastHeight}px`);
      scene.sequence.style.setProperty('--motion-header-clearance',`${fullViewport?mastHeight:0}px`);
      scene.static=scene.kind!=='horizontal'&&compactViewport();
      scene.sequence.dataset.motionStatic=String(scene.static);
      scene.flow=scene.kind==='process'&&width<760;
      scene.sequence.dataset.processFlow=String(scene.flow);
      scene.run=enabled&&!scene.flow&&!scene.static ? Math.round(scene.kind==='horizontal'?steps*clamp(width*.66,430,900):scene.kind==='process'?clamp(height*1.8,1100,1650):clamp(height*2.4,1500,2200)) : 0;
      scene.sequence.style.setProperty('--motion-run',`${scene.run}px`);
      scene.sequence.style.height=enabled&&!scene.flow&&!scene.static?`${(fullViewport?height:height-mastHeight)+scene.run}px`:'';
      if(scene.track) {
        scene.panels.forEach(card=>{card.tabIndex=0;});
        const hint=scene.section.querySelector('.scene-hint');
        if(hint)hint.textContent=height<620?'Role o card para ler · Arraste para explorar':scene.reverse?'Continue rolando para voltar pela estrada':'Role para conhecer';
        // row-reverse already defines the laboratory's spatial direction.
        const viewport=scene.track.parentElement?.clientWidth||width;
        scene.offsets=scene.panels.map(card=>card.offsetLeft+card.offsetWidth/2-viewport/2);
      }
      scene.stageWidth=scene.stage?.clientWidth||0;scene.stageHeight=scene.stage?.clientHeight||0;
    }
    const y=scrollY;
    scenes.forEach(scene=>{
      scene.start=scene.sequence.getBoundingClientRect().top+y-(scene.kind==='horizontal'&&(width<760||height<620)?0:mastHeight);
      if(scene.flow&&leafEnabled){
        const first=scene.panels[0]?.getBoundingClientRect(),last=scene.panels.at(-1)?.getBoundingClientRect();
        if(first&&last){scene.start=first.top+y-mastHeight-scene.stageHeight-24;scene.run=Math.max(1,last.top-first.top);}
      }
    });
    sections=all<HTMLElement>('main > .section').map(element=>{const r=element.getBoundingClientRect();return{element,top:r.top+y,bottom:r.bottom+y};});
    maxScroll=Math.max(1,document.documentElement.scrollHeight-height);
    const o=(document.getElementById('leaf-origin')||document.getElementById('cover-origin'))?.getBoundingClientRect();
    const d=document.getElementById('leaf-dock')?.getBoundingClientRect();
    if(o)origin={x:o.left+o.width/2,y:o.top+y};
    if(d)dock={x:d.left+d.width/2,y:d.top+y};
    debug.maxScroll=maxScroll;
    request();
  }

  function request() {
    if(raf||paused||document.hidden)return;
    metrics.idle=false;
    raf=requestAnimationFrame(render);
  }

  function render() {
    raf=0;if(paused||document.hidden){metrics.idle=true;return;}
    const y=scrollY;metrics.frames++;debug.scroll=y;
    const numbered=sections.filter(item=>item.element.dataset.number);
    const at=numbered.find(section=>section.top<=y+height*.4&&section.bottom>y+height*.4)||[...numbered].reverse().find(section=>section.top<=y+height*.4)||numbered[0];
    if(at) {
      activeId=at.element.id;debug.activeId=activeId;
      const counter=document.getElementById('section-counter');
      if(counter)counter.textContent=`${String(at.element.dataset.number||1).padStart(2,'0')} / ${String(numbered.length).padStart(2,'0')}`;
      all<HTMLAnchorElement>('.main-nav [data-jump]').forEach(link=>{if(link.hash===`#${activeId}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    }
    const delta=y-previousY;
    if(Math.sign(delta)!==Math.sign(directionTravel))directionTravel=0;
    directionTravel+=delta;
    if(y<80||directionTravel<-8||mast?.contains(document.activeElement))root.dataset.mastHidden='false';
    else if(directionTravel>36&&!document.querySelector('dialog[open]'))root.dataset.mastHidden='true';
    previousY=y;
    for(const scene of scenes) {
      const animated=enabled&&!scene.static;
      scene.progress=animated||scene.flow&&leafEnabled?clamp((y-scene.start)/Math.max(1,scene.run)):1;
      scene.active=(animated||scene.flow&&leafEnabled)&&y>=scene.start-2&&y<=scene.start+scene.run+2;
      scene.index=Math.round(scene.progress*Math.max(1,scene.panels.length-1));
      if(scene.flow&&leafEnabled){
        const focus=mastHeight+scene.stageHeight+32;
        scene.index=scene.panels.reduce((index,panel,i)=>panel.getBoundingClientRect().top<=focus?i:index,0);
      }
      sceneProgress[scene.id]=scene.progress;
      if(animated||scene.flow&&leafEnabled) {
        if(scene.kind==='horizontal')renderTrack(scene);
        if(scene.kind==='process')renderProcess(scene);
        if(scene.kind==='spiral')renderSpiral(scene);
      }
      const meter=scene.section.querySelector<HTMLElement>('.scene-progress i');
      if(meter)meter.style.transform=`scaleX(${scene.progress})`;
      const counter=scene.section.querySelector('.scene-count');
      if(counter)counter.textContent=`${String(scene.index+1).padStart(2,'0')} / ${String(scene.panels.length).padStart(2,'0')}`;
      const prev=scene.section.querySelector<HTMLButtonElement>('[data-prev]');
      const next=scene.section.querySelector<HTMLButtonElement>('[data-next]');
      if(prev)prev.disabled=scene.index===0;
      if(next)next.disabled=scene.index===scene.panels.length-1;
    }
    if(pendingSceneJump){
      const {scene,index}=pendingSceneJump;
      if(Math.abs(y-(scene.start+scene.run*index/Math.max(1,scene.panels.length-1)))<2)pendingSceneJump=null;
    }
    if(leafEnabled)renderLeaf(y);
    debug.scenes=scenes.map(s=>({id:s.id,start:s.start,end:s.start+s.run,raw:s.progress*(s.panels.length-1),visual:s.progress*(s.panels.length-1),lastIndex:s.index,static:!enabled||s.static,flow:s.flow}));
    metrics.idle=true;
  }

  function renderTrack(scene:Scene) {
    const p=scene.progress*(scene.panels.length-1),a=Math.floor(p),b=Math.min(scene.panels.length-1,a+1);
    const x=mix(scene.offsets[a]||0,scene.offsets[b]||0,p-a);
    if(scene.track)scene.track.style.transform=`translate3d(${-x}px,0,0)`;
    scene.panels.forEach((card,index)=>{
      const current=index===scene.index;
      card.inert=!current;card.setAttribute('aria-hidden',String(!current));
      card.classList.toggle('is-current',current);
      card.style.opacity=String(.5+.5*(1-clamp(Math.abs(index-p))));
    });
  }

  function renderProcess(scene:Scene) {
    const board=scene.section.querySelector<HTMLElement>('.process-board');
    const w=scene.stageWidth,h=scene.stageHeight;
    const scale=Math.min(w*(scene.flow ? .83 : .78)/1536,h*(scene.flow ? .9 : .79)/1024);
    if(board){board.style.width=`${1536*scale}px`;board.style.height=`${1024*scale}px`;}
    processNodes.forEach((node,index)=>{
      const built=assembled.has(index)?1:smooth((scene.progress-index*.14)/.3);
      const [ox,oy]=processOrigins[index];
      const dx=(index%3-1)*w*(scene.flow ? .015 : .11)*(1-built),dy=(index<3?-1:1)*h*(scene.flow ? .04 : .18)*(1-built);
      node.style.left=`${(ox-82)*scale}px`;node.style.top=`${(oy-72)*scale}px`;
      node.style.width=`${662*scale}px`;node.style.height=`${568*scale}px`;
      const drag=puzzleDrag?.id===index?puzzleDrag:null;
      node.style.transform=`translate3d(${dx+(drag?.dx||0)}px,${dy+(drag?.dy||0)}px,0) rotate(${(index%2?1:-1)*(scene.flow?6:10)*(1-built)}deg)`;
      node.classList.toggle('is-active',index===scene.index);node.classList.toggle('is-assembled',built>.98);
      node.setAttribute('aria-pressed',String(index===scene.index));
    });
    scene.panels.forEach((panel,index)=>{
      panel.classList.toggle('is-active',index===scene.index);panel.classList.toggle('is-past',index<scene.index);
      panel.style.setProperty('--step-light',index<=scene.index?'1':scene.flow?'.8':'.45');
      const button=panel.querySelector('button');if(index===scene.index)button?.setAttribute('aria-current','step');else button?.removeAttribute('aria-current');
    });
  }

  function renderSpiral(scene:Scene) {
    if(orbitSelection!==null&&Math.abs(scene.progress-orbitSelectionAt)>.13)orbitSelection=null;
    const selected=orbitSelection??[0,3,4,7][scene.index]??0;
    const w=scene.stageWidth,h=scene.stageHeight,base=Math.min(w,h);
    const {phase}=lifeOrbit(scene.progress,w,h);
    orbitNodes.forEach((node,index)=>{
      const angle=index/orbitNodes.length*Math.PI*2-Math.PI/2+phase;
      const radius=base*(index%2?.36:.43);
      node.style.left=`${w/2+Math.cos(angle)*radius}px`;node.style.top=`${h/2+Math.sin(angle)*radius*.84}px`;
      node.setAttribute('aria-pressed',String(index===selected));
    });
    const ring=scene.section.querySelector<HTMLElement>('.ring-outer');if(ring)ring.style.transform=`translate(-50%,-50%) rotate(${phase*180/Math.PI}deg)`;
    scene.panels.forEach((panel,index)=>{panel.hidden=index!==scene.index;panel.inert=index!==scene.index;});
    updateOrbitNote(selected);
  }

  function updateOrbitNote(index:number) {
    const node=orbitNodes[index];if(!node)return;
    const title=document.getElementById('orbit-note-title'),text=document.getElementById('orbit-note-text');
    if(title&&title.textContent!==node.dataset.orbitTitle)title.textContent=node.dataset.orbitTitle||node.textContent;
    if(text&&text.textContent!==node.dataset.orbitText)text.textContent=node.dataset.orbitText||'';
  }

  function renderLeaf(y:number) {
    if(!flight||!leaf||!depth)return;
    const hero=sections[0];
    const launch=clamp(y/Math.max(1,((hero?.bottom||height)-height*.32)*1.22));
    const travel=smooth(launch);
    // Scroll is the clock, not the force. Replaying the same position restores
    // the same inertial state, even after a jump, reversal or toolbar resize.
    const clockScale=LEAF_SCROLL_PACE/Math.max(layoutHeight,1),time=y*clockScale;
    const physics=leafFlight(time);
    const horizontal=enabled?scenes.filter(s=>s.kind==='horizontal'):[];
    const bursts=horizontal.flatMap(s=>{
      const starts=[s.start+s.run*.04];
      for(let elapsed=3.4;elapsed<s.run*clockScale-.6;elapsed+=3.4)starts.push(s.start+elapsed/clockScale);
      return starts.map(start=>({time:start*clockScale,direction:s.reverse?1:-1}));
    });
    // Occasional turns continue in editorial folds. Keep them away from the
    // gallery gusts so entering a scene does not pile up two strong impulses.
    bursts.push({time:-.45,direction:1});
    for(let at=3.6;at<=time;at+=4.6){
      if(!horizontal.some(s=>at> s.start*clockScale-2&&at<(s.start+s.run)*clockScale+1.6))
        bursts.push({time:at,direction:Math.floor(at/4.6)%3===2?-1:1});
    }
    let drift=0,turn=0,spin=0;
    // Finish each turn before approaching the resting place in the footer.
    const lastGust=(dock.y-height-180)*clockScale-4;
    for(const burst of bursts){
      if(burst.time>lastGust)continue;
      const gust=leafGust(time-burst.time,burst.direction);drift+=gust.drift;turn+=gust.turn;spin+=gust.spin;
    }
    const degrees=180/Math.PI;
    const lateral=Math.tanh((physics.x-.95)*1.45);
    let x=mix(origin.x,width*(.5+lateral*.4+drift*.1),travel);
    // A following camera removes the mean descent. Kinetic energy exchanged
    // for height gives the shallow rising cusps at the ends of each glide.
    const dip=physics.vx**2/(2*1.45);
    let ly=mix(origin.y,height*(.465+dip*.28+(physics.fallSpeed-.92)*.045),travel);
    let rz=mix(118,90+physics.bank*degrees*.72+physics.wind*9+spin*28,travel);
    let rx=mix(7,18+physics.twist*degrees*1.6,travel);
    let ry=mix(0,physics.vx*22+physics.angularSpeed*10,travel);
    let scale=mix(width<760?.62:.82,(width<760?.46:.68)*(1+physics.twist*.08),travel);
    // Join the same phase as the ring and words. Smooth spatial capture/release
    // leaves both ends continuous and keeps VIDA free in the center.
    const spiral=scenes.find(s=>s.kind==='spiral'&&!s.static);
    let orbitWeight=0,orbitPhase=0;
    if(spiral&&enabled){
      const margin=height*.32,raw=(y-spiral.start)/Math.max(1,spiral.run);
      orbitPhase=lifeOrbit(raw,spiral.stageWidth,spiral.stageHeight).phase;
      orbitWeight=smooth((y-spiral.start+margin)/(margin+spiral.run*.1))*smooth((spiral.start+spiral.run+margin-y)/(margin+spiral.run*.1));
      if(orbitWeight>0&&spiral.stage){
        const r=spiral.stage.getBoundingClientRect(),orbit=lifeOrbit(raw,r.width,r.height);
        x=mix(x,r.left+orbit.x,orbitWeight);ly=mix(ly,r.top+orbit.y,orbitWeight);
        rz+=Math.sin(orbit.angle)*18*orbitWeight;rx+=Math.cos(orbit.angle)*16*orbitWeight;
        scale=mix(scale,width<760?.46:.6,orbitWeight);
      }
    }
    // Scene entry never restarts the wind or substitutes a second sine path.
    const scene=enabled?scenes.find(s=>s.kind==='horizontal'&&y>=s.start-height*.25&&y<=s.start+s.run+height*.25):undefined;
    const dockY=dock.y-y,land=smooth((height+180-dockY)/(height*.7+180));
    // Settle on the nearest complete turn at the dock, never rewind a long
    // page's accumulated rotations. Local Y rolls around the blade's length.
    // Complete two axial turns during the orbit, retaining full turns after
    // departure so the leaf never unwinds when leaving the scene.
    const flightTurn=turn+orbitPhase/(Math.PI*2*1.25)*720;
    const roll=mix(flightTurn,Math.round(flightTurn/360)*360,land);
    x=mix(x,dock.x,land);ly=mix(ly,dockY,land);rz=mix(rz,96,land);rx=mix(rx,7,land);ry=mix(ry,0,land);scale=mix(scale,.74,land);
    if(y>=maxScroll-1){x=dock.x;ly=dockY;rz=96;rx=7;ry=0;}
    if(leafDrag){x=leafDrag.x;ly=leafDrag.y;}
    flight.style.visibility='visible';
    flight.style.transform=`translate3d(${x}px,${ly}px,0)`;
    const pivot=mix(91,50,travel);
    depth.style.transformOrigin=`50% ${pivot}%`;
    leaf.style.transformOrigin=`50% ${pivot}%`;
    depth.style.transform=`translate(-50%,-${pivot}%) scale(${scale})`;
    leaf.style.filter=`brightness(${.96+.08*Math.cos(rx*Math.PI/180)*Math.cos(roll*Math.PI/180)}) drop-shadow(0 2px 2px #1c211a20)`;
    leaf.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) rotateY(${roll}deg)`;
    // Rotation extends beyond the stem's anchor. Keep the painted rectangle
    // inside the screen rather than clamping only that one invisible point.
    const bounds=leaf.getBoundingClientRect(),edge=10;
    const dx=bounds.left<edge?edge-bounds.left:bounds.right>width-edge?width-edge-bounds.right:0;
    const dy=bounds.top<edge?edge-bounds.top:bounds.bottom>height-edge?height-edge-bounds.bottom:0;
    if(dx||dy){x+=dx;ly+=dy;flight.style.transform=`translate3d(${x}px,${ly}px,0)`;}
    const lightX=bounds.left+dx+bounds.width/2,lightY=bounds.top+dy+bounds.height/2;
    const current=sections.find(s=>s.element.id===activeId)?.element;
    // Keep the leaf present in every fold. Only soften it over interfaces;
    // pointer pass-through protects controls instead of hiding the animation.
    let covered=false;
    if(current&&!leafDrag)for(const surface of all<HTMLElement>('.work-evidence,.process-periphery,.process-panels,button,input,select,textarea',current)){
      const r=surface.getBoundingClientRect();
      if(r.width&&r.height&&bounds.right+dx>r.left-8&&bounds.left+dx<r.right+8&&bounds.bottom+dy>r.top-8&&bounds.top+dy<r.bottom+8){covered=true;break;}
    }
    const softened=(covered||activeId==='referencias')&&!leafDrag;
    flight.style.opacity=String(softened ? .42 : mix(1,.72,travel));
    root.dataset.leafInteractive=String(!softened&&!scene);
    root.dataset.leafOccluded='0';root.dataset.leafDepth='front';
    debug.leaf={x,y:ly,rotation:rz,pitch:rx,yaw:ry,roll,drift,spin,orbitWeight,orbitPhase,clock:time,wind:physics.wind,lateralSpeed:physics.vx,fallSpeed:physics.fallSpeed,mode:land>.99?'rest':orbitWeight>.99?'orbit':'flight',occlusionState:softened?'softened':'visible'};
    // Light follows the painted blade, including text alongside a mockup.
    const nextLit=new Set<HTMLElement>();
    for(const [index,mark] of glowTargets.entries()){
      if(mark.closest('[inert],[aria-hidden="true"]'))continue;
      const r=mark.getBoundingClientRect();
      if(!r.width||!r.height||r.bottom<mastHeight||r.top>height)continue;
      const vertical=Math.max(r.top-lightY,0,lightY-r.bottom);
      const horizontal=scene?0:Math.max(r.left-lightX,0,lightX-r.right)*.18;
      const glow=1-smooth(Math.hypot(vertical,horizontal)/clamp(height*.17,95,170));
      if(glow>.03){
        nextLit.add(mark);mark.dataset.leafLit='true';
        mark.style.setProperty('--leaf-glow',String(glow));
        mark.style.setProperty('--leaf-hue',String((y*.16+index*47)%360));
        mark.style.setProperty('--leaf-light-y',`${lightY-r.top}px`);
        mark.style.setProperty('--leaf-lightness',root.dataset.theme==='dark'||mark.closest('.dark')?'74%':'32%');
      }
    }
    for(const mark of litMarks)if(!nextLit.has(mark))resetLeafMark(mark);
    litMarks.clear();nextLit.forEach(mark=>litMarks.add(mark));
  }

  function resetLeafMark(mark:HTMLElement) {
    delete mark.dataset.leafLit;
    for(const property of ['--leaf-glow','--leaf-hue','--leaf-lightness','--leaf-light-y'])mark.style.removeProperty(property);
  }
  function clearLeafGlow() {
    litMarks.forEach(resetLeafMark);litMarks.clear();
  }

  function scrollToY(top:number) { scrollTo({top:clamp(top,0,maxScroll),behavior:reduced.matches||!enabled||Math.abs(top-scrollY)>height*1.5?'instant':'smooth'});request(); }
  function jumpSection(id:string) {
    const section=document.getElementById(id);if(!section)return;
    navigationRevision++;
    const top=section.getBoundingClientRect().top+scrollY-mastHeight;
    pendingSceneJump=null;root.dataset.mastHidden='false';scrollToY(top);request();
  }
  function jumpScene(id:string,index:number) {
    const scene=scenes.find(item=>item.id===id);if(!scene){jumpSection(id);return;}
    navigationRevision++;
    const i=clamp(index,0,scene.panels.length-1);
    if(scene.flow&&leafEnabled)scrollToY(scrollY+scene.panels[i].getBoundingClientRect().top-mastHeight-scene.stageHeight-24);
    else if(enabled&&!scene.static){pendingSceneJump={scene,index:i};scrollToY(scene.start+scene.run*i/Math.max(1,scene.panels.length-1));}
    else scene.panels[i]?.scrollIntoView({block:'center',behavior:'instant'});
  }
  window.SLMotion={
    pause(){const anchor=sections.find(s=>s.element.id===activeId)?.element;pausedAnchor=anchor?{id:activeId,offset:scenes.some(scene=>scene.id===activeId&&scene.active&&!scene.flow)?mastHeight:anchor.getBoundingClientRect().top}:null;paused=true;root.dataset.mastHidden='false';if(raf)cancelAnimationFrame(raf);raf=0;metrics.idle=true;},
    resume(){paused=false;measure();if(modeChangedWhilePaused&&pausedAnchor){const anchor=document.getElementById(pausedAnchor.id);if(anchor)scrollTo({top:scrollY+anchor.getBoundingClientRect().top-pausedAnchor.offset,behavior:'instant'});}modeChangedWhilePaused=false;pausedAnchor=null;previousY=scrollY;request();},
    jumpSection,jumpScene,
    setReading(value){requestedReading=!!value;try{localStorage.setItem('sl-reading',String(requestedReading));}catch{}configure();},
    request,getActive:()=>activeId
  };

  for(const scene of scenes) {
    scene.section.querySelector('[data-prev]')?.addEventListener('click',()=>jumpScene(scene.id,scene.index-1));
    scene.section.querySelector('[data-next]')?.addEventListener('click',()=>jumpScene(scene.id,scene.index+1));
    if(scene.kind!=='horizontal')continue;
    scene.frame.addEventListener('keydown',event=>{
      if((event.target as Element).closest(controls))return;
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const step=(event.key==='ArrowRight'?1:-1)*(scene.reverse?-1:1);
      jumpScene(scene.id,event.key==='Home'?0:event.key==='End'?scene.panels.length-1:scene.index+step);
    });
    let drag:{pointer:number;x:number;y:number;scroll:number;moved:boolean}|null=null;
    scene.frame.addEventListener('pointerdown',event=>{
      if(!enabled||!scene.active||event.pointerType!=='mouse'||event.button!==0||(event.target as Element).closest(controls))return;
      drag={pointer:event.pointerId,x:event.clientX,y:event.clientY,scroll:scrollY,moved:false};
    });
    scene.frame.addEventListener('pointermove',event=>{
      if(!drag||drag.pointer!==event.pointerId)return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(!drag.moved&&(Math.abs(dx)<8||Math.abs(dy)>Math.abs(dx)))return;
      drag.moved=true;scene.frame.setPointerCapture(event.pointerId);event.preventDefault();root.dataset.lateralDragging='true';
      const sign=scene.reverse?1:-1;
      scrollTo({top:clamp(drag.scroll+dx*sign*1.3,scene.start-height*.15,scene.start+scene.run+height*.15),behavior:'instant'});
    });
    const settle=()=>{
      if(scrollY<scene.start||scrollY>scene.start+scene.run)return;
      jumpScene(scene.id,Math.round((scrollY-scene.start)/scene.run*(scene.panels.length-1)));
    };
    const release=(event:PointerEvent)=>{if(drag?.pointer!==event.pointerId)return;const moved=drag.moved;drag=null;delete root.dataset.lateralDragging;if(scene.frame.hasPointerCapture(event.pointerId))scene.frame.releasePointerCapture(event.pointerId);if(moved&&event.type==='pointerup')settle();};
    scene.frame.addEventListener('pointerup',release);scene.frame.addEventListener('pointercancel',release);scene.frame.addEventListener('lostpointercapture',release);
    scene.frame.addEventListener('dragstart',event=>{if(!(event.target as Element).closest(controls))event.preventDefault();});
    let touch:{x:number;y:number;last:number;horizontal:boolean}|null=null;
    scene.frame.addEventListener('touchstart',event=>{
      if(!enabled||!scene.active||event.touches.length!==1||(event.target as Element).closest(controls)){touch=null;return;}
      touch={x:event.touches[0].clientX,y:event.touches[0].clientY,last:event.touches[0].clientX,horizontal:false};
    },{passive:true});
    scene.frame.addEventListener('touchmove',event=>{
      if(!touch||event.touches.length!==1)return;
      const x=event.touches[0].clientX,y=event.touches[0].clientY,dx=x-touch.x,dy=y-touch.y;
      if(!touch.horizontal){if(Math.abs(dy)>Math.abs(dx)+5){touch=null;return;}if(Math.abs(dx)<10)return;touch.horizontal=true;}
      if(event.cancelable)event.preventDefault();
      scrollBy({top:(x-touch.last)*(scene.reverse?1:-1)*1.5,behavior:'instant'});touch.last=x;
    },{passive:false});
    scene.frame.addEventListener('touchend',()=>{const horizontal=touch?.horizontal;touch=null;if(horizontal)settle();},{passive:true});scene.frame.addEventListener('touchcancel',()=>touch=null,{passive:true});
    scene.frame.addEventListener('wheel',event=>{
      if(!enabled||!scene.active||event.ctrlKey||(event.target as Element).closest(controls)||Math.abs(event.deltaX)<=Math.abs(event.deltaY))return;
      if(!event.cancelable)return;event.preventDefault();
      const unit=event.deltaMode===1?16:event.deltaMode===2?width:1;
      scrollBy({top:event.deltaX*unit*(scene.reverse?-1:1),behavior:'instant'});
    },{passive:false});
  }

  all<HTMLButtonElement>('[data-process-step]').forEach(button=>button.addEventListener('click',()=>jumpScene('processo',Number(button.dataset.processStep))));
  processNodes.forEach((node,index)=>{
    node.addEventListener('click',()=>{if(puzzleSuppressClick){puzzleSuppressClick=false;return;}assembled.add(index);jumpScene('processo',index);request();});
    node.addEventListener('pointerdown',event=>{if(!enabled||event.pointerType!=='mouse'||event.button!==0)return;puzzleDrag={id:index,pointer:event.pointerId,x:event.clientX,y:event.clientY,dx:0,dy:0,moved:false};node.setPointerCapture(event.pointerId);});
    node.addEventListener('pointermove',event=>{if(puzzleDrag?.pointer!==event.pointerId)return;puzzleDrag.dx=event.clientX-puzzleDrag.x;puzzleDrag.dy=event.clientY-puzzleDrag.y;puzzleDrag.moved=Math.hypot(puzzleDrag.dx,puzzleDrag.dy)>6;if(puzzleDrag.moved)event.preventDefault();request();});
    const release=(event:PointerEvent)=>{if(puzzleDrag?.pointer!==event.pointerId)return;const scene=scenes.find(s=>s.id==='processo');if(puzzleDrag.moved&&scene){const board=scene.section.querySelector('.process-board')?.getBoundingClientRect();if(board&&event.clientX>board.left&&event.clientX<board.right&&event.clientY>board.top&&event.clientY<board.bottom)assembled.add(index);puzzleSuppressClick=true;}puzzleDrag=null;if(node.hasPointerCapture(event.pointerId))node.releasePointerCapture(event.pointerId);request();};
    node.addEventListener('pointerup',release);node.addEventListener('pointercancel',release);
  });
  orbitNodes.forEach((node,index)=>node.addEventListener('click',()=>{orbitSelection=index;orbitSelectionAt=sceneProgress.espiral||0;orbitNodes.forEach((item,i)=>item.setAttribute('aria-pressed',String(i===index)));updateOrbitNote(index);request();}));
  if(leaf){
    leaf.addEventListener('pointerdown',event=>{if(!leafEnabled||event.pointerType!=='mouse'||event.button!==0)return;event.preventDefault();leafDrag={x:event.clientX,y:event.clientY};leaf.setPointerCapture(event.pointerId);request();});
    leaf.addEventListener('pointermove',event=>{if(!leafDrag)return;leafDrag={x:event.clientX,y:event.clientY};request();});
    const release=(event:PointerEvent)=>{leafDrag=null;if(leaf.hasPointerCapture(event.pointerId))leaf.releasePointerCapture(event.pointerId);request();};
    leaf.addEventListener('pointerup',release);leaf.addEventListener('pointercancel',release);
  }
  all<HTMLButtonElement>('[data-edition-reading]').forEach(button=>button.addEventListener('click',()=>window.SLMotion.setReading(leafEnabled)));
  addEventListener('scroll',request,{passive:true});
  // Direct input takes over from a requested card transition.
  for(const type of ['wheel','touchstart','pointerdown','keydown'])addEventListener(type,()=>{pendingSceneJump=null;navigationRevision++;},{passive:true,capture:true});
  addEventListener('resize',()=>{
    const revision=navigationRevision;
    const active=pendingSceneJump?.scene||scenes.find(scene=>scene.active&&!scene.flow&&!scene.static);
    const jump=pendingSceneJump?.scene===active?pendingSceneJump:null;
    // Capture the logical position before content/ResizeObserver measurements
    // change scene coordinates, rather than sampling a half-finished frame.
    const progress=jump?jump.index/Math.max(1,jump.scene.panels.length-1):active?.progress;
    clearTimeout(resizeTimer);resizeTimer=window.setTimeout(()=>{
    // Mobile browsers also emit resize without a geometry change. Re-applying
    // an intermediate scroll position here aborts an in-flight smooth jump.
    if(document.documentElement.clientWidth===resizedWidth&&innerHeight===resizedHeight)return;
    // A navigation request may arrive while this resize is being debounced.
    // Prefer that destination (or the newly entered scene) over the old anchor.
    const currentJump=pendingSceneJump||(revision===navigationRevision?jump:null);
    const currentScene=currentJump?.scene||(revision===navigationRevision?active:null)||scenes.find(scene=>scene.active&&!scene.flow&&!scene.static);
    const currentProgress=currentJump?currentJump.index/Math.max(1,currentJump.scene.panels.length-1):currentScene===active?progress:currentScene?.progress;
    resizedWidth=document.documentElement.clientWidth;resizedHeight=innerHeight;
    const landscape=matchMedia('(orientation: landscape)').matches;
    if(innerWidth!==layoutWidth||landscape!==layoutLandscape||(innerWidth>=760&&innerHeight!==layoutHeight)){
      layoutWidth=innerWidth;layoutLandscape=landscape;layoutHeight=smallViewportHeight();configure();
    }else measure();
    // Orientation and window-width changes must retain the same card too.
    if(currentScene&&currentProgress!==undefined&&!paused&&enabled&&!currentScene.static){
      if(currentJump){pendingSceneJump=currentJump;scrollToY(currentScene.start+currentScene.run*currentProgress);}
      else scrollTo({top:currentScene.start+currentScene.run*currentProgress,behavior:'instant'});
    }
  },140);},{passive:true});
  addEventListener('load',measure,{once:true});
  reduced.addEventListener('change',()=>configure());
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;metrics.idle=true;}else request();});
  mast?.addEventListener('focusin',()=>{root.dataset.mastHidden='false';});
  document.fonts?.ready.then(measure);
  document.addEventListener('sl:layout-change',()=>{clearTimeout(layoutTimer);layoutTimer=window.setTimeout(measure,90);});
  // Images/details may change reading flow; observe chapter dimensions, not transforms.
  const resizeObserver=new ResizeObserver(()=>{if(!paused){clearTimeout(layoutTimer);layoutTimer=window.setTimeout(measure,80);}});
  all<HTMLElement>('main > .section').forEach(section=>resizeObserver.observe(section));
  configure(false);render();debug.ready=true;
  if(document.querySelector('dialog[open]'))window.SLMotion.pause();
  document.dispatchEvent(new CustomEvent('sl:ready'));
}

