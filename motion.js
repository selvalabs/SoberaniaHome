/* Soberania Labs / motion engine
 * The document scroll is the only source of visual progress. Wheel input may be
 * rate-limited before it changes that document scroll; touch and keyboard stay native.
 * Geometry is measured on layout changes, never inside the animation renderers.
 * Discontinuous jumps resynchronise; they are not replayed as a high-speed sweep.
 */
(() => {
  'use strict';
  const root=document.documentElement;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
  const range=(a,b,t)=>smooth((t-a)/(b-a));
  const hold=t=>range(.18,.82,t);
  const lerpPhase=(points,v)=>{const i=Math.min(points.length-2,Math.max(0,Math.floor(v)));return points.length===1?points[0]:mix(points[i],points[i+1],hold(v-i));};
  const catmull=(p0,p1,p2,p3,t)=>{
    const t2=t*t,t3=t2*t;
    return .5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);
  };
  const smoother=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10);};
  // This is deliberately a document-scroll controller, not an animation
  // playhead. Once scrollY changes, every visual (including the leaf) renders
  // from that exact value in the same frame.
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=()=>innerWidth<760;
  let requestedReading=false, enabled=false, paused=false, raf=null,lastY=scrollY;
  let controlledScrollTarget=scrollY,controlledScrollVelocity=0,controlledScrollRaf=null,controlledScrollLastTime=null;
  let dirty=true,geometry=null,layoutPending=true,forceSync=true,ready=false,activeId='hero',resizeTimer;
  // Dragging is an intentional, temporary exception to the scroll route. The
  // base position always remains scroll-derived; on release this offset is
  // allowed to fall back through a short damped pendulum.
  const leafDrag={active:false,returning:false,pointerId:null,grabX:0,grabY:0,x:0,y:0,lastX:0,lastY:0,lastAt:0,vx:0,vy:0,baseX:0,baseY:0,releaseX:0,releaseY:0,releaseVX:0,releaseVY:0,releaseAt:0};
  const metrics={frames:0,measurements:0,resynchronisations:0,maxFrameMs:0,idle:true};
  const els={mast:document.getElementById('mast'),flight:document.getElementById('leaf-flight'),depth:document.getElementById('leaf-depth'),leaf:document.getElementById('wind-leaf'),glow:document.getElementById('leaf-glow'),fragA:document.getElementById('wind-fragment-a'),fragB:document.getElementById('wind-fragment-b'),global:document.getElementById('wind-global'),origin:document.getElementById('leaf-origin'),dock:document.getElementById('leaf-dock'),pile:document.getElementById('leaf-pile'),counter:document.getElementById('section-counter')};
  const allSections=[...document.querySelectorAll('main > .section')];
  const processSequence=document.querySelector('.process-sequence');
  if(processSequence&&!processSequence.dataset.puzzleMaster){
    processSequence.dataset.puzzleMaster='true';processSequence.dataset.states='6';
    processSequence.querySelector('.scene-count').textContent='01 / 06';processSequence.querySelector('.scene-hint').textContent='Seis peças, um processo';
    const nodes=[...processSequence.querySelectorAll('.process-node')],transfer=nodes[4];
    const testNode=document.createElement('button');
    testNode.type='button';testNode.className='process-node';testNode.dataset.processPiece='4';testNode.setAttribute('aria-label','Peça 5: Testar');testNode.innerHTML='<span>05</span><b>Testar</b>';
    transfer.before(testNode);transfer.dataset.processPiece='5';transfer.setAttribute('aria-label','Peça 6: Transferir capacidade');transfer.innerHTML='<span>06</span><b>Transferir</b>';
    const panels=[...processSequence.querySelectorAll('.process-panel')],transferPanel=panels[4];
    const testPanel=document.createElement('article');
    testPanel.className='process-panel';testPanel.innerHTML='<div class="process-count">05<span>/ 06</span></div><h3>TESTAR</h3><div class="process-body"><p>Verificar com quem vai usar, em condições reais, o que funciona e o que ainda precisa mudar.</p><p class="short-line">Aprender antes de escalar.</p><p class="short-line">Corrigir sem perder o contexto.</p></div>';
    transferPanel.before(testPanel);[...processSequence.querySelectorAll('.process-count span')].forEach(span=>span.textContent='/ 06');transferPanel.querySelector('.process-count').firstChild.textContent='06';
  }
  if(processSequence&&!processSequence.dataset.puzzleBoard){
    processSequence.dataset.puzzleBoard='true';
    const periphery=processSequence.querySelector('.process-periphery');
    const board=document.createElement('div');board.className='process-board';
    [...periphery.querySelectorAll('.process-node')].forEach(node=>board.append(node));periphery.append(board);
    // The process is never allowed to reveal a second, static board layer.
    processSequence.querySelector('.process-assembly')?.remove();
  }
  const sceneEls=[...document.querySelectorAll('.sequence')];
  const near=new Set();
  let observer=null,stableView=null;
  const scenes=sceneEls.map(el=>({
    el,id:el.closest('.section').id,kind:el.dataset.kind,count:+el.dataset.states,
    frame:el.querySelector('.scene-frame'),host:el.querySelector('.wind-host'),
    meter:el.querySelector('.scene-progress i'),counter:el.querySelector('.scene-count'),
    prev:el.querySelector('[data-prev]'),next:el.querySelector('[data-next]'),
    panels:[...el.querySelectorAll(el.dataset.kind==='process'?'.process-panel':el.dataset.kind==='words'?'.word-panel':el.dataset.kind==='spiral'?'.spiral-caption':'.portfolio-card')],
    nodes:[...el.querySelectorAll(el.dataset.kind==='process'?'.process-node':el.dataset.kind==='knowledge'?'.knowledge-terms span':'.orbit-word')],
    track:el.querySelector('.portfolio-track'),stage:el.querySelector('.word-stage,.knowledge-stage,.track-viewport,.process-stage,.editor-stage,.spiral-stage,.journal-stage'),board:el.querySelector('.process-board'),
    orbit:el.querySelector('.orbit-view'),strip:el.querySelector('.newspaper-strip'),paper:el.querySelector('.newspaper-window'),
    v:0,raw:0,lastV:NaN,lastIndex:-1,g:null,editorLive:false
  }));
  const processAssembly=new WeakMap();
  // Keep every fragment inside the first viewport. The board can be discovered
  // before it starts converging, instead of hiding half of its material below
  // the fold.
  const processScatter={desktop:[[13,16],[50,11],[79,16],[17,41],[50,48],[83,41]],mobile:[[14,13],[50,9],[86,13],[15,30],[50,36],[85,30]]};
  const processOrigins=[[20,88],[518,88],[1016,88],[20,507],[518,507],[1016,507]];
  const processCrop={width:662,height:568,left:82,top:72,sourceWidth:1536,sourceHeight:1024};
  const processBoard=(s)=>{
    const pieceWidth=s.nodes[0].offsetWidth||160;
    const scale=pieceWidth/processCrop.width;
    return {scale,centreX:(mobile()?s.g.stage.width*.5:s.g.stage.width*.42),centreY:(mobile()?s.g.stage.height*.45:s.g.stage.height*.5)};
  };
  const processTarget=(s,index,layout=processBoard(s))=>{
    const {scale,centreX,centreY}=layout,[originX,originY]=processOrigins[index];
    return {
      x:centreX-processCrop.sourceWidth*scale/2+(originX-processCrop.left+processCrop.width/2)*scale,
      y:centreY-processCrop.sourceHeight*scale/2+(originY-processCrop.top+processCrop.height/2)*scale
    };
  };
  function processState(s){
    let state=processAssembly.get(s);
    if(!state){state={dragging:-1,pointerId:null,movedAt:-Infinity,points:Array.from({length:s.nodes.length},()=>null),assembled:Array(s.nodes.length).fill(false)};processAssembly.set(s,state);}
    return state;
  }
  const leaf={x:0,y:0,scale:1,rx:0,ry:0,rz:128,opacity:1,initialised:false,mode:'branch',phase:'presa',parent:els.global,occlusionState:'visible',occlusionProgress:0};
  const docRect=el=>{const r=el.getBoundingClientRect();return {left:r.left,top:r.top+scrollY,width:r.width,height:r.height,right:r.right,bottom:r.bottom+scrollY};};
  const relRect=(el,frame)=>{if(!el)return null;const r=el.getBoundingClientRect(),f=frame.getBoundingClientRect();return {left:r.left,top:r.top-f.top,width:r.width,height:r.height};};
  function setPanelAccess(s,index){
    s.panels.forEach((p,i)=>{
      if(s.kind==='process'){p.inert=false;p.removeAttribute('aria-hidden');return;}
      p.inert=enabled&&i!==index;p.toggleAttribute('aria-hidden',enabled&&i!==index);if(p.hasAttribute('aria-hidden'))p.setAttribute('aria-hidden','true');
    });
  }
  function currentSection(y){
    let item=geometry.sections[0];
    for(const sec of geometry.sections){if(y+geometry.mast+45>=sec.top)item=sec;else break;}
    return item;
  }
  function darkSection(id){return geometry.sections.find(s=>s.id===id)||null;}
  function leafOcclusion(y){
    const h=geometry.height;
    const sections=[darkSection('processo'),darkSection('espiral')].filter(Boolean);
    for(const sec of sections){
      const entryStart=sec.top-h*.35;
      const entryEnd=sec.top+h*.15;
      const exitStart=sec.bottom-h*.20;
      const exitEnd=sec.bottom+h*.25;
      if(y<entryStart||y>exitEnd)continue;
      if(y<entryEnd)return {state:'entering',progress:smoother(range(entryStart,entryEnd,y))};
      if(y<=exitStart)return {state:'occluded',progress:1};
      return {state:'exiting',progress:smoother(range(exitStart,exitEnd,y))};
    }
    return {state:'visible',progress:0};
  }
  function scrollProgress(s,y){return clamp((y-s.g.start)/s.g.run);}
  function visibleProgress(s,y){
    const scrollPosition=scrollProgress(s,y);
    // Processo reserva um trecho de leitura depois que a última peça encaixa.
    // O estado visual alcança 100% antes do fim da seção e permanece ali até a
    // próxima dobra poder começar, sem uma transição apressada.
    return clamp(scrollPosition/(s.visualFraction||1));
  }
  function measure(preserve=false){
    const carried=preserve?stableView:null;
    const oldActive=carried?scenes.find(s=>s.id===carried.id):scenes.find(s=>s.g&&lastY>=s.g.start&&lastY<=s.g.end);
    const oldProgress=carried?carried.progress:oldActive?scrollProgress(oldActive,lastY):0;
    const mode=!requestedReading&&!reduced.matches&&innerHeight>=580;
    enabled=mode;root.classList.toggle('motion',enabled);root.dataset.reading=enabled?'false':'true';
    const vh=innerHeight,vw=document.documentElement.clientWidth,mast=els.mast.getBoundingClientRect().height;
    const isMobile=mobile();
    // Pass one writes scene lengths and track gutters only.
    scenes.forEach(s=>{
      const staticScene=!enabled||(isMobile&&s.kind==='journal');
      s.static=staticScene;
      const h=enabled?s.frame.offsetHeight:Math.max(vh-mast,1);
      let units=s.kind==='words'?.34:s.kind==='knowledge'?.66:s.kind==='horizontal'?.68:s.kind==='process'?.72:s.kind==='editor'?.66:.79;
      if(!isMobile)units=s.kind==='words'?.40:s.kind==='horizontal'?.8:.78;
      const holdSteps=s.kind==='process'?2:0;
      s.visualFraction=(s.count-1)/(s.count-1+holdSteps);
      let run=Math.round((s.count-1+holdSteps)*Math.max(500,h)*units);
      if(s.track&&enabled){
        const view=s.stage.clientWidth,card=s.panels[0].offsetWidth;
        const gutter=Math.max(16,(view-card)/2);
        s.track.style.paddingLeft=gutter+'px';s.track.style.paddingRight=gutter+'px';
      }
      if(s.kind==='journal'&&!staticScene){run=Math.max(h*2,(s.strip.scrollHeight-s.paper.clientHeight)*1.1);}
      s.el.style.setProperty('--run',staticScene?'0px':run+'px');
      if(staticScene){s.panels.forEach(p=>{p.inert=false;p.removeAttribute('aria-hidden');p.style.transform='';p.style.opacity='';p.style.clipPath='';p.classList.remove('is-current','is-past','is-future');});if(s.track)s.track.style.transform='';if(s.strip)s.strip.style.transform='';}
    });
    // Pass two reads geometry after all section heights have been written.
    geometry={width:vw,height:vh,mast,sections:allSections.map(el=>({el,id:el.id,number:+el.dataset.number,...docRect(el)})),maxScroll:Math.max(0,document.documentElement.scrollHeight-vh),origin:docRect(els.origin),dock:docRect(els.dock),pile:docRect(els.pile),zones:[...document.querySelectorAll('.prose-section h2,.hero-copy h1,.hero-copy p,.hero-bottom,.footer-content,.reference-groups,.manifesto-list,.sovereignty-list,.choice-rows,.about-copy,.newspaper-frame')].map(docRect)};
    scenes.forEach(s=>{
      const top=docRect(s.el).top,fh=s.frame.offsetHeight;
      const run=Math.max(1,s.el.offsetHeight-fh);
      s.g={top,start:top-mast,end:top-mast+run,run,bottom:top+s.el.offsetHeight,frameHeight:fh,stage:relRect(s.stage,s.frame),host:relRect(s.host,s.frame),orbit:relRect(s.orbit,s.frame)};
      if(s.track){s.g.offsets=s.panels.map(p=>p.offsetLeft+p.offsetWidth/2-s.stage.clientWidth/2);s.g.travel=Math.max(...s.g.offsets)-Math.min(...s.g.offsets);}
      if(s.strip)s.g.paperTravel=Math.max(0,s.strip.scrollHeight-s.paper.clientHeight);
      s.v=visibleProgress(s,scrollY)*(s.count-1);s.raw=s.v;s.lastV=NaN;s.lastIndex=-1;
      if(s.static){setPanelAccess(s,0);s.panels.forEach(p=>{p.inert=false;p.removeAttribute('aria-hidden');});}
      else renderScene(s,true);
    });
    if(preserve&&oldActive&&!oldActive.static){scrollTo({top:oldActive.g.start+oldProgress*oldActive.g.run,behavior:'instant'});}
    layoutPending=false;forceSync=true;metrics.measurements++;
    document.getElementById('reading-switch').checked=!enabled;document.getElementById('reading-switch').disabled=reduced.matches;
    document.getElementById('toggle-motion-footer').textContent=reduced.matches?'Movimento reduzido (sistema)':enabled?'Modo de leitura':'Ativar animação';document.getElementById('toggle-motion-footer').disabled=reduced.matches;
    ready=true;
  }
  function panelTween(s,i,v,distance=24,horizontal=false){
    const d=v-i;
    // Body copy never crossfades over another paragraph. Only the word machine slides.
    const alpha=s.kind==='words'?1-range(.78,1.05,Math.abs(d)):(Math.round(v)===i?1:0);
    if(s.kind!=='words')distance=8;
    const p=s.panels[i];p.style.opacity=alpha.toFixed(4);
    p.style.transform=horizontal?`translate3d(${-d*distance}px,0,0)`:`translate3d(0,${-d*distance}px,0)`;
  }
  function renderScene(s,initial=false){
    if(s.static||!enabled)return;
    const v=s.v,p=clamp(v/(s.count-1)),index=Math.max(0,Math.min(s.count-1,Math.round(v)));
    if(!initial&&Math.abs(v-s.lastV)<.00008)return;
    s.lastV=v;
    s.meter.style.transform=`scaleX(${p})`;
    if(index!==s.lastIndex){
      s.counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(s.count).padStart(2,'0')}`;
      if(s.prev)s.prev.disabled=index===0;if(s.next)s.next.disabled=index===s.count-1;
      setPanelAccess(s,index);s.lastIndex=index;
    }
    const w=s.g.stage.width,h=s.g.stage.height;
    if(s.kind==='horizontal'){
      s.track.style.transform=`translate3d(${-lerpPhase(s.g.offsets,v)}px,0,0)`;
      s.panels.forEach((card,i)=>{card.style.opacity=(.64+.36*(1-clamp(Math.abs(i-v)))).toFixed(3);});
    }else if(s.kind==='words'){
      s.panels.forEach((panel,i)=>{
        const reveal=i===0?1:range(i-.82,i-.12,v);
        const current=Math.round(v)===i;
        const past=v>i+.34;
        const future=v<i-.82;
        const focus=current?1:past?.72:.86;
        panel.style.opacity=(reveal*focus).toFixed(4);
        panel.style.transform=`translate3d(0,${mix(17,0,reveal)}px,0) scale(${mix(.985,1,reveal)})`;
        panel.style.clipPath=`inset(0 0 ${(1-reveal)*100}% 0)`;
        panel.classList.toggle('is-current',current);
        panel.classList.toggle('is-past',past);
        panel.classList.toggle('is-future',future);
      });
    }else if(s.kind==='knowledge'){
      const coords=mobile()?[[18,17],[69,14],[86,28],[17,76],[67,84],[39,27],[82,72],[38,88],[18,32],[65,72],[39,13]]:[[14,21],[46,14],[82,25],[15,75],[79,79],[31,30],[82,55],[49,86],[18,46],[67,68],[66,20]];
      s.nodes.forEach((n,i)=>{
        const group=Math.floor(i/3),phase=clamp(p*3.8-group*.28);
        const t=range(0,.7,phase),c=coords[i];
        n.style.left=mix(w*.5,w*c[0]/100,t)+'px';n.style.top=mix(h*.51,h*c[1]/100,t)+'px';
        n.style.opacity=(range(.1,.5,phase)*(1-range(.87,1,p)*.5)).toFixed(3);
        n.style.transform=`translate(-50%,-50%) rotate(${mix((i%2?1:-1)*8,0,t)}deg)`;
      });
    }else if(s.kind==='process'){
      const state=processState(s),scatter=mobile()?processScatter.mobile:processScatter.desktop;
      const board=processBoard(s),assembly=s.el.querySelector('.process-assembly');
      const builds=s.nodes.map((_,i)=>state.assembled[i]?1:range(.18+i*.1,.5+i*.1,p));
      // The field note is a consequence of an almost-complete fit, not a
      // competing element during the loose approach. Its entire reveal is
      // still derived directly from the document scroll position.
      const noteBuilds=s.nodes.map((_,i)=>state.assembled[i]?1:range(.38+i*.092,.54+i*.092,p));
      if(s.board){
        s.board.style.width=`${processCrop.sourceWidth*board.scale}px`;s.board.style.height=`${processCrop.sourceHeight*board.scale}px`;
        s.board.style.left=`${board.centreX}px`;s.board.style.top=`${board.centreY}px`;
      }
      if(assembly){
        assembly.style.display='none';
      }
      s.panels.forEach((panel,i)=>{
        const active=Math.round(v)===i;
        panel.style.opacity=(mobile()?(active?1:0):noteBuilds[i]).toFixed(3);
        panel.style.transform=mobile()?`translate(-50%,0)`:'translate3d(0,0,0)';
      });
      s.nodes.forEach((n,i)=>{
        // No early false assembly: pieces stay recognisably dispersed before
        // each one begins its final approach and the last arrives at p=1.
        const built=builds[i];
        const [originX,originY]=processOrigins[i],target=processTarget(s,i,board);
        let x=mix(w*scatter[i][0]/100,target.x,built),y=mix(h*scatter[i][1]/100,target.y,built);
        if(state.dragging===i&&state.points[i]){x=state.points[i].x;y=state.points[i].y;}
        const active=i===index,tilt=(i%2?1:-1)*mix(10,0,built);
        const scale=mix(active?1.04:.96,1,built);
        n.style.width=`${processCrop.width*board.scale}px`;n.style.height=`${processCrop.height*board.scale}px`;
        n.style.left=`${(originX-processCrop.left)*board.scale}px`;n.style.top=`${(originY-processCrop.top)*board.scale}px`;
        n.style.transform=`translate3d(${x-target.x}px,${y-target.y}px,0) rotate(${tilt}deg) scale(${scale})`;
        // The pieces are an object to be discovered, not a faded background.
        // Keep every fragment legible at rest; scroll changes its placement only.
        n.style.opacity=(.78+.22*mix(built,active?1:.84,.35)).toFixed(3);
        n.classList.toggle('is-active',active);
        n.classList.toggle('is-assembled',built>.96);
        n.classList.toggle('is-dragging',state.dragging===i);
      });
      s.panels.forEach(panel=>{panel.style.margin='0';panel.style.transformOrigin='center';});
    }else if(s.kind==='editor'){
      for(let i=0;i<4;i++)s.el.classList.toggle(`editor-phase-${i}`,i===index);
      if(!s.editorLive){
        const demo=s.el.querySelector('.editor-demo');
        demo.classList.toggle('demo-preview-bounds',p>.26&&p<.84);demo.classList.toggle('demo-preview-tools',p>.50&&p<.90);demo.querySelector('.demo-toolbar').inert=true;
        demo.style.transform=`translate3d(0,${Math.sin(p*Math.PI)*-5}px,0) scale(${mix(.965,1,range(0,.28,p))})`;
        const captions=[['01 / Ideia','Ferramentas que deixam você dentro da ferramenta.'],['02 / Estrutura','O documento revela suas partes.'],['03 / Edição','As ferramentas entram na página.'],['04 / Autonomia','O documento continua sendo seu.']];
        const [k,t]=captions[index];document.getElementById('editor-caption-kicker').textContent=k;document.getElementById('editor-caption-text').textContent=t;
      }
    }else if(s.kind==='spiral'){
      s.panels.forEach((_,i)=>panelTween(s,i,v,16));
      const g=s.g.orbit,ow=g.width,oh=g.height,base=Math.min(ow,oh);
      const twist=p*Math.PI*4.15;
      const compress=range(.22,.70,p)*(1-range(.76,1,p));
      const radii=[.43,.31,.48,.37,.44,.29,.47,.34,.40];
      s.nodes.forEach((n,i)=>{
        const a=i/s.nodes.length*Math.PI*2+twist-Math.PI/2+(i%2?-.10:.08);
        const r=base*radii[i%radii.length]*(1-compress*.46);
        const ellipseX=1+(i%3)*.07,ellipseY=.82+(i%2)*.11;
        const x=ow*.5+Math.cos(a)*r*ellipseX,y=oh*.50+Math.sin(a)*r*ellipseY;
        n.style.left=x+'px';n.style.top=y+'px';n.style.transform=`translate(-50%,-50%) rotate(${Math.sin(a)*5}deg)`;
        const windowStart=(index*2)%s.nodes.length;
        const rel=(i-windowStart+s.nodes.length)%s.nodes.length;
        const visible=!mobile()||rel<5;
        n.style.opacity=visible?(rel===0?'1':'.58'):'0';
      });
    }else if(s.kind==='journal'){
      s.strip.style.transform=`translate3d(0,${-s.g.paperTravel*p}px,0)`;
    }
  }
  /* V8.6 / LEAF MOTION 3.1
   Scroll defines every point of the route. The wind is intentionally broad:
   visual interest must never turn a short scroll interval into a launch. */
  const leafKeys=[
    {p:0.00,x:.58,y:.47,s:.82,rz:88, rx:22, ry: 34,phase:'queda'},
    {p:.09,x:.64,y:.50,s:.78,rz:60, rx:-8, ry: 42,phase:'deriva'},
    {p:.18,x:.47,y:.54,s:.88,rz:92, rx:18, ry:-32,phase:'queda'},
    {p:.29,x:.60,y:.57,s:1.00,rz:72, rx:-20,ry: 30,phase:'queda'},
    {p:.40,x:.43,y:.61,s:.82,rz:104,rx:14, ry:-38,phase:'queda'},
    {p:.51,x:.62,y:.64,s:1.04,rz:78, rx:-18,ry: 34,phase:'queda'},
    {p:.62,x:.40,y:.68,s:.80,rz:96, rx:20, ry:-38,phase:'queda'},
    {p:.71,x:.54,y:.71,s:.94,rz:76, rx:-12,ry: 28,phase:'queda'},
    {p:.82,x:.52,y:.74,s:1.07,rz:91, rx:18, ry:-40,phase:'espiral'},
    {p:.89,x:.62,y:.76,s:.82,rz:68, rx:-8, ry: 36,phase:'queda'},
    {p:.96,x:.59,y:.79,s:.86,rz:94, rx:12, ry:-22,phase:'queda-final'},
    {p:1.00,x:.54,y:.80,s:.72,rz:96, rx: 6, ry:  0,phase:'pouso'}
  ];
  const leafGusts=[
    {c:.12,w:.11,amp:.14,twist: 8},
    {c:.30,w:.13,amp:-.12,twist:-7},
    {c:.51,w:.14,amp:.16,twist: 9},
    {c:.73,w:.13,amp:-.11,twist:-7},
    {c:.91,w:.10,amp:.12,twist: 8}
  ];
  const tumbleSteps=[
    {a:.135,b:.185,axis:'ry',deg: 180},
    {a:.335,b:.390,axis:'rx',deg:-180},
    {a:.585,b:.640,axis:'ry',deg:-180},
    {a:.865,b:.905,axis:'rz',deg: 180}
  ];
  function sceneTop(s,y){return Math.min(Math.max(s.g.top-y,geometry.mast),s.g.bottom-y-s.g.frameHeight);}
  function bell(a,b,v){
    if(v<=a||v>=b)return 0;
    const q=(v-a)/(b-a);
    return Math.sin(q*Math.PI)**2;
  }
  function splineKeyTarget(p){
    let i=0;
    while(i<leafKeys.length-2&&p>leafKeys[i+1].p)i++;
    const p1=leafKeys[i],p2=leafKeys[Math.min(leafKeys.length-1,i+1)];
    const p0=leafKeys[Math.max(0,i-1)],p3=leafKeys[Math.min(leafKeys.length-1,i+2)];
    const u=clamp((p-p1.p)/Math.max(.0001,p2.p-p1.p));
    const val=prop=>catmull(p0[prop],p1[prop],p2[prop],p3[prop],u);
    return {x:val('x')*geometry.width,y:val('y')*geometry.height,scale:val('s'),rx:val('rx'),ry:val('ry'),rz:val('rz'),phase:u<.5?p1.phase:p2.phase};
  }
  function gustAt(p){
    let gx=0,twist=0,strength=0;
    for(const g of leafGusts){
      const env=bell(g.c-g.w,g.c+g.w,p);
      gx+=g.amp*env;twist+=g.twist*env;strength+=Math.abs(g.amp)*env;
    }
    return {gx,twist,strength};
  }
  function tumbleAt(p){
    const out={rx:0,ry:0,rz:0};
    for(const e of tumbleSteps){out[e.axis]+=e.deg*smoother(range(e.a,e.b,p));}
    return out;
  }
  function releaseTarget(y){
    const {width:w,height:h,origin,mast}=geometry;
    // The cover holds for a deliberately long first passage on desktop.
    // The leaf's release is still calculated directly from scrollY; the sticky
    // cover simply gives that first movement room before the document advances.
    const releasePx=mobile()?270:2550;
    const raw=clamp(y/releasePx);
    // A falling leaf does not leave a branch in a straight line. The first
    // portion lingers, then gains vertical distance while its horizontal route
    // makes two broad, scroll-indexed pendular passes. There is no time-based
    // animation here: a stopped scroll always freezes the exact same pose.
    const q=smoother(raw);
    const fall=Math.pow(raw,1.12);
    const initialScale=mobile()?.64:.72;
    // On desktop the release stays within the held cover all the way to the
    // lower edge. Only then does ordinary document movement reveal section 02.
    // Match the first coordinate of the long route (about 56.4% of viewport
    // width) so the leaf keeps gliding sideways instead of resolving into a
    // vertical drop at the moment the hero releases.
    const endX=w*(mobile()?.58:.564),endY=Math.max(origin.top+3,h*(mobile()?.45:.86));
    const broadSway=Math.sin(raw*Math.PI*3)*(mobile()?34:158)*(.72+raw*.28);
    const fineSway=Math.sin(raw*Math.PI*6)*(mobile()?9:22);
    const floatBob=Math.sin(raw*Math.PI*3)*(mobile()?7:24)*(1-raw*.28);
    return {
      x:mix(origin.left,endX,q)+broadSway+fineSway,
      y:Math.max(mast+22,mix(origin.top+3,endY,fall)+floatBob),
      scale:mix(initialScale,mobile()?.80:.84,q),
      rx:mix(0,24,q)+Math.sin(raw*Math.PI*2)*18,
      ry:mix(-5,38,q)+Math.sin(raw*Math.PI*2.3)*42,
      rz:mix(mobile()?128:142,88,q)+Math.sin(raw*Math.PI*2.15)*34,
      phase:y<=1?'presa':'desprendimento',mode:y<=1?'branch':'release',depth:'front',releasePx
    };
  }
  function targetAt(y,activeScene){
    const {width:w,height:h,dock,mast}=geometry;
    const maxScroll=Math.max(geometry.maxScroll,document.documentElement.scrollHeight-innerHeight);
    const release=releaseTarget(y);
    if(y<=release.releasePx){
      return {...release,parent:els.global,offsetX:0,offsetY:0,spiralBlend:0,gust:0};
    }

    const flightP=clamp((y-release.releasePx)/Math.max(1,maxScroll-release.releasePx));
    const releaseEnd=releaseTarget(release.releasePx);
    let t=splineKeyTarget(flightP);
    // The route crosses the page through broad, low-frequency sways. Keeping
    // x independent from the uneven spline keys prevents a small document
    // scroll from becoming a visible sideways lurch.
    const longSway=Math.sin(flightP*Math.PI*2.1+.55)*.075+Math.sin(flightP*Math.PI*4.4-.3)*.018;
    t.x=w*(.53+longSway);
    const g=gustAt(flightP),tb=tumbleAt(flightP);
    const fallStartY=releaseTarget(release.releasePx).y;
    const finalDockY=clamp(dock.top-maxScroll,mast+14,h-54);
    const fallEndY=Math.max(fallStartY,finalDockY);
    t.y=mix(fallStartY,fallEndY,smoother(flightP));

    // Long pendular sway: horizontal speed and attitude are phase related, not identical.
    const phase=flightP*Math.PI*5.5;
    const amp=(mobile()?15:25)*(0.88+.12*Math.sin(flightP*Math.PI*2.1+.6));
    t.x+=Math.sin(phase)*amp;
    t.rz+=Math.sin(phase+.25)*14+g.twist+tb.rz;
    t.ry+=Math.sin(phase*.78+1.15)*20+tb.ry;
    t.rx+=Math.cos(phase*.61+.4)*10+tb.rx;
    t.scale*=1+Math.sin(flightP*Math.PI*2.4+.75)*(mobile()?.018:.028);

    const gustPx=mobile()?28:42;
    t.x+=g.gx*gustPx;

    let mode='wind',depth='mid',spiralBlend=0,parent=els.global,offsetX=0,offsetY=0;

    if(activeScene&&!activeScene.static){
      const s=activeScene;

      if(s.kind==='horizontal'){
        const sp=clamp(s.v/(s.count-1));
        const dir=s.el.dataset.direction==='reverse'?-1:1;
        // Scene motion changes the leaf's attitude, never its global route.
        // Position remains a direct continuous function of document scroll.
        const kick=bell(.055,.39,sp);
        const tumble=smoother(range(.07,.31,sp));
        t.rz+=dir*(205*tumble+42*kick);
        t.ry+=dir*180*tumble;
        t.rx-=dir*58*Math.sin(tumble*Math.PI);
        t.scale*=mix(1,mobile()?1.05:1.10,kick);
        mode='horizontal-gust';depth='front';
      }else if(s.kind==='spiral'){
        const sp=clamp(s.v/(s.count-1));
        const theta=sp*Math.PI*2.35-.72;
        const capture=smooth(range(.03,.18,sp))*(1-smooth(range(.80,.96,sp)));
        // The spiral is expressed by attitude and depth only. Pulling the
        // leaf into a section-local orbit changed its x target too abruptly.
        t.rz=mix(t.rz,360+sp*760,capture);
        t.ry=mix(t.ry,Math.sin(theta)*72+180*smoother(range(.30,.58,sp)),capture);
        t.rx=mix(t.rx,Math.cos(theta*.78)*38,capture);
        t.scale=mix(t.scale,mobile()?1.00:1.14,capture);

        /* Pull tightly into the core and hold there before launching. */
        const core=bell(.60,.91,sp);
        t.rz=mix(t.rz,540+sp*920,core);
        t.ry=mix(t.ry,0,core*.75);
        t.rx=mix(t.rx,-8,core*.45);

        const hold=bell(.70,.86,sp);
        t.scale=mix(t.scale,mobile()?1.01:1.07,hold*.7);

        mode='spiral';depth='front';spiralBlend=Math.max(capture,core,hold);
      }else if(s.kind==='words'||s.kind==='process'||s.kind==='editor'||s.kind==='journal'){
        // Reading scenes keep the same global route; they only alter depth.
        mode='corridor';depth='mid';
      }
    }

    // The long flight formerly started from its first spline key, which was
    // hundreds of pixels away from the release endpoint. Blend every visual
    // dimension through a scroll interval so position and attitude are C0
    // continuous at the hand-off; this is scroll-driven, not time smoothing.
    const takeoffBlend=smoother(range(0,.045,flightP));
    if(takeoffBlend<1){
      t.x=mix(releaseEnd.x,t.x,takeoffBlend);
      t.y=mix(releaseEnd.y,t.y,takeoffBlend);
      t.scale=mix(releaseEnd.scale,t.scale,takeoffBlend);
      t.rx=mix(releaseEnd.rx,t.rx,takeoffBlend);
      t.ry=mix(releaseEnd.ry,t.ry,takeoffBlend);
      t.rz=mix(releaseEnd.rz,t.rz,takeoffBlend);
      t.phase=takeoffBlend<.5?releaseEnd.phase:t.phase;
    }

    // Keep the protagonist recoverable in the viewport. The first third is stricter.
    const edge=mobile()?17:24;
    t.x=clamp(t.x,-edge,w+edge);
    t.y=clamp(t.y,mast+14,h-54);

    // Final approach is driven by the real footer geometry. We split the ending
    // into approach -> contact -> settle -> rest, so the leaf does not "hook"
    // into the pile too early or snap when reparented.
    const dockViewportY=dock.top-y;
    const startBand=mobile()?230:320;
    const startLanding=dockViewportY < h + startBand;
    let landPhase='none',contactAmt=0,settleAmt=0;
    if(startLanding){
      const near=clamp((h + startBand - dockViewportY)/(startBand + h*.55));
      const approach=smoother(near);
      contactAmt=smoother(range(.56,.84,near));
      settleAmt=smoother(range(.82,1,near));
      t.x=mix(t.x,dock.left,approach);
      t.scale=mix(t.scale,mobile()?.76:.74,approach);
      t.rx=mix(t.rx,mix(16,7,contactAmt),approach);
      t.ry=mix(t.ry,0,approach);
      t.rz=mix(t.rz,mix(110,96,contactAmt),approach);
      depth='front';
      if(settleAmt>.985){mode='rest';landPhase='rest';}
      else if(contactAmt>.02){mode='landing';landPhase=settleAmt>.1?'settle':'contact';}
      else {mode='landing';landPhase='approach';}

      // Reparent only very late, once the pile is actually visible and the leaf is
      // already making contact. This avoids disappearing during the journal / contact area.
      const pileVisible=dockViewportY<h*.84 && dockViewportY>mast-18;
      if(pileVisible && settleAmt>.68){
        parent=els.pile;
        offsetX=geometry.pile.left;
        offsetY=geometry.pile.top-y;
      }
    }

    // At the document end the physical anchor is authoritative. This is a
    // terminal state, not a shortcut during ordinary scrolling: it guarantees
    // that End/keyboard navigation and a fast final swipe cannot leave the
    // leaf hovering above the pile.
    if(y>=maxScroll-1){
      t.x=dock.left;
      t.y=dockViewportY;
      t.scale=mobile()?.76:.74;
      t.rx=7;t.ry=0;t.rz=96;
      mode='rest';depth='front';parent=els.pile;
      offsetX=geometry.pile.left;
      offsetY=geometry.pile.top-y;
      landPhase='rest';contactAmt=1;settleAmt=1;
    }

    return {x:t.x,y:t.y,scale:t.scale,rx:t.rx,ry:t.ry,rz:t.rz,phase:t.phase||'queda',mode,depth,parent,offsetX,offsetY,spiralBlend,gust:g.strength,flightP,landPhase,contactAmt,settleAmt};
  }

  function renderLeaf(y,activeScene,ts){
    if(!enabled){
      els.flight.style.opacity='0';
      if(els.fragA)els.fragA.style.opacity='0';
      if(els.fragB)els.fragB.style.opacity='0';
      return false;
    }
    const t=targetAt(y,activeScene);
    leafDrag.baseX=t.x;leafDrag.baseY=t.y;
    let dragMoving=false;
    if(leafDrag.active){
      t.x=leafDrag.x;t.y=leafDrag.y;
      t.rz+=clamp((leafDrag.x-leafDrag.baseX)*.055,-28,28);
      t.rx+=clamp((leafDrag.y-leafDrag.baseY)*.025,-16,16);
      dragMoving=true;
    }else if(leafDrag.returning){
      const elapsed=Math.max(0,(ts-leafDrag.releaseAt)/1000);
      // A deliberately unhurried, low-frequency recovery. The small downward
      // arc makes release read as a leaf settling through air, rather than an
      // elastic UI element snapping back to a coordinate.
      const damping=1.8,frequency=4.8,settleDuration=2.8,decay=Math.exp(-damping*elapsed);
      const rebound=(offset,velocity)=>decay*(offset*Math.cos(frequency*elapsed)+((velocity+damping*offset)/frequency)*Math.sin(frequency*elapsed));
      const dx=rebound(leafDrag.releaseX,leafDrag.releaseVX);
      const dy=rebound(leafDrag.releaseY,leafDrag.releaseVY);
      const fallArc=22*Math.sin(Math.PI*clamp(elapsed/settleDuration));
      const sway=Math.sin(frequency*elapsed)*15*decay;
      t.x+=dx;t.y+=dy+fallArc;
      t.rz+=clamp(dx*.075+dy*.03+sway,-38,38);
      t.rx+=clamp(dy*.055+fallArc*.16,-24,24);
      if(Math.hypot(dx,dy)<.5&&elapsed>settleDuration){leafDrag.returning=false;root.dataset.leafDragging='0';}
      else dragMoving=true;
    }
    const occlusion=leafOcclusion(y);
    leaf.occlusionState=occlusion.state;leaf.occlusionProgress=occlusion.progress;
    root.dataset.leafOccluded=occlusion.state==='occluded'?'1':'0';
    // The leaf is a direct visualisation of scroll progress. No spring,
    // momentum or autonomous recovery is allowed between scroll positions.
    leaf.x=t.x;leaf.y=t.y;leaf.scale=t.scale;leaf.rx=t.rx;leaf.ry=t.ry;leaf.rz=t.rz;leaf.phase=t.phase;leaf.initialised=true;

    if(leaf.parent!==t.parent){t.parent.appendChild(els.flight);leaf.parent=t.parent;}
    root.dataset.leafDepth=t.depth||'mid';
    els.flight.style.zIndex=t.parent===els.pile?'3':'';
    const leafOpacity=occlusion.state==='entering'?1-occlusion.progress:occlusion.state==='exiting'?occlusion.progress:occlusion.state==='occluded'?0:1;
    const leafVisibility=occlusion.state==='occluded'?'hidden':'visible';
    leaf.opacity=leafOpacity;
    els.flight.style.opacity=leafOpacity.toFixed(3);
    els.flight.style.visibility=leafVisibility;

    // Scroll is the sole driver. Springs may settle briefly after a gesture,
    // but there is no time-based drift, flotation, bounce or autonomous spin.
    const x=leaf.x;
    const yPos=leaf.y;
    els.flight.style.transform=`translate3d(${x-t.offsetX}px,${yPos-t.offsetY}px,0)`;
    els.depth.style.transform=`translate(-50%,-91%) scale(${leaf.scale})`;
    els.leaf.style.transform=`perspective(${mobile()?610:860}px) rotateX(${leaf.rx}deg) rotateY(${leaf.ry}deg) rotateZ(${leaf.rz}deg)`;

    const close=clamp((leaf.scale-.62)/.56);
    els.glow.style.opacity=mix(.04,.18,close).toFixed(3);
    els.glow.style.filter=`blur(${mix(14,5,close)}px)`;
    els.glow.style.transform=`translate(-50%,-50%) scale(${mix(.68,1.05,close)})`;
    els.leaf.style.filter=`saturate(${mix(.87,1.08,close)}) contrast(${mix(.97,1.07,close)}) drop-shadow(0 ${mix(1,4,close)}px ${mix(1,4,close)}px rgba(28,33,26,${mix(.04,.14,close)}))`;

    const fragments=[els.fragA,els.fragB];
    fragments.forEach((f,i)=>{
      if(!f)return;
      const show=!mobile()&&t.mode==='spiral'?t.spiralBlend||0:0;
      const side=i?1:-1,dx=side*(38+i*12),dy=(i?26:-34)+Math.sin(y*.004+i)*12;
      f.style.opacity=(show*(i?.28:.42)*(leafOpacity)).toFixed(3);
      f.style.visibility=leafVisibility;
      f.style.transform=`translate3d(${x+dx}px,${yPos+dy}px,0) rotate(${leaf.rz*side+i*95}deg) translate(-50%,-50%) scale(${.68-i*.08})`;
    });

    leaf.mode=t.mode;
    return dragMoving;
  }

  function updateNav(y){
    const sec=currentSection(y);
    if(sec.id===activeId&&ready)return;
    activeId=sec.id;els.counter.textContent=String(sec.number).padStart(2,'0')+' / 15';
    document.querySelectorAll('.main-nav a,.index-links a').forEach(a=>{a.toggleAttribute('aria-current',a.hash==='#'+activeId);if(a.hasAttribute('aria-current'))a.setAttribute('aria-current','location');});
  }
  function request(sync=false){
    if(reduced.matches){metrics.idle=true;return;}
    if(sync)forceSync=true;dirty=true;
    if(raf===null&&!paused){metrics.idle=false;raf=requestAnimationFrame(frame);}
  }
  function frame(ts){
    raf=null;
    if(paused||document.hidden){metrics.idle=true;return;}
    const started=performance.now();
    if(layoutPending)measure(false);
    const y=scrollY;
    // No visual playhead: scenes and leaf are a direct projection of scrollY.
    const visualY=clamp(y,0,geometry.maxScroll);
    dirty=false;forceSync=false;let moving=false,activeScene=null;
    updateNav(y);
    if(enabled){
      for(const s of scenes){
        if(s.static)continue;
        const raw=visibleProgress(s,visualY)*(s.count-1);s.raw=raw;
        const inView=s.g.bottom>visualY+geometry.mast&&s.g.top<visualY+geometry.height;
        if(!inView){const end=visualY>s.g.end?s.count-1:0;if(s.v!==end||Number.isNaN(s.lastV)){s.v=end;renderScene(s);}continue;}
        if(visualY>=s.g.start-80&&visualY<=s.g.end+80)activeScene=s;
        if(s.editorLive)continue;
        if(Math.abs(raw-s.v)>.2)metrics.resynchronisations++;
        s.v=raw;
        renderScene(s);
      }
      moving=renderLeaf(visualY,activeScene,ts)||moving;
    }
    if(enabled&&activeScene&&innerWidth===geometry.width&&Math.abs(innerHeight-geometry.height)<2)stableView={id:activeScene.id,progress:scrollProgress(activeScene,visualY)};
    lastY=y;metrics.frames++;metrics.maxFrameMs=Math.max(metrics.maxFrameMs,performance.now()-started);
    if(moving||dirty){raf=requestAnimationFrame(frame);metrics.idle=false;}else metrics.idle=true;
  }
  function setReading(value){requestedReading=value;layoutPending=true;request(true);}
  function remeasure(preserve=false){if(paused){layoutPending=true;return;}measure(preserve);request(true);}
  function jumpSection(id){const el=document.getElementById(id);if(!el)return;stopControlledScroll();if(layoutPending)measure();const top=docRect(el).top-geometry.mast;scrollTo({top:Math.max(0,top),behavior:'instant'});request(true);}
  function jumpScene(s,phase){if(typeof s==='string')s=scenes.find(x=>x.id===s);if(!s)return;stopControlledScroll();const p=clamp(phase/(s.count-1));if(s.static){jumpSection(s.id);return;}s.v=p*(s.count-1);scrollTo({top:s.g.start+p*s.g.run,behavior:'instant'});request(true);}
  scenes.forEach(s=>{
    s.prev?.addEventListener('click',()=>jumpScene(s,Math.round(s.v)-1));s.next?.addEventListener('click',()=>jumpScene(s,Math.round(s.v)+1));
  });
  scenes.filter(s=>s.kind==='process').forEach(s=>{
    const state=processState(s);
    const point=e=>{const r=s.stage.getBoundingClientRect();return {x:clamp(e.clientX-r.left,0,r.width),y:clamp(e.clientY-r.top,0,r.height)};};
    const redraw=()=>{s.lastV=NaN;request(true);};
    s.nodes.forEach((node,i)=>{
      node.addEventListener('pointerdown',e=>{
        if(e.pointerType!=='mouse'||innerWidth<760||s.static||!enabled)return;
        e.preventDefault();e.stopPropagation();stopControlledScroll();
        state.dragging=i;state.pointerId=e.pointerId;state.points[i]=point(e);node.setPointerCapture?.(e.pointerId);redraw();
      });
      node.addEventListener('pointermove',e=>{
        if(state.dragging!==i||state.pointerId!==e.pointerId)return;
        e.preventDefault();state.points[i]=point(e);redraw();
      });
      const release=e=>{
        if(state.dragging!==i||state.pointerId!==e.pointerId)return;
        const dropped=point(e),target=processTarget(s,i);
        state.assembled[i]=Math.hypot(dropped.x-target.x,dropped.y-target.y)<Math.min(s.g.stage.width,s.g.stage.height)*.17;
        state.points[i]=null;state.dragging=-1;state.pointerId=null;state.movedAt=performance.now();
        if(node.hasPointerCapture?.(e.pointerId))node.releasePointerCapture(e.pointerId);redraw();
      };
      node.addEventListener('pointerup',release);node.addEventListener('pointercancel',release);
      node.addEventListener('click',()=>{
        if(innerWidth<760||s.static||!enabled)return;
        if(performance.now()-state.movedAt<280)return;
        state.assembled[i]=true;redraw();
      });
    });
  });
  const maxDocumentScroll=()=>Math.max(0,document.documentElement.scrollHeight-innerHeight);
  const isEditableTarget=target=>target instanceof Element&&Boolean(target.closest('input,textarea,select,[contenteditable="true"]'));
  function stopControlledScroll(){
    if(controlledScrollRaf!==null)cancelAnimationFrame(controlledScrollRaf);
    controlledScrollRaf=null;controlledScrollLastTime=null;controlledScrollVelocity=0;controlledScrollTarget=scrollY;
  }
  function beginLeafDrag(e){
    if(e.pointerType!=='mouse'||e.button!==0||!enabled||reduced.matches||leaf.occlusionState==='occluded')return;
    e.preventDefault();e.stopPropagation();stopControlledScroll();
    leafDrag.active=true;leafDrag.returning=false;leafDrag.pointerId=e.pointerId;
    leafDrag.grabX=e.clientX-leaf.x;leafDrag.grabY=e.clientY-leaf.y;
    leafDrag.x=leaf.x;leafDrag.y=leaf.y;leafDrag.lastX=e.clientX;leafDrag.lastY=e.clientY;leafDrag.lastAt=performance.now();leafDrag.vx=0;leafDrag.vy=0;
    root.dataset.leafDragging='1';els.flight.setPointerCapture?.(e.pointerId);request(true);
  }
  function moveLeafDrag(e){
    if(!leafDrag.active||e.pointerId!==leafDrag.pointerId)return;
    e.preventDefault();
    const now=performance.now(),dt=Math.max(.008,(now-leafDrag.lastAt)/1000);
    leafDrag.vx=clamp((e.clientX-leafDrag.lastX)/dt,-1100,1100);
    leafDrag.vy=clamp((e.clientY-leafDrag.lastY)/dt,-1100,1100);
    leafDrag.x=clamp(e.clientX-leafDrag.grabX,-70,innerWidth+70);
    leafDrag.y=clamp(e.clientY-leafDrag.grabY,geometry.mast-50,innerHeight+70);
    leafDrag.lastX=e.clientX;leafDrag.lastY=e.clientY;leafDrag.lastAt=now;request(true);
  }
  function endLeafDrag(e){
    if(!leafDrag.active||e.pointerId!==leafDrag.pointerId)return;
    leafDrag.active=false;leafDrag.pointerId=null;
    leafDrag.releaseX=leafDrag.x-leafDrag.baseX;leafDrag.releaseY=leafDrag.y-leafDrag.baseY;
    leafDrag.releaseVX=leafDrag.vx;leafDrag.releaseVY=leafDrag.vy;leafDrag.releaseAt=performance.now();
    leafDrag.returning=Math.hypot(leafDrag.releaseX,leafDrag.releaseY)>.5;
    if(!leafDrag.returning)root.dataset.leafDragging='0';
    if(els.flight.hasPointerCapture?.(e.pointerId))els.flight.releasePointerCapture(e.pointerId);
    request(true);
  }
  // Scrolling belongs to the browser. The old wheel interceptor accumulated a
  // target and kept issuing scrollTo calls after input stopped, which felt like
  // dragging a heavy page. Scenes only observe the native scroll position.
  addEventListener('wheel',stopControlledScroll,{passive:true});
  // Bind to the flight wrapper so the generous invisible hit-area and the
  // visible sprite both start the same gesture.
  els.flight.addEventListener('pointerdown',beginLeafDrag);
  els.flight.addEventListener('pointermove',moveLeafDrag);
  els.flight.addEventListener('pointerup',endLeafDrag);
  els.flight.addEventListener('pointercancel',endLeafDrag);
  addEventListener('scroll',()=>{if(controlledScrollRaf===null)controlledScrollTarget=scrollY;request();},{passive:true});
  addEventListener('pointerdown',stopControlledScroll,{passive:true});
  addEventListener('touchstart',stopControlledScroll,{passive:true});
  addEventListener('keydown',stopControlledScroll,{passive:true});
  let prevWidth=innerWidth,prevHeight=innerHeight;
  addEventListener('resize',()=>{
    if(document.activeElement?.isContentEditable)return;
    clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{
      const preserve=Math.abs(innerWidth-prevWidth)>20;
      if(preserve||Math.abs(innerHeight-prevHeight)>100){prevWidth=innerWidth;prevHeight=innerHeight;remeasure(preserve);}
      else request();
    },140);
  },{passive:true});
  addEventListener('orientationchange',()=>setTimeout(()=>remeasure(true),220));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf!==null)cancelAnimationFrame(raf);raf=null;stopControlledScroll();metrics.idle=true;}else request(true);});
  reduced.addEventListener('change',()=>{
    layoutPending=true;
    if(reduced.matches){
      if(raf!==null)cancelAnimationFrame(raf);
      raf=null;stopControlledScroll();dirty=false;metrics.idle=true;
      measure(false);
    }else request(true);
  });
  observer=new IntersectionObserver(entries=>{for(const entry of entries){entry.isIntersecting?near.add(entry.target):near.delete(entry.target);}request();},{rootMargin:'100px'});
  scenes.forEach(s=>observer.observe(s.el));
  // Frame size changes matter; scene scroll distances themselves do not trigger measurement.
  const observedSizes=new WeakMap();
  const resizeObserver=new ResizeObserver(entries=>{
    let changed=false;
    for(const entry of entries){const r=entry.contentRect,old=observedSizes.get(entry.target);observedSizes.set(entry.target,[r.width,r.height]);if(old&&(Math.abs(old[0]-r.width)>2||Math.abs(old[1]-r.height)>100))changed=true;}
    if(changed&&ready&&!document.activeElement?.isContentEditable){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>remeasure(Math.abs(innerWidth-(geometry?.width||innerWidth))>20),160);}
  });
  resizeObserver.observe(els.mast);scenes.forEach(s=>resizeObserver.observe(s.frame));
  function initialise(){measure();request(true);document.dispatchEvent(new Event('sl:ready'));}
  window.SLMotion={jumpSection,jumpScene,setReading,refresh:()=>remeasure(false),pause:()=>{paused=true;if(raf!==null)cancelAnimationFrame(raf);raf=null;stopControlledScroll();metrics.idle=true;},resume:()=>{paused=false;request(true);},editorLive:value=>{const s=scenes.find(x=>x.kind==='editor');s.editorLive=value;s.el.classList.toggle('editor-live',value);request(true);},request};
    Object.defineProperty(window,'__SL_DEBUG',{get:()=>({enabled,ready,paused,activeId,metrics:{...metrics},maxScroll:geometry?.maxScroll,scroll:{actual:scrollY,target:controlledScrollTarget,velocity:controlledScrollVelocity,controllerActive:controlledScrollRaf!==null},leaf:{x:leaf.x,y:leaf.y,rotation:leaf.rz,rotateX:leaf.rx,rotateY:leaf.ry,scale:leaf.scale,phase:leaf.phase,mode:leaf.mode,depth:root.dataset.leafDepth||'mid',opacity:leaf.opacity,occlusionState:leaf.occlusionState,occlusionProgress:leaf.occlusionProgress,drag:{active:leafDrag.active,returning:leafDrag.returning,baseX:leafDrag.baseX,baseY:leafDrag.baseY}},scenes:scenes.map(s=>({id:s.id,kind:s.kind,static:s.static,raw:s.raw,visual:s.v,start:s.g?.start,end:s.g?.end,run:s.g?.run,travel:s.g?.travel,lastIndex:s.lastIndex,frameHeight:s.g?.frameHeight}))})});
  Promise.all([...document.images].map(i=>i.decode?.().catch(()=>{})||Promise.resolve())).then(initialise);
})();
