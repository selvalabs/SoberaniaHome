import { cacheInkMask, createGeneratedInkPainter } from './generated-ink-painter';
import { landingInkScenes } from './landing-ink-scenes';

/** Called only by the landing's existing native-scroll clock. No RAF, wheel
 * interception, simulation timer or additional scroll listener is created. */
export function createLandingInk() {
  const scenes=Array.from(document.querySelectorAll<SVGSVGElement>('[data-landing-ink]')).map(svg=>{
    const key=svg.dataset.landingInk as keyof typeof landingInkScenes;
    const spec=landingInkScenes[key];
    const painter=createGeneratedInkPainter(svg,spec.highlights);
    const beats=Array.from(svg.parentElement!.querySelectorAll<HTMLElement>('[data-ink-beat]'));
    let cached=false;
    const debug={progress:1,index:0,enabled:false,tip:null as null|{x:number;y:number;index:number;draw:number},maskCached:false};
    return {key,svg,painter,beats,debug,cache(){
      if(cached)return;cached=true;
      void cacheInkMask(svg).then(value=>{debug.maskCached=value;});
    }};
  });
  const observer='IntersectionObserver' in window ? new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      scenes.find(scene=>scene.svg===entry.target)?.cache();observer?.unobserve(entry.target);
    }
  },{rootMargin:'800px'}) : null;
  scenes.forEach(scene=>observer?observer.observe(scene.svg):scene.cache());
  function render(progress:Record<string,number>,active:boolean) {
    for(const scene of scenes){
      const enabled=active&&innerHeight>=580;
      const p=enabled?(progress[scene.key]??0):1;
      const state=scene.painter.paint(p,enabled);
      scene.svg.dataset.inkProgress=state.progress.toFixed(6);
      scene.svg.dataset.inkEnabled=String(enabled);
      scene.beats.forEach((beat,i)=>beat.dataset.current=String(i===Math.min(2,state.act)));
      Object.assign(scene.debug,{progress:state.progress,index:state.index,enabled,tip:state.tip});
    }
  }
  let last:Record<string,number>={},active=false;
  return {
    render(progress:Record<string,number>,enabled:boolean){last=progress;active=enabled;render(progress,enabled);},
    print(){render({},false);}, restore(){render(last,active);},
    debug:Object.fromEntries(scenes.map(scene=>[scene.key,scene.debug])),
  };
}
