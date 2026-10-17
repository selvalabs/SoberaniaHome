import '../styles/motion-edition.css';

/** One source of movement: the document's native scroll position.
 * Scenes use CSS sticky, never JS pin spacers. All rendering sleeps at rest. */
type SceneKind = 'horizontal' | 'process' | 'spiral';
type Scene = {
  id: string; kind: SceneKind; section: HTMLElement; sequence: HTMLElement;
  frame: HTMLElement; panels: HTMLElement[]; track: HTMLElement | null;
  reverse: boolean; start: number; run: number; progress: number; index: number;
  offsets: number[]; active: boolean; stage?: HTMLElement; stageWidth: number; stageHeight: number;
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
  let enabled = false, paused = false, raf = 0, resizeTimer = 0;
  let pausedAnchor: {id:string;offset:number}|null=null, modeChangedWhilePaused=false;
  let mastHeight = 72, height = innerHeight, width = innerWidth, maxScroll = 1;
  let previousY = scrollY, directionTravel = 0, activeId = 'hero', leafDrag: {x:number;y:number} | null = null;
  let sections: {element: HTMLElement; top: number; bottom: number}[] = [];
  let origin = {x: innerWidth * .31, y: 240}, dock = {x: innerWidth * .65, y: 0};
  const metrics = {frames: 0, measurements: 0, idle: true};
  const scenes: Scene[] = [];
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
    const scene: Scene = {id,kind,section,sequence,frame,panels,track:section.querySelector('.portfolio-track'),reverse:id==='laboratorio',start:0,run:1,progress:0,index:0,offsets:[],active:false,stageWidth:0,stageHeight:0};
    scene.stage = section.querySelector<HTMLElement>(kind === 'process' ? '.process-periphery' : '.orbit-view') || undefined;
    sequence.dataset.motionScene = kind;
    if(kind==='horizontal') { frame.tabIndex=0; frame.setAttribute('aria-label',id==='trabalho'?'Projetos. Use as setas para explorar.':'Laboratório. Use as setas para explorar.'); }
    scenes.push(scene);
  }

  function compactViewport() { return innerHeight < (innerWidth < 760 ? 700 : 540); }

  function syncControls() {
    const forcedReading = reduced.matches || compactViewport();
    const readingSwitch = document.getElementById('reading-switch') as HTMLInputElement | null;
    if(readingSwitch) { readingSwitch.checked=!enabled; readingSwitch.disabled=forcedReading; }
    const toggle = document.getElementById('toggle-motion-footer') as HTMLButtonElement | null;
    if(toggle) { toggle.textContent=reduced.matches?'Movimento reduzido':enabled?'Modo de leitura':'Ativar experiência';toggle.disabled=forcedReading;toggle.setAttribute('aria-pressed',String(!enabled)); }
    all<HTMLButtonElement>('[data-edition-reading]').forEach(button=>{button.setAttribute('aria-pressed',String(!enabled));button.textContent=reduced.matches?'Leitura tranquila':enabled?'Modo de leitura':'Ativar experiência';button.disabled=forcedReading;});
    debug.enabled=enabled;
    root.dataset.reading=String(!enabled);
  }

  function configure(preserve = true) {
    const anchor = preserve ? sections.find(item=>item.element.id===activeId)?.element : null;
    const oldOffset = anchor ? (scenes.some(scene=>scene.id===activeId&&scene.active)?mastHeight:anchor.getBoundingClientRect().top) : 0;
    const nextEnabled=!requestedReading&&!reduced.matches&&!compactViewport();
    if(paused&&nextEnabled!==enabled)modeChangedWhilePaused=true;
    enabled=nextEnabled;
    root.classList.toggle('motion',enabled);
    root.classList.add('motion-edition');
    root.dataset.mastHidden='false';
    for(const item of all<HTMLElement>('#hero,#folha,#deslocamento-1,#deslocamento-2')) item.dataset.pin='false';
    for(const scene of scenes) {
      scene.sequence.style.removeProperty('height');
      scene.track?.style.removeProperty('transform');
      scene.panels.forEach(panel=>{panel.inert=false;panel.removeAttribute('aria-hidden');panel.style.removeProperty('opacity');panel.hidden=false;});
    }
    if(flight) flight.hidden=!enabled;
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
      scene.run=enabled ? Math.round(scene.kind==='horizontal'?steps*clamp(width*.66,430,900):scene.kind==='process'?clamp(height*1.8,1100,1650):clamp(height*1.25,760,1150)) : 0;
      scene.sequence.style.setProperty('--motion-run',`${scene.run}px`);
      scene.sequence.style.height=enabled?`${height-mastHeight+scene.run}px`:'';
      if(scene.track) {
        // row-reverse already defines the laboratory's spatial direction.
        const viewport=scene.track.parentElement?.clientWidth||width;
        scene.offsets=scene.panels.map(card=>card.offsetLeft+card.offsetWidth/2-viewport/2);
      }
      scene.stageWidth=scene.stage?.clientWidth||0;scene.stageHeight=scene.stage?.clientHeight||0;
    }
    const y=scrollY;
    scenes.forEach(scene=>{scene.start=scene.sequence.getBoundingClientRect().top+y-mastHeight;});
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
      scene.progress=enabled?clamp((y-scene.start)/Math.max(1,scene.run)):1;
      scene.active=enabled&&y>=scene.start-2&&y<=scene.start+scene.run+2;
      scene.index=Math.round(scene.progress*Math.max(1,scene.panels.length-1));
      sceneProgress[scene.id]=scene.progress;
      if(enabled) {
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
    if(enabled)renderLeaf(y);
    debug.scenes=scenes.map(s=>({id:s.id,start:s.start,end:s.start+s.run,raw:s.progress*(s.panels.length-1),visual:s.progress*(s.panels.length-1),lastIndex:s.index,static:!enabled}));
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
    const scale=Math.min(w*.78/1536,h*.79/1024);
    if(board){board.style.width=`${1536*scale}px`;board.style.height=`${1024*scale}px`;}
    processNodes.forEach((node,index)=>{
      const built=assembled.has(index)?1:smooth((scene.progress-index*.14)/.3);
      const [ox,oy]=processOrigins[index];
      const dx=(index%3-1)*w*.11*(1-built),dy=(index<3?-1:1)*h*.18*(1-built);
      node.style.left=`${(ox-82)*scale}px`;node.style.top=`${(oy-72)*scale}px`;
      node.style.width=`${662*scale}px`;node.style.height=`${568*scale}px`;
      const drag=puzzleDrag?.id===index?puzzleDrag:null;
      node.style.transform=`translate3d(${dx+(drag?.dx||0)}px,${dy+(drag?.dy||0)}px,0) rotate(${(index%2?1:-1)*10*(1-built)}deg)`;
      node.classList.toggle('is-active',index===scene.index);node.classList.toggle('is-assembled',built>.98);
      node.setAttribute('aria-pressed',String(index===scene.index));
    });
    scene.panels.forEach((panel,index)=>{
      panel.classList.toggle('is-active',index===scene.index);panel.classList.toggle('is-past',index<scene.index);
      panel.style.setProperty('--step-light',index<=scene.index?'1':'.45');
      const button=panel.querySelector('button');if(index===scene.index)button?.setAttribute('aria-current','step');else button?.removeAttribute('aria-current');
    });
  }

  function renderSpiral(scene:Scene) {
    if(orbitSelection!==null&&Math.abs(scene.progress-orbitSelectionAt)>.13)orbitSelection=null;
    const selected=orbitSelection??[0,3,4,7][scene.index]??0;
    const w=scene.stageWidth,h=scene.stageHeight,base=Math.min(w,h);
    orbitNodes.forEach((node,index)=>{
      const angle=index/orbitNodes.length*Math.PI*2-Math.PI/2+scene.progress*.7;
      const radius=base*(index%2?.36:.43);
      node.style.left=`${w/2+Math.cos(angle)*radius}px`;node.style.top=`${h/2+Math.sin(angle)*radius*.84}px`;
      node.setAttribute('aria-pressed',String(index===selected));
    });
    const ring=scene.section.querySelector<HTMLElement>('.ring-outer');if(ring)ring.style.transform=`translate(-50%,-50%) rotate(${scene.progress*70}deg)`;
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
    const p=clamp(y/maxScroll),hero=sections[0];
    const launch=clamp(y/Math.max(1,(hero?.bottom||height)-height*.32));
    let x=mix(origin.x,width*.53,smooth(launch))+Math.sin(p*Math.PI*12)*width*.15*Math.sin(launch*Math.PI/2);
    if(launch>=1)x=width*(.075+Math.sin(p*Math.PI*10)*.022);
    let ly=mix(origin.y-y,height*.49,smooth(launch));
    let rz=118-Math.sin(p*Math.PI*12)*42+smooth(launch)*70,rx=Math.sin(p*Math.PI*9)*25,ry=Math.sin(p*Math.PI*13)*48;
    let scale=width<760?.66:.82;
    const scene=scenes.find(s=>s.kind==='horizontal'&&y>=s.start-height*.25&&y<=s.start+s.run+height*.25);
    if(scene) {
      const q=scene.progress,sign=scene.reverse?-1:1;
      const weight=smooth((y-scene.start+height*.25)/(height*.25))*(1-smooth((y-scene.start-scene.run)/(height*.25)));
      x=mix(x,width*(.5+Math.sin(q*Math.PI*2)*.22*sign),weight);
      ly=mix(ly,height*(.49+Math.sin(q*Math.PI*3)*.035),weight);
      rz+=sign*q*180*weight;ry+=Math.sin(q*Math.PI*2)*50*weight;
    }
    const dockY=dock.y-y,land=smooth((height+180-dockY)/(height*.7+180));
    x=mix(x,dock.x,land);ly=mix(ly,dockY,land);rz=mix(rz,96,land);rx=mix(rx,7,land);ry=mix(ry,0,land);scale=mix(scale,.74,land);
    if(y>=maxScroll-1){x=dock.x;ly=dockY;rz=96;rx=7;ry=0;}
    if(leafDrag){x=leafDrag.x;ly=leafDrag.y;}
    // The leaf passes behind the dark fields, retaining a faint ecological trace.
    const dark=sections.find(s=>['processo','espiral'].includes(s.element.id)&&y+ly>s.top&&y+ly<s.bottom);
    const occluded=(!!dark||activeId==='referencias')&&!leafDrag;
    flight.style.opacity=occluded?'0':scene||launch<1||leafDrag?'1':'.68';flight.style.visibility=occluded?'hidden':'visible';
    flight.style.transform=`translate3d(${x}px,${ly}px,0)`;
    depth.style.transform=`translate(-50%,-91%) scale(${scale})`;
    leaf.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
    root.dataset.leafOccluded=occluded?'1':'0';root.dataset.leafDepth='front';
    debug.leaf={x,y:ly,rotation:rz,mode:land>.99?'rest':'flight',occlusionState:occluded?'occluded':'visible'};
    // Limit geometry reads to the current chapter, only after input changes.
    all<HTMLElement>('[data-leaf-lit]').forEach(mark=>{delete mark.dataset.leafLit;mark.style.removeProperty('--leaf-glow');});
    if(!occluded){
      const current=sections.find(s=>s.element.id===activeId)?.element;
      if(current)for(const mark of all<HTMLElement>('strong,em',current).slice(0,28)){
        const r=mark.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>height)continue;
        const distance=Math.hypot(Math.max(r.left-x,0,x-r.right)*.3,(r.top+r.bottom)/2-ly);
        const glow=1-clamp(distance/100);if(glow>.03){mark.dataset.leafLit='true';mark.style.setProperty('--leaf-glow',String(glow));}
      }
    }
  }

  function scrollToY(top:number) { scrollTo({top:clamp(top,0,maxScroll),behavior:reduced.matches||!enabled||Math.abs(top-scrollY)>height*1.5?'instant':'smooth'});request(); }
  function jumpSection(id:string) {
    const section=document.getElementById(id);if(!section)return;
    const top=section.getBoundingClientRect().top+scrollY-mastHeight;
    root.dataset.mastHidden='false';scrollToY(top);request();
  }
  function jumpScene(id:string,index:number) {
    const scene=scenes.find(item=>item.id===id);if(!scene){jumpSection(id);return;}
    const i=clamp(index,0,scene.panels.length-1);
    if(enabled)scrollToY(scene.start+scene.run*i/Math.max(1,scene.panels.length-1));
    else scene.panels[i]?.scrollIntoView({block:'center',behavior:'instant'});
  }
  window.SLMotion={
    pause(){const anchor=sections.find(s=>s.element.id===activeId)?.element;pausedAnchor=anchor?{id:activeId,offset:scenes.some(scene=>scene.id===activeId&&scene.active)?mastHeight:anchor.getBoundingClientRect().top}:null;paused=true;root.dataset.mastHidden='false';if(raf)cancelAnimationFrame(raf);raf=0;metrics.idle=true;},
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
    const release=(event:PointerEvent)=>{if(drag?.pointer!==event.pointerId)return;drag=null;delete root.dataset.lateralDragging;if(scene.frame.hasPointerCapture(event.pointerId))scene.frame.releasePointerCapture(event.pointerId);};
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
    scene.frame.addEventListener('touchend',()=>touch=null,{passive:true});scene.frame.addEventListener('touchcancel',()=>touch=null,{passive:true});
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
    leaf.addEventListener('pointerdown',event=>{if(!enabled||event.pointerType!=='mouse'||event.button!==0)return;event.preventDefault();leafDrag={x:event.clientX,y:event.clientY};leaf.setPointerCapture(event.pointerId);request();});
    leaf.addEventListener('pointermove',event=>{if(!leafDrag)return;leafDrag={x:event.clientX,y:event.clientY};request();});
    const release=(event:PointerEvent)=>{leafDrag=null;if(leaf.hasPointerCapture(event.pointerId))leaf.releasePointerCapture(event.pointerId);request();};
    leaf.addEventListener('pointerup',release);leaf.addEventListener('pointercancel',release);
  }
  all<HTMLButtonElement>('[data-edition-reading]').forEach(button=>button.addEventListener('click',()=>window.SLMotion.setReading(enabled)));
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=window.setTimeout(()=>configure(),140);},{passive:true});
  addEventListener('load',measure,{once:true});
  reduced.addEventListener('change',()=>configure());
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;metrics.idle=true;}else request();});
  mast?.addEventListener('focusin',()=>{root.dataset.mastHidden='false';});
  document.fonts?.ready.then(measure);
  document.addEventListener('sl:layout-change',()=>{clearTimeout(resizeTimer);resizeTimer=window.setTimeout(measure,90);});
  // Images/details may change reading flow; observe chapter dimensions, not transforms.
  const resizeObserver=new ResizeObserver(()=>{if(!paused){clearTimeout(resizeTimer);resizeTimer=window.setTimeout(measure,80);}});
  all<HTMLElement>('main > .section').forEach(section=>resizeObserver.observe(section));
  configure(false);render();debug.ready=true;
  if(document.querySelector('dialog[open]'))window.SLMotion.pause();
  document.dispatchEvent(new CustomEvent('sl:ready'));
}

