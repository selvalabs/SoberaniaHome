import { generatedActs, generatedPlaybackSeconds } from './generated-ink-model';
import { cacheInkMask, createGeneratedInkPainter } from './generated-ink-painter';

/** A raster is the artwork. Extracted paths only open its luminance mask.
 * No wheel interception, accumulated simulation, or redraw while at rest. */
export function initGeneratedInk() {
  const host=document.querySelector<HTMLElement>('[data-generated-scene]');
  if (!host) return;
  const mast=document.querySelector<HTMLElement>('.generated-mast')!;
  const stage=host.querySelector<HTMLElement>('.generated-stage')!;
  const svg=host.querySelector<SVGSVGElement>('[data-generated-art]')!;
  const painter=createGeneratedInkPainter(svg);
  const slider=host.querySelector<HTMLInputElement>('input[type=range]')!;
  const percent=host.querySelector<HTMLOutputElement>('[data-generated-percent]')!;
  const play=host.querySelector<HTMLButtonElement>('[data-generated-play]')!;
  const restart=host.querySelector<HTMLButtonElement>('[data-generated-restart]')!;
  const readingButton=document.querySelector<HTMLButtonElement>('[data-generated-reading]')!;
  const copies=Array.from(host.querySelectorAll<HTMLElement>('[data-generated-copy]'));
  const steps=Array.from(host.querySelectorAll<HTMLButtonElement>('[data-generated-step]'));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let reading=false, enabled=false, raf=0, layoutPending=true;
  let start=0, run=1, progress=0, oldProgress=-1;
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
    const state=painter.paint(value,enabled);
    if(oldProgress===state.progress) return;
    oldProgress=state.progress;
    debug.tip=state.tip;
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
