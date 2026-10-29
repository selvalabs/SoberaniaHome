/** A bounded native-scroll scene: drawing in the centre, one short narration.
 * Shares motion.ts's clock and leaf runway. No wheel trap or independent RAF. */
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export function narrationIndex(progress:number,kind:string){
  const p=clamp(progress);
  return kind==='network'?(p<.20?0:p<.64?1:2):(p<.29?0:p<.76?1:2);
}
export function createSceneNarration(section:HTMLElement|null,stageSelector:string,kind:'time'|'network'|'knowledge'|'handover'){
  const stage=section?.querySelector<HTMLElement>(stageSelector);
  if(!section||!stage)return null;
  const lines=Array.from(section.querySelectorAll<HTMLElement>('[data-narration-step]'));
  let enabled=false,start=0,run=1;
  let interval={start:0,end:0,extra:0};
  function render(y:number){
    const p=enabled?clamp((y-start)/run):1;
    const index=narrationIndex(p,kind);
    section!.dataset.narrationAct=String(index);
    section!.dataset.narrativeProgress=p.toFixed(6);
    section!.style.setProperty('--narrative-progress',String(p));
    for(const [i,line] of lines.entries()){
      line.dataset.current=String(!enabled||i===index);
      // The static/read/print transcript is exactly the same short HTML copy.
      line.style.removeProperty('clip-path');
    }
    const count=section!.querySelector('[data-narrative-counter]');
    if(count)count.textContent=`0${index+1} / 03`;
    return p;
  }
  function measure(active:boolean,height:number,width:number,mast:number,paceHeight=height){
    enabled=active;
    section!.style.height='';
    section!.dataset.printPinned='false';
    section!.dataset.printEnabled='false';
    const top=section!.getBoundingClientRect().top+scrollY;
    const anchor=mast+8;
    const frame=Math.max(180,height-anchor-12);
    // Less reading demands less runway. Two intricate plates still need time.
    run=Math.round(Math.max(kind==='network'?2200:1500,Math.min(kind==='network'?3400:2300,paceHeight*(kind==='network'?3.2:2.2))));
    start=Math.max(0,top-anchor);
    section!.style.setProperty('--print-anchor',`${anchor}px`);
    section!.style.setProperty('--print-stage-height',`${frame}px`);
    section!.dataset.printStart=String(start);
    section!.dataset.printRun=String(run);
    section!.dataset.printPinned=String(active);
    section!.dataset.printEnabled=String(active);
    section!.dataset.printViewport=String(active);
    section!.style.height=active?`${frame+run}px`:'';
    interval={start:top,end:top+(active?frame+run:stage!.getBoundingClientRect().height),extra:active?run:0};
    render(scrollY);
  }
  return {measure,render,runway:()=>interval};
}
