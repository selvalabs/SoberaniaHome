import {networkWires,sampleNetwork,networkParticles,cableGeometry,cablePath} from './network-flow-model';

/** Shares motion.ts's scroll clock and sleeps with it. No independent listeners or RAF. */
export function createNetworkFlow(){
  const section=document.getElementById('meios-digitais');
  const groups=networkWires.map(wire=>({wire,group:section?.querySelector<SVGGElement>(`[data-network-wire="${wire.id}"]`)}));
  const local=section?.querySelector<SVGGElement>('[data-network-local-light]');
  const plates=Array.from(section?.querySelectorAll<HTMLElement>('[data-network-plate]')||[]);
  const debug={progress:1,act:2,collective:1,transition:1,enabled:false};
  let old=-1,wasActive=false;
  function render(progress:number,active:boolean){
    if(!section||old===progress&&wasActive===active)return;
    old=progress;wasActive=active;
    const state=sampleNetwork(progress,active);
    section.dataset.networkAct=String(state.act);
    section.dataset.networkProgress=state.progress.toFixed(6);
    const counter=section.querySelector('[data-network-counter]');
    if(counter)counter.textContent=`0${state.act+1} / 03`;
    for(const plate of plates){
      const opacity=plate.dataset.networkPlate==='response'?state.responseOpacity:state.primaryOpacity;
      plate.style.opacity=String(opacity);
      plate.setAttribute('aria-hidden',String(active&&opacity<.001));
    }
    for(const {wire,group} of groups){
      if(!group)continue;
      const common=wire.kind==='common';
      const reveal=common?state.collective:state.capture;
      const path=cablePath(cableGeometry(wire,state.progress));
      group.style.opacity=String(common ? .9*reveal : reveal*(.65-state.collective*.46));
      group.querySelectorAll('path').forEach(el=>el.setAttribute('d',path));
      const stroke=group.querySelector('.network-wire')!;
      stroke.setAttribute('stroke-dasharray',`${reveal} 1`);
      const particles=networkParticles(wire,state.progress,active);
      group.querySelectorAll('circle').forEach((circle,i)=>{
        circle.setAttribute('cx',particles[i].x.toFixed(3));circle.setAttribute('cy',particles[i].y.toFixed(3));circle.setAttribute('opacity',particles[i].opacity.toFixed(3));
      });
    }
    if(local)local.style.opacity=String(state.commonLight*state.collective);
    Object.assign(debug,{progress:state.progress,act:state.act,collective:state.collective,transition:state.transition,enabled:active});
    return state;
  }
  let printing=false,lastProgress=1,lastActive=false;
  return {
    render(progress:number,active:boolean){if(printing)return;lastProgress=progress;lastActive=active;return render(progress,active);},
    print(){printing=true;render(1,false);},
    restore(){printing=false;render(lastProgress,lastActive);},debug
  };
}
