const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const p=clamp(n);return p*p*(3-2*p);};
/** Scroll is the clock. No perpetual ticker, scroll hijacking or extra pin. */
export function initVisualStories(){
  const init=()=>{
    const elements=[...document.querySelectorAll<HTMLElement>('[data-visual-story]:not([data-enhanced])')];
    if(!elements.length)return;
    document.documentElement.classList.add('narrative-43');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const scenes=elements.map(el=>({el,kind:el.dataset.visualStory,manual:null as number|null,visible:true}));
    const knowledge=document.querySelector<HTMLElement>('[data-knowledge-assembly]');
    let raf=0;
    const request=()=>{if(!raf&&!document.hidden)raf=requestAnimationFrame(render);};
    function render(){
      raf=0;
      const staticMode=reduced.matches||document.documentElement.dataset.reading==='true';
      if(knowledge){const r=knowledge.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const p=staticMode?1:ease((innerHeight-r.top)/(innerHeight+r.height*.2));knowledge.style.setProperty('--assembly',String(p));}}
      for(const s of scenes){
        if(!s.visible)continue;
        const box=s.el.getBoundingClientRect();
        const p=s.manual??(staticMode?1:clamp((innerHeight*.88-box.top)/(innerHeight*.58+box.height*.4)));
        const step=Math.min(2,Math.floor(p*3));
        s.el.dataset.storyStatic=String(staticMode);
        s.el.dataset.storyStep=String(step);s.el.style.setProperty('--story-progress',String(p));
        s.el.querySelectorAll<HTMLElement>('[data-story-caption]').forEach((caption,i)=>caption.hidden=!staticMode&&i!==step);
        s.el.querySelectorAll<HTMLButtonElement>('[data-story-go]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===step)));
        const set=(selector:string,value:(i:number)=>string)=>s.el.querySelectorAll<SVGElement>(selector).forEach((el,i)=>el.setAttribute('transform',value(i)));
        if(s.kind==='time'){
          set('[data-story-gear]',()=>`translate(470 235) rotate(${p*400})`);
          set('[data-story-ticket]',i=>{
            const a=ease(p*2.6-i*.035),b=ease((p-.43)*2.3-i*.016);
            const startX=75+i%3*64,startY=90+Math.floor(i/3)*74;
            const x=startX+(445-startX)*a+310*b;
            const y=startY+(210-startY)*a+([-140,0,130][i%3])*b;
            return `translate(${x} ${y}) rotate(${(1-a)*(-9+i%3*9)+b*(i%2?8:-8)}) scale(${1-b*.6})`;
          });
        }else if(s.kind==='handover'){
          const split=ease((p-.1)*1.7),deliver=ease((p-.55)*2.3);
          const mobile=innerWidth<760;
          s.el.querySelector('svg.story-drawing')?.setAttribute('viewBox',mobile?'215 0 530 470':'0 0 960 460');
          set('[data-story-shell]',()=>`translate(480 ${220-split*60}) scale(${1-split*.35})`);
          set('[data-story-layer]',i=>`translate(${480+((mobile?365+i%2*230:165+i*210)-480)*split} ${220+((mobile?Math.floor(i/2)*140-110:Math.sin(i*1.5)*28))*split+deliver*20}) rotate(${(i-1.5)*split*5*(1-deliver)}) scale(${.2+split*.8})`);
          s.el.querySelectorAll<SVGElement>('[data-story-layer]').forEach(el=>el.style.opacity=String(.15+split*.85));
          const art=s.el.querySelector<HTMLElement>('.story-bench-art');if(art){art.style.opacity=String(deliver*.85);art.style.transform=`translateY(${(1-deliver)*45}px) scale(${.93+deliver*.07})`;}
        }else{
          const t=ease(p),x=200+560*t,y=235-Math.sin(t*Math.PI*2)*65;
          set('[data-story-capsule]',()=>`translate(${x} ${y}) rotate(${Math.sin(t*Math.PI*2)*-7})`);
          s.el.querySelectorAll<SVGCircleElement>('[data-story-packet]').forEach((packet,i)=>{const q=ease(clamp(p-i*.035));packet.setAttribute('cx',String(200+560*q));packet.setAttribute('cy',String(300-Math.sin(q*Math.PI*2)*40));});
        }
        s.el.querySelectorAll<SVGElement>('[data-story-reveal]').forEach(el=>el.style.opacity=String(ease((p-.45)*2)));
      }
    }
    const observer=new IntersectionObserver(entries=>{for(const entry of entries){const s=scenes.find(s=>s.el===entry.target);if(s)s.visible=entry.isIntersecting;}request();},{rootMargin:'150px'});
    for(const s of scenes){
      s.el.dataset.enhanced='true';observer.observe(s.el);
      s.el.querySelectorAll<HTMLButtonElement>('[data-story-go]').forEach((button,i)=>button.addEventListener('click',()=>{s.manual=[.08,.5,1][i];request();}));
    }
    // A deliberate page scroll resumes the narrative after inspecting a state.
    for(const type of ['wheel','touchmove'])addEventListener(type,()=>{scenes.forEach(s=>s.manual=null);},{passive:true});
    addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});
    reduced.addEventListener('change',request);
    new MutationObserver(request).observe(document.documentElement,{attributes:true,attributeFilter:['data-reading']});
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else request();});
    document.querySelectorAll<HTMLDetailsElement>('details.narrative-detail').forEach(detail=>detail.addEventListener('toggle',()=>document.dispatchEvent(new CustomEvent('sl:layout-change'))));
    // Establish caption and mobile SVG geometry before the first scroll jump,
    // even when a newly opened browser tab is initially in the background.
    render();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
}
