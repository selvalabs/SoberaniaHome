import '../styles/motion-edition.css';
import { createHeroPrint } from './hero-print';
import { leafScrollClock } from './leaf-scroll-clock';
import { galleryLeafSpiral } from './leaf-gallery-spiral';
import { createLeafFlight, leafGust, lifeOrbit, LEAF_SCROLL_PACE } from './leaf-physics';
import { createLeafReturn, LEAF_RETURN_SECONDS, type LeafPose } from './leaf-return';
import { glowColor, textSurface } from './leaf-contrast';
import { initWorkMarquee } from './work-marquee';
import { createLandingInk } from './landing-ink';
import { createNetworkFlow } from './network-flow';
import { sampleNetwork, networkPasses } from './network-flow-model';

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
  const hero = document.getElementById('hero');
  const brandSignature = initBrandSignature(hero);
  const workMarquee = initWorkMarquee();
  const heroPrint = createHeroPrint(hero);
  const choicesPrint = createHeroPrint(document.getElementById('folha'), {
    stage: '.choices-print-stage', message: '.choices-print-body', finishAtBottom: true,
    blocks: '.choices-opening > p,.choices-benefit', keepHeading: true, sidecar: '.choices-sketch'
  });
  const landingInk = createLandingInk();
  const networkPrint = createHeroPrint(document.getElementById('meios-digitais'), {
    stage: '.network-stage', message: '.network-message', blocks: '.network-act',
    keepHeading: true, footer: '.network-footer', isolateBlocks: true, runMultiplier: 1.8, passes: networkPasses
  });
  const networkFlow = createNetworkFlow();
  const knowledgePrint = createHeroPrint(document.getElementById('deslocamento-2'), {
    stage: '.knowledge-cover-stage', message: '.knowledge-cover-copy',
    blocks: '.knowledge-cover-copy > p', keepHeading: true
  });
  const handoverPrint = createHeroPrint(document.getElementById('handover-drawing'), {
    stage: '.handover-ink-stage', message: '.handover-ink-message',
    blocks: '.handover-ink-message > p', keepHeading: true
  });
  addEventListener('beforeprint',()=>landingInk.print());
  addEventListener('beforeprint',()=>networkFlow.render(1,false));
  addEventListener('afterprint',()=>landingInk.restore());
  addEventListener('afterprint',()=>networkFlow.render(networkPrint?.render(scrollY) ?? 0,enabled));
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
  let previousY = scrollY, directionTravel = 0, activeId = 'hero', leafDrag: {pointer:number;offsetX:number;offsetY:number;pose:LeafPose} | null = null;
  let leafPose:LeafPose|null=null, naturalLeafPose:LeafPose|null=null;
  let leafReturn:{sample:ReturnType<typeof createLeafReturn>;elapsed:number;last:number}|null=null;
  let sections: {element: HTMLElement; top: number; bottom: number}[] = [];
  let readingAnchor: {element:HTMLElement; top:number; focused:boolean} | null = null;
  let origin = {x: innerWidth * .31, y: 240}, dock = {x: innerWidth * .65, y: 0};
  const leafFlight = createLeafFlight();
  const metrics = {frames: 0, measurements: 0, idle: true};
  const scenes: Scene[] = [];
  let pendingSceneJump: {scene: Scene; index: number} | null = null;
  let navigationRevision=0;
  // Cache editorial targets once. Product interfaces and controls keep their own colors.
  const glowTargets = all<HTMLElement>('main h1,main h2,main h3,main p,main figcaption,main .technology-note,main .knowledge-note,main .eyebrow-lab,.brand-signature .eyebrow-tech-label')
    .filter(el => !el.closest('button,a,.work-marquee,.work-evidence,.cooperative-screen,.process-panels,.orbit-view,#referencias,dialog'))
    .flatMap(el => {
      const marks=all<HTMLElement>('strong,em,.hero-future,.choices-pencil,.choices-paper,.choices-ink',el);
      return marks.length ? marks : [el];
    });
  const heroGlowTargets=new Set(glowTargets.filter(mark=>mark.matches('.eyebrow-lab,.eyebrow-tech-label')));
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
  const inkRuns=new Map(glowTargets.map(mark=>[mark,all<HTMLElement>('.leaf-ink',mark)]));
  const inkSurfaces=new Map<HTMLElement,ReturnType<typeof textSurface>>();
  function refreshInk() {
    clearLeafGlow();
    for(const mark of glowTargets){mark.style.removeProperty('--leaf-ink');mark.style.setProperty('--leaf-ink',getComputedStyle(mark).color);}
    for(const ink of new Set([...inkRuns.values()].flat())){
      ink.style.removeProperty('--leaf-ink');
      const surface=textSurface(ink);inkSurfaces.set(ink,surface);
      ink.style.setProperty('--leaf-ink',surface.color);
    }
  }
  refreshInk();
  document.addEventListener('sl:themechange',()=>{
    refreshInk();
    request();
  });
  const processNodes = all<HTMLButtonElement>('#processo .process-node');
  const assembled = new Set<number>();
  let puzzleDrag: {id:number; pointer:number; x:number; y:number; dx:number; dy:number; moved:boolean} | null = null;
  let puzzleSuppressClick = false;
  let orbitSelection: number | null = null, orbitSelectionAt = 0;
  const orbitNodes = all<HTMLButtonElement>('#espiral [data-orbit-node]');
  const processOrigins = [[20,88],[518,88],[1016,88],[20,507],[518,507],[1016,507]];
  const debug: any = window.__SL_DEBUG = {ready:false,enabled:false,activeId:'hero',scenes:[],leaf:{},metrics,scroll:scrollY,maxScroll:1,ink:landingInk.debug};

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
    if(!leafEnabled){clearLeafGlow();cancelLeafInteraction();}
    syncControls(); measure();
    if(anchor&&!paused) scrollTo({top:scrollY+anchor.getBoundingClientRect().top-oldOffset,behavior:'instant'});
    request();
  }

  function measure() {
    if(paused) return;
    metrics.measurements++;
    width=document.documentElement.clientWidth;height=innerHeight;
    mastHeight=mast?.offsetHeight||64;
    heroPrint?.measure(enabled,height,width,mastHeight,layoutHeight);
    choicesPrint?.measure(enabled,height,width,mastHeight,layoutHeight);
    networkPrint?.measure(enabled,height,width,mastHeight,layoutHeight);
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
      if(scene.flow){scene.sequence.style.setProperty('--process-intro-height',`${scene.section.querySelector<HTMLElement>('.process-intro')?.offsetHeight||0}px`);scene.sequence.style.setProperty('--process-head-height',`${scene.frame.querySelector<HTMLElement>('.scene-head')?.offsetHeight||0}px`);}
      scene.stageWidth=scene.stage?.clientWidth||0;scene.stageHeight=scene.stage?.clientHeight||0;
    }
    // The work gallery precedes this reveal. Its resized height must settle
    // before the knowledge section captures its document-space pin anchor.
    knowledgePrint?.measure(enabled,height,width,mastHeight,layoutHeight);
    handoverPrint?.measure(enabled,height,width,mastHeight,layoutHeight);
    const y=scrollY;
    scenes.forEach(scene=>{
      scene.start=scene.sequence.getBoundingClientRect().top+y-(scene.kind==='horizontal'&&(width<760||height<620)?0:mastHeight);
      if(scene.flow&&leafEnabled){
        const first=scene.panels[0]?.getBoundingClientRect(),last=scene.panels.at(-1)?.getBoundingClientRect();
        if(first&&last){scene.start=first.top+y-processClearance(scene)-scene.stageHeight-24;scene.run=Math.max(1,last.top-first.top);}
      }
    });
    sections=all<HTMLElement>('main > .section').map(element=>{const r=element.getBoundingClientRect();return{element,top:r.top+y,bottom:r.bottom+y};});
    maxScroll=Math.max(1,document.documentElement.scrollHeight-height);
    const o=(document.getElementById('leaf-origin')||document.getElementById('cover-origin'))?.getBoundingClientRect();
    const d=document.getElementById('leaf-dock')?.getBoundingClientRect();
    const naturalOrigin = heroPrint?.naturalGeometry().origin;
    if(naturalOrigin)origin={...naturalOrigin};
    else if(o)origin={x:o.left+o.width/2,y:o.top+y};
    debug.leafOrigin={...origin};
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
    heroPrint?.render(y);
    const choicesProgress = choicesPrint?.render(y) ?? 0;
    const networkProgress = networkPrint?.render(y) ?? 0;
    const knowledgeProgress=knowledgePrint?.render(y) ?? 0;
    const handoverProgress=handoverPrint?.render(y) ?? 0;
    const networkState=sampleNetwork(networkProgress,enabled);
    landingInk.render({workbench:choicesProgress,knowledge:knowledgeProgress,handover:handoverProgress,network:networkState.ink,'network-solution':networkState.responseInk},enabled);
    networkFlow.render(networkProgress,enabled);
    debug.network=networkFlow.debug;
    const networkMeter=document.querySelector<HTMLElement>('[data-network-meter]');
    if(networkMeter)networkMeter.style.transform=`scaleX(${enabled?networkProgress:1})`;
    renderBrandSignature(brandSignature, mast, y, height, width);
    for(const scene of scenes) {
      const animated=enabled&&!scene.static;
      scene.progress=animated||scene.flow&&leafEnabled?clamp((y-scene.start)/Math.max(1,scene.run)):1;
      scene.active=(animated||scene.flow&&leafEnabled)&&y>=scene.start-2&&y<=scene.start+scene.run+2;
      scene.index=Math.round(scene.progress*Math.max(1,scene.panels.length-1));
      if(scene.flow&&leafEnabled){
        const focus=processClearance(scene)+scene.stageHeight+32;
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
    if(leafEnabled){renderLeaf(y);renderHeroGlow(y);}
    rememberReadingPosition();
    debug.scenes=scenes.map(s=>({id:s.id,start:s.start,end:s.start+s.run,raw:s.progress*(s.panels.length-1),visual:s.progress*(s.panels.length-1),lastIndex:s.index,static:!enabled||s.static,flow:s.flow}));
    metrics.idle=true;
    if(leafReturn&&leafEnabled)request();
  }

  function rememberReadingPosition() {
    readingAnchor=null;
    if(width>=760||sections.find(item=>item.element.id===activeId)?.element.dataset.printPinned==='true'||scenes.some(scene=>scene.active&&!scene.flow&&!scene.static))return;
    const chapter=sections.find(item=>item.element.id===activeId)?.element;
    if(!chapter)return;
    const focus=document.activeElement;
    const field=focus instanceof HTMLElement&&chapter.contains(focus)&&focus.matches('input,textarea,select')?focus:null;
    const candidates=field?[field]:all<HTMLElement>('h2,h3,p,summary,button,a,label',chapter);
    for(const element of candidates){
      const rect=element.getBoundingClientRect();
      if(rect.width>0&&rect.bottom>mastHeight+8&&rect.top<height*.8){
        readingAnchor={element,top:rect.top,focused:element===field};break;
      }
    }
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

  function processClearance(scene:Scene) {
    return mastHeight+(scene.section.querySelector<HTMLElement>('.process-intro')?.offsetHeight||0)+(scene.frame.querySelector<HTMLElement>('.scene-head')?.offsetHeight||0);
  }

  function renderProcess(scene:Scene) {
    const board=scene.section.querySelector<HTMLElement>('.process-board');
    const w=scene.stageWidth,h=scene.stageHeight;
    const scale=Math.min(w*(scene.flow ? .72 : .78)/1536,h*(scene.flow ? .9 : .79)/1024);
    if(board){board.style.width=`${1536*scale}px`;board.style.height=`${1024*scale}px`;}
    processNodes.forEach((node,index)=>{
      const built=assembled.has(index)?1:smooth((scene.progress-index*.14)/.3);
      const [ox,oy]=processOrigins[index];
      const dx=(index%3-1)*w*(scene.flow ? .085 : .11)*(1-built),dy=(index<3?-1:1)*h*(scene.flow ? .11 : .18)*(1-built);
      node.style.left=`${(ox-82)*scale}px`;node.style.top=`${(oy-72)*scale}px`;
      node.style.width=`${662*scale}px`;node.style.height=`${568*scale}px`;
      const drag=puzzleDrag?.id===index?puzzleDrag:null;
      node.style.transform=`translate3d(${dx+(drag?.dx||0)}px,${dy+(drag?.dy||0)}px,0) rotate(${(index%2?1:-1)*(scene.flow?12:10)*(1-built)}deg)`;
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
    // Reveal runway is reading time, not extra distance from the branch.
    const runways=[heroPrint?.runway(),choicesPrint?.runway(),networkPrint?.runway(),knowledgePrint?.runway(),handoverPrint?.runway()].filter((item):item is NonNullable<typeof item>=>!!item);
    const leafScroll=(position:number)=>leafScrollClock(position,runways);
    const clockY=leafScroll(y);
    const launchBottom=heroPrint?.naturalGeometry().bottom||hero?.bottom||height;
    const launch=clamp(clockY/Math.max(1,(launchBottom-height*.32)*1.22));
    const travel=smooth(launch);
    // Scroll is the clock, not the force. Replaying the same position restores
    // the same inertial state, even after a jump, reversal or toolbar resize.
    const clockScale=LEAF_SCROLL_PACE/Math.max(layoutHeight,1),time=clockY*clockScale;
    const physics=leafFlight(time);
    const horizontal=enabled?scenes.filter(s=>s.kind==='horizontal'):[];
    const bursts=horizontal.flatMap(s=>{
      const starts=[s.start+s.run*.04];
      for(let elapsed=3.4;elapsed<s.run*clockScale-.6;elapsed+=3.4)starts.push(s.start+elapsed/clockScale);
      return starts.map(start=>({time:leafScroll(start)*clockScale,direction:s.reverse?1:-1}));
    });
    // Occasional turns continue in editorial folds. Keep them away from the
    // gallery gusts so entering a scene does not pile up two strong impulses.
    bursts.push({time:-.45,direction:1});
    for(let at=3.6;at<=time;at+=4.6){
      if(!horizontal.some(s=>at> leafScroll(s.start)*clockScale-2&&at<leafScroll(s.start+s.run)*clockScale+1.6))
        bursts.push({time:at,direction:Math.floor(at/4.6)%3===2?-1:1});
    }
    let drift=0,turn=0,spin=0;
    // Finish each turn before approaching the resting place in the footer.
    const lastGust=leafScroll(dock.y-height-180)*clockScale-4;
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
    let galleryRoll=0,galleryEnvelope=0,gallerySpiralX=0,gallerySpiralY=0;
    for(const gallery of horizontal){
      const local=galleryLeafSpiral((y-gallery.start)/Math.max(1,gallery.run),gallery.panels.length-1,gallery.reverse?1:-1);
      galleryRoll+=local.roll;
      if(local.envelope<.000001)continue;
      galleryEnvelope=local.envelope;
      // Recenter the helical flight so each loop can open without edge clamping.
      x=mix(x,width*(.5+lateral*.18+drift*.06),local.envelope*.85);
      const dx=local.x*Math.min(104,width*.15),dy=local.y*Math.min(58,height*.065);
      gallerySpiralX=dx;gallerySpiralY=dy;
      x+=dx;ly+=dy;
      rx+=local.pitch;ry+=local.yaw;rz+=local.bank;
      scale*=1+local.envelope*.06*Math.sin(local.roll*Math.PI/180);
    }
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
    const flightTurn=turn+galleryRoll+orbitPhase/(Math.PI*2*1.25)*720;
    let roll=mix(flightTurn,Math.round(flightTurn/360)*360,land);
    x=mix(x,dock.x,land);ly=mix(ly,dockY,land);rz=mix(rz,96,land);rx=mix(rx,7,land);ry=mix(ry,0,land);scale=mix(scale,.74,land);
    if(y>=maxScroll-1){x=dock.x;ly=dockY;rz=96;rx=7;ry=0;}
    let pivot=mix(91,50,travel);
    naturalLeafPose={x,y:ly,rotation:rz,pitch:rx,yaw:ry,roll,scale,pivot};
    let pose=naturalLeafPose;
    if(leafDrag)pose=leafDrag.pose;
    else if(leafReturn){
      const now=performance.now();
      leafReturn.elapsed+=Math.min(.05,Math.max(0,(now-leafReturn.last)/1000));
      leafReturn.last=now;
      pose=leafReturn.sample(leafReturn.elapsed,naturalLeafPose);
      if(leafReturn.elapsed>=LEAF_RETURN_SECONDS)leafReturn=null;
    }
    ({x,y:ly,rotation:rz,pitch:rx,yaw:ry,roll,scale,pivot}=pose);
    flight.style.visibility='visible';
    flight.style.transform=`translate3d(${x}px,${ly}px,0)`;
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
    workMarquee?.setLeafLight({x:lightX,y:lightY,hue:y*.16,radius:clamp(height*.17,95,170)});
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
    leafPose={x,y:ly,rotation:rz,pitch:rx,yaw:ry,roll,scale,pivot};
    debug.leaf={returning:!!leafReturn,dragging:!!leafDrag,returnElapsed:leafReturn?.elapsed??0,x,y:ly,rotation:rz,pitch:rx,yaw:ry,roll,drift,spin,orbitWeight,orbitPhase,galleryRoll,galleryEnvelope,gallerySpiralX,gallerySpiralY,clock:time,clockScroll:clockY,wind:physics.wind,lateralSpeed:physics.vx,fallSpeed:physics.fallSpeed,mode:land>.99?'rest':orbitWeight>.99?'orbit':'flight',occlusionState:softened?'softened':'visible'};
    // Light follows the painted blade, including text alongside a mockup.
    const nextLit=new Set<HTMLElement>();
    for(const [index,mark] of glowTargets.entries()){
      if(heroGlowTargets.has(mark))continue;
      if(mark.closest('[inert],[aria-hidden="true"]'))continue;
      const r=mark.getBoundingClientRect();
      if(!r.width||!r.height||r.bottom<mastHeight||r.top>height)continue;
      const vertical=Math.max(r.top-lightY,0,lightY-r.bottom);
      const horizontal=scene?0:Math.max(r.left-lightX,0,lightX-r.right)*.18;
      const glow=1-smooth(Math.hypot(vertical,horizontal)/clamp(height*.17,95,170));
      if(glow>.03){
        nextLit.add(mark);mark.dataset.leafLit='true';
        mark.style.setProperty('--leaf-glow',String(glow));
        const hue=(y*.16+index*47)%360;
        mark.style.setProperty('--leaf-hue',String(hue));
        for(const ink of inkRuns.get(mark)||[]){
          const surface=inkSurfaces.get(ink);
          if(surface)ink.style.setProperty('--leaf-glow-color',`rgb(${glowColor(hue,surface.background,surface.foreground).join(',')})`);
        }
        mark.style.setProperty('--leaf-light-y',`${lightY-r.top}px`);
      }
    }
    for(const mark of litMarks)if(!nextLit.has(mark))resetLeafMark(mark);
    litMarks.clear();nextLit.forEach(mark=>litMarks.add(mark));
  }

  function resetLeafMark(mark:HTMLElement) {
    delete mark.dataset.leafLit;
    for(const property of ['--leaf-glow','--leaf-hue','--leaf-light-y'])mark.style.removeProperty(property);
  }
  function clearLeafGlow() {
    workMarquee?.setLeafLight(null);
    litMarks.forEach(resetLeafMark);litMarks.clear();
    heroGlowTargets.forEach(mark=>delete mark.dataset.scrollGlow);
  }

  // The opening signature follows only document scroll, including reversal.
  // Dragging/returning the leaf must never move or attenuate this color wave.
  function renderHeroGlow(y:number) {
    for(const mark of heroGlowTargets){
      const rect=mark.getBoundingClientRect();
      if(rect.bottom<0||rect.top>height){delete mark.dataset.scrollGlow;continue;}
      mark.dataset.scrollGlow='true';
      mark.style.setProperty('--signature-sweep',`${y*.7}%`);
      for(const ink of inkRuns.get(mark)||[]){
        const surface=inkSurfaces.get(ink);if(!surface)continue;
        for(const [i,offset] of [0,90,190].entries()){
          const color=glowColor(315+y*.85+offset,surface.background,surface.foreground);
          ink.style.setProperty(`--signature-color-${i}`,`rgb(${color.join(',')})`);
          if(i===0)ink.style.setProperty('--signature-halo',`rgb(${color.join(' ')} / .3)`);
        }
      }
    }
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
    if(scene.flow&&leafEnabled)scrollToY(scrollY+scene.panels[i].getBoundingClientRect().top-processClearance(scene)-scene.stageHeight-24);
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
  function cancelLeafInteraction(){
    const pointer=leafDrag?.pointer;leafDrag=null;leafReturn=null;
    if(pointer!==undefined&&leaf?.hasPointerCapture(pointer))leaf.releasePointerCapture(pointer);
  }
  if(leaf){
    leaf.addEventListener('pointerdown',event=>{
      if(!leafEnabled||paused||!leafPose||event.pointerType!=='mouse'||event.button!==0)return;
      event.preventDefault();leafReturn=null;
      leafDrag={pointer:event.pointerId,offsetX:leafPose.x-event.clientX,offsetY:leafPose.y-event.clientY,pose:{...leafPose}};
      leaf.setPointerCapture(event.pointerId);request();
    });
    leaf.addEventListener('pointermove',event=>{
      if(leafDrag?.pointer!==event.pointerId)return;
      leafDrag.pose.x=event.clientX+leafDrag.offsetX;leafDrag.pose.y=event.clientY+leafDrag.offsetY;request();
    });
    const release=(event:PointerEvent)=>{
      if(leafDrag?.pointer!==event.pointerId)return;
      const from=leafPose, target=naturalLeafPose;leafDrag=null;
      if(from&&target&&leafEnabled){
        const distance=Math.hypot(from.x-target.x,from.y-target.y);
        leafReturn={sample:createLeafReturn(from,debug.leaf?.clock??0,distance),elapsed:0,last:performance.now()};
      }
      if(leaf.hasPointerCapture(event.pointerId))leaf.releasePointerCapture(event.pointerId);
      request();
    };
    leaf.addEventListener('pointerup',release);leaf.addEventListener('pointercancel',release);leaf.addEventListener('lostpointercapture',release);
  }
  all<HTMLButtonElement>('[data-edition-reading]').forEach(button=>button.addEventListener('click',()=>window.SLMotion.setReading(leafEnabled)));
  addEventListener('scroll',request,{passive:true});
  document.addEventListener('focusin',event=>{if(event.target instanceof HTMLElement&&event.target.matches('main input,main textarea,main select'))request();});
  // Direct input takes over from a requested card transition.
  for(const type of ['wheel','touchstart','pointerdown','keydown'])addEventListener(type,()=>{pendingSceneJump=null;navigationRevision++;},{passive:true,capture:true});
  addEventListener('resize',()=>{
    const revision=navigationRevision;
    const reading=readingAnchor?{...readingAnchor}:null,resizeY=scrollY;
    const print=all<HTMLElement>('main [data-print-pinned="true"]').find(element=>scrollY>=Number(element.dataset.printStart)&&scrollY<=Number(element.dataset.printStart)+Number(element.dataset.printRun));
    const printStart=Number(print?.dataset.printStart),printRun=Number(print?.dataset.printRun);
    const active=pendingSceneJump?.scene||scenes.find(scene=>scene.active&&!scene.flow&&!scene.static);
    const jump=pendingSceneJump?.scene===active?pendingSceneJump:null;
    // Capture the logical position before content/ResizeObserver measurements
    // change scene coordinates, rather than sampling a half-finished frame.
    const progress=jump?jump.index/Math.max(1,jump.scene.panels.length-1):active?.progress;
    clearTimeout(layoutTimer);
    clearTimeout(resizeTimer);resizeTimer=window.setTimeout(()=>{
    resizeTimer=0;
    // Mobile browsers also emit resize without a geometry change. Re-applying
    // an intermediate scroll position here aborts an in-flight smooth jump.
    if(document.documentElement.clientWidth===resizedWidth&&innerHeight===resizedHeight)return;
    // A navigation request may arrive while this resize is being debounced.
    // Prefer that destination (or the newly entered scene) over the old anchor.
    const currentJump=pendingSceneJump||(revision===navigationRevision?jump:null);
    const currentScene=currentJump?.scene||(revision===navigationRevision?active:null)||scenes.find(scene=>scene.active&&!scene.flow&&!scene.static);
    const currentProgress=currentJump?currentJump.index/Math.max(1,currentJump.scene.panels.length-1):currentScene===active?progress:currentScene?.progress;
    const printProgress=print&&revision===navigationRevision?clamp((scrollY-printStart)/printRun):undefined;
    const readingTop=reading?.top!==undefined?reading.top-(scrollY-resizeY):0;
    resizedWidth=document.documentElement.clientWidth;resizedHeight=innerHeight;
    const landscape=matchMedia('(orientation: landscape)').matches;
    if(innerWidth!==layoutWidth||landscape!==layoutLandscape||(innerWidth>=760&&innerHeight!==layoutHeight)){
      layoutWidth=innerWidth;layoutLandscape=landscape;layoutHeight=smallViewportHeight();configure();
    }else measure();
    // Orientation and window-width changes must retain the same card too.
    if(currentScene&&currentProgress!==undefined&&!paused&&enabled&&!currentScene.static){
      if(currentJump){pendingSceneJump=currentJump;scrollToY(currentScene.start+currentScene.run*currentProgress);}
      else scrollTo({top:currentScene.start+currentScene.run*currentProgress,behavior:'instant'});
    }else if(print&&printProgress!==undefined&&!paused&&enabled){
      scrollTo({top:Number(print.dataset.printStart)+Number(print.dataset.printRun)*printProgress,behavior:'instant'});
    }else if(reading&&revision===navigationRevision&&!paused&&reading.element.isConnected){
      // Reflow the scenes above a chapter without taking away the paragraph
      // being read. A focused field also stays above a resized keyboard area.
      const rect=reading.element.getBoundingClientRect();
      const top=reading.focused?clamp(readingTop,mastHeight+12,Math.max(mastHeight+12,height-Math.min(rect.height,height-mastHeight-24)-12)):readingTop;
      scrollTo({top:scrollY+rect.top-top,behavior:'instant'});
    }
  },140);},{passive:true});
  addEventListener('load',measure,{once:true});
  reduced.addEventListener('change',()=>configure());
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;metrics.idle=true;}else request();});
  mast?.addEventListener('focusin',()=>{root.dataset.mastHidden='false';});
  document.fonts?.ready.then(measure);
  document.addEventListener('sl:layout-change',()=>{clearTimeout(layoutTimer);layoutTimer=window.setTimeout(measure,90);});
  // Images/details may change reading flow; observe chapter dimensions, not transforms.
  const resizeObserver=new ResizeObserver(()=>{if(!paused&&!resizeTimer){clearTimeout(layoutTimer);layoutTimer=window.setTimeout(measure,80);}});
  all<HTMLElement>('main > .section').forEach(section=>resizeObserver.observe(section));
  configure(false);render();debug.ready=true;
  if(document.querySelector('dialog[open]'))window.SLMotion.pause();
  document.dispatchEvent(new CustomEvent('sl:ready'));
}

/** Keep the technology signature fixed and fade it when page content passes. */
function initBrandSignature(hero: HTMLElement | null) {
  const lab = hero?.querySelector<HTMLElement>('.eyebrow-lab');
  const tech = hero?.querySelector<HTMLElement>('.eyebrow-tech');
  const identity = lab?.parentElement;
  if (!hero || !lab || !tech || !identity) return null;

  const placeholder = tech.cloneNode(true) as HTMLElement;
  placeholder.classList.add('brand-signature-placeholder');
  placeholder.setAttribute('aria-hidden', 'true');
  placeholder.querySelectorAll<HTMLElement>('.eyebrow-tech-label').forEach(mark => mark.classList.add('brand-signature-placeholder-mark'));

  const host = document.createElement('div');
  host.className = 'brand-signature';
  host.setAttribute('role', 'group');
  host.setAttribute('aria-label', 'Sistemas brasileiros.');
  tech.replaceWith(placeholder);
  host.append(tech);
  document.body.append(host);
  host.dataset.ready = 'true';
  return host;
}

function renderBrandSignature(host: HTMLElement | null, mast: HTMLElement | null, _y: number, _height: number, _width: number) {
  if (!host) return;
  host.dataset.active = 'true';
  const mark = host.firstElementChild as HTMLElement | null;
  if (!mark) return;
  // CSS owns the anchor. Measure the rendered position, including mobile safe areas.
  const box = mark.getBoundingClientRect();
  const gap = 6;
  const overlaps = (rect: DOMRect) => rect.width > 0 && rect.height > 0 &&
    rect.left < box.right + gap && rect.right > box.left - gap &&
    rect.top < box.bottom + gap && rect.bottom > box.top - gap;
  const mastCollision = !!mast && overlaps(mast.getBoundingClientRect());
  const obstacles = document.querySelectorAll<HTMLElement>(
    'main h1,main h2,main h3,main p,main figcaption,main li,main .section-label,main .technology-note,main .knowledge-note,main .orbit-word,main a,main button,main input,main textarea,main summary,main img:not(.tree),main svg,main canvas,main video,main iframe'
  );
  const contentCollision = Array.from(obstacles).some(el => {
    if (!overlaps(el.getBoundingClientRect())) return false;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.opacity === '0') return false;
    if (el.matches('img,svg,canvas,video,iframe,button,input,textarea,summary')) return true;
    // Text occupies lines, not the full rectangular width of its paragraph/card.
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent?.trim()) continue;
      range.selectNodeContents(walker.currentNode);
      if (Array.from(range.getClientRects()).some(overlaps)) return true;
    }
    return false;
  });
  mark.dataset.obstructed = String(mastCollision || contentCollision);
}

