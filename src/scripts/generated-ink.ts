import { generatedActs, generatedPlaybackSeconds, sampleGeneratedInk, scheduleGeneratedGuides } from './generated-ink-model';

/** Cache the display mask once, rather than filtering 1.5 million source pixels
 * on every SVG repaint. This never changes the source PNG or writes an asset. */
async function cacheInkMask(svg: SVGSVGElement) {
  let url: string | undefined;
  try {
    const mask=svg.querySelector<SVGMaskElement>('#workbench-ink')!;
    const target=mask.querySelector<SVGImageElement>('image')!;
    const image=new Image();image.src=target.getAttribute('href')!;await image.decode();
    const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const context=canvas.getContext('2d',{willReadFrequently:true});if(!context)return false;
    context.drawImage(image,0,0);
    const pixels=context.getImageData(0,0,canvas.width,canvas.height);
    for(let i=0;i<pixels.data.length;i+=4) {
      const luminance=.2126*pixels.data[i]+.7152*pixels.data[i+1]+.0722*pixels.data[i+2];
      pixels.data[i+3]=Math.max(0,1.07*(255-luminance)-17.85)*pixels.data[i+3]/255;
      pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=255;
    }
    context.putImageData(pixels,0,0);
    const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/png'));
    if(!blob)return false;
    url=URL.createObjectURL(blob);
    const cached=new Image();cached.src=url;await cached.decode();
    target.setAttribute('href',url);target.removeAttribute('filter');
    mask.style.maskType='alpha';
    addEventListener('pagehide',event=>{if(!event.persisted)URL.revokeObjectURL(url!);});
    return true;
  } catch {
    if(url)URL.revokeObjectURL(url);
    return false; // The source SVG luminance mask remains a functional fallback.
  }
}

/** A raster is the artwork. Extracted paths only open its luminance mask.
 * No wheel interception, accumulated simulation, or redraw while at rest. */
export function initGeneratedInk() {
  const host=document.querySelector<HTMLElement>('[data-generated-scene]');
  if (!host) return;
  const mast=document.querySelector<HTMLElement>('.generated-mast')!;
  const stage=host.querySelector<HTMLElement>('.generated-stage')!;
  const svg=host.querySelector<SVGSVGElement>('[data-generated-art]')!;
  const paths=Array.from(svg.querySelectorAll<SVGPathElement>('[data-generated-guide]'));
  const schedule=scheduleGeneratedGuides(paths.map(path=>({length:Number(path.dataset.length),phase:Number(path.dataset.phase),gap:Number(path.dataset.gap)})));
  const full=svg.querySelector<SVGRectElement>('[data-generated-complete]')!;
  const lightGuides=Array.from(svg.querySelectorAll<SVGPathElement>('[data-generated-light-guide]'));
  const highlights=Array.from(svg.querySelectorAll<SVGEllipseElement>('[data-generated-highlight]'));
  const pencil=svg.querySelector<SVGGElement>('[data-generated-pencil]')!;
  const pencilBody=pencil.querySelector<SVGGElement>('[data-pencil-body]')!;
  const pencilShadow=pencil.querySelector<SVGGElement>('[data-pencil-shadow]')!;
  const dust=svg.querySelector<SVGGElement>('[data-generated-dust]')!;
  const slider=host.querySelector<HTMLInputElement>('input[type=range]')!;
  const percent=host.querySelector<HTMLOutputElement>('[data-generated-percent]')!;
  const play=host.querySelector<HTMLButtonElement>('[data-generated-play]')!;
  const restart=host.querySelector<HTMLButtonElement>('[data-generated-restart]')!;
  const readingButton=document.querySelector<HTMLButtonElement>('[data-generated-reading]')!;
  const copies=Array.from(host.querySelectorAll<HTMLElement>('[data-generated-copy]'));
  const steps=Array.from(host.querySelectorAll<HTMLButtonElement>('[data-generated-step]'));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let reading=false, enabled=false, raf=0, layoutPending=true;
  let start=0, run=1, progress=0, oldIndex=-1, oldProgress=-1;
  let playing=false, playTime=0, playProgress=0, ownScroll=-1;
  let width=innerWidth, height=innerHeight;
  const debug={ready:false,enabled:false,start,run,progress,frames:0,playing:false,index:0,maskCached:false,tip:null as null|{x:number;y:number;index:number;draw:number}};
  (window as unknown as {__GENERATED_INK:typeof debug}).__GENERATED_INK=debug;
  document.documentElement.dataset.generatedReady='true';

  function stop() {
    playing=false; debug.playing=false;
    play.textContent='Reproduzir'; play.setAttribute('aria-pressed','false');
  }
  function measure() {
    const active=enabled && scrollY>=start && scrollY<=start+run;
    const was=enabled;
    enabled=!reading && !reduced.matches && innerHeight>=580;
    const probe=document.createElement('div');
    probe.style.cssText='position:fixed;visibility:hidden;pointer-events:none;height:100svh';
    document.body.append(probe);
    const available=(probe.offsetHeight||innerHeight)-mast.offsetHeight;
    probe.remove();
    host!.dataset.animated=String(enabled);
    host!.style.setProperty('--generated-height',`${available}px`);
    host!.style.setProperty('--generated-run',`${available*5.8}px`);
    host!.style.setProperty('--generated-top',`${mast.offsetHeight}px`);
    start=host!.getBoundingClientRect().top+scrollY-mast.offsetHeight;
    run=Math.max(1,host!.offsetHeight-stage.offsetHeight);
    if(active && enabled && was) scrollTo({top:start+run*progress,behavior:'instant'});
    else if(active && !enabled) scrollTo({top:Math.max(0,start),behavior:'instant'});
    if(!enabled)stop();
    readingButton.textContent=reading?'Voltar ao desenho':'Ver arte completa';
    readingButton.setAttribute('aria-pressed',String(reading));
    width=innerWidth;height=innerHeight;layoutPending=false;oldProgress=-1;
    debug.enabled=enabled;debug.start=start;debug.run=run;
  }
  function paint(value:number) {
    const state=sampleGeneratedInk(schedule,value);
    if(oldProgress===state.progress) return;
    oldProgress=state.progress;
    // Only changed mask paths are touched; the other hundreds stay cached.
    if(oldIndex<0) paths.forEach((path,i)=>path.setAttribute('stroke-dashoffset',i<state.index?'0':'1'));
    else if(state.index>=oldIndex) {
      for(let i=oldIndex;i<Math.min(state.index,paths.length);i++) paths[i].setAttribute('stroke-dashoffset','0');
    } else {
      for(let i=state.index+1;i<=Math.min(oldIndex,paths.length-1);i++) paths[i].setAttribute('stroke-dashoffset','1');
    }
    if(paths[state.index]) paths[state.index].setAttribute('stroke-dashoffset',String(1-state.draw));
    oldIndex=state.index;
    full.setAttribute('opacity',String(state.complete));
    lightGuides.forEach((path,i)=>{
      const light=enabled?state.lights[i]:undefined;
      if(!light){path.setAttribute('opacity','0');return;}
      if(path.dataset.source!==String(light.index)){
        path.setAttribute('d',paths[light.index].getAttribute('d')!);
        path.dataset.source=String(light.index);
      }
      path.setAttribute('stroke-dasharray',`${light.to-light.from} 2`);
      path.setAttribute('stroke-dashoffset',String(-light.from));
      path.setAttribute('opacity',String(light.strength));
    });
    highlights.forEach((point,i)=>point.setAttribute('opacity',String(enabled?state.keyLights[i]:0)));
    pencil.toggleAttribute('hidden',!enabled || !state.pencil);
    dust.toggleAttribute('hidden',!enabled || !state.pencil);
    if(enabled && state.pencil) {
      const path=paths[state.index];
      const length=path.getTotalLength();
      const at=length*state.draw;
      let point=path.getPointAtLength(at);
      const before=path.getPointAtLength(Math.max(0,at-12)),after=path.getPointAtLength(Math.min(length,at+12));
      const tangent=Math.atan2(after.y-before.y,after.x-before.x);
      if(state.travelling){
        const previous=paths[state.index-1];
        const origin=previous.getPointAtLength(previous.getTotalLength());
        point=new DOMPoint(origin.x+(point.x-origin.x)*state.travel,origin.y+(point.y-origin.y)*state.travel);
      }
      const angle=31+Math.sin(tangent*2)*6+Math.sin(state.progress*33)*1.5+state.elevation*4;
      pencil.setAttribute('transform',`translate(${point.x} ${point.y}) rotate(${angle})`);
      pencilBody.setAttribute('transform',`translate(0 ${-state.elevation*9})`);
      pencilShadow.setAttribute('transform',`translate(${6+state.elevation*8} ${6+state.elevation*5})`);
      pencilShadow.setAttribute('opacity',String(.2-state.elevation*.09));
      dust.setAttribute('transform',`translate(${point.x} ${point.y})`);
      dust.querySelectorAll('circle').forEach((grain,i)=>{
        const age=state.draw*(i+1);
        grain.setAttribute('cx',String(-4-age*6));
        grain.setAttribute('cy',String(-3-age*7+age*age*9));
        grain.setAttribute('opacity',String(.4*state.pressure));
      });
      debug.tip=state.travelling?null:{x:point.x,y:point.y,index:state.index,draw:state.draw};
    } else debug.tip=null;
    copies.forEach((copy,i)=>{
      copy.dataset.current=String(i===state.act);
      if(enabled && i!==state.act) copy.setAttribute('aria-hidden','true');
      else copy.removeAttribute('aria-hidden');
    });
    steps.forEach((button,i)=>{
      if(state.act===i)button.setAttribute('aria-current','step');
      else button.removeAttribute('aria-current');
    });
    slider.value=String(Math.round(state.progress*1000));
    percent.value=`${Math.round(state.progress*100)}%`;
    host!.dataset.progress=state.progress.toFixed(6);
    debug.index=state.index;debug.progress=state.progress;
  }
  function render(now:number) {
    raf=0;debug.frames++;
    if(width!==innerWidth||height!==innerHeight)layoutPending=true;
    if(layoutPending)measure();
    if(playing && enabled) {
      progress=Math.min(1,playProgress+(now-playTime)/(generatedPlaybackSeconds*1000));
      ownScroll=Math.round(start+run*progress);
      scrollTo({top:ownScroll,behavior:'instant'});
      if(progress>=1)stop();
    } else progress=enabled?Math.min(1,Math.max(0,(scrollY-start)/run)):1;
    paint(progress);debug.ready=true;
    if(playing)request();
  }
  function request() { if(!raf&&!document.hidden)raf=requestAnimationFrame(render); }
  function seek(p:number) {
    stop();if(!enabled)return;
    scrollTo({top:start+run*Math.min(1,Math.max(0,p)),behavior:'instant'});request();
  }
  slider.addEventListener('input',()=>seek(Number(slider.value)/1000));
  steps.forEach((button,i)=>button.addEventListener('click',()=>seek(generatedActs[i].start+(generatedActs[i].end-generatedActs[i].start)*.88)));
  restart.addEventListener('click',()=>seek(0));
  play.addEventListener('click',()=>{
    if(playing){stop();return;}
    if(!enabled)return;
    playProgress=progress>.995?0:progress;
    playTime=performance.now();playing=true;debug.playing=true;
    play.textContent='Pausar';play.setAttribute('aria-pressed','true');request();
  });
  readingButton.addEventListener('click',()=>{reading=!reading;stop();layoutPending=true;request();});
  addEventListener('scroll',()=>{
    if(playing && Math.abs(scrollY-ownScroll)>3)stop();
    request();
  },{passive:true});
  addEventListener('wheel',stop,{passive:true});
  addEventListener('touchstart',event=>{
    if(!(event.target instanceof Element && event.target.closest('button,input')))stop();
  },{passive:true});
  addEventListener('keydown',event=>{
    if(event.target instanceof Element && event.target.closest('button,input,a'))return;
    if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))stop();
  });
  addEventListener('resize',()=>{stop();layoutPending=true;request();},{passive:true});
  reduced.addEventListener('change',()=>{stop();layoutPending=true;request();});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){stop();cancelAnimationFrame(raf);raf=0;}
    else request();
  });
  document.addEventListener('sl:themechange',request);
  addEventListener('beforeprint',()=>{stop();paint(1);});
  addEventListener('afterprint',request);
  void cacheInkMask(svg).then(cached=>{debug.maskCached=cached;});
  request();
}
