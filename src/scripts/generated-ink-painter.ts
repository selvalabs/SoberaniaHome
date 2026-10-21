import { generatedHighlights, sampleGeneratedInk, scheduleGeneratedGuides } from './generated-ink-model';

/** Cache the display mask once, rather than filtering 1.5 million source pixels
 * on every SVG repaint. This never changes the source PNG or writes an asset. */
export async function cacheInkMask(svg: SVGSVGElement) {
  let url: string | undefined;
  try {
    const mask=svg.querySelector<SVGMaskElement>('[data-ink-mask]') || svg.querySelector<SVGMaskElement>('#workbench-ink')!;
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

/** Same approved painter for the study and the landing. It owns no event,
 * scroll position or RAF. Its caller supplies the one authoritative progress. */
export function createGeneratedInkPainter(svg: SVGSVGElement, highlights = generatedHighlights) {
  const paths=Array.from(svg.querySelectorAll<SVGPathElement>('[data-generated-guide]'));
  const schedule=scheduleGeneratedGuides(paths.map(path=>({length:Number(path.dataset.length),phase:Number(path.dataset.phase),gap:Number(path.dataset.gap)})));
  const full=svg.querySelector<SVGRectElement>('[data-generated-complete]')!;
  const lightGuides=Array.from(svg.querySelectorAll<SVGPathElement>('[data-generated-light-guide]'));
  const points=Array.from(svg.querySelectorAll<SVGEllipseElement>('[data-generated-highlight]'));
  const pencil=svg.querySelector<SVGGElement>('[data-generated-pencil]')!;
  const pencilBody=pencil.querySelector<SVGGElement>('[data-pencil-body]')!;
  const pencilShadow=pencil.querySelector<SVGGElement>('[data-pencil-shadow]')!;
  const dust=svg.querySelector<SVGGElement>('[data-generated-dust]')!;
  let oldIndex=-1, oldProgress=-1, oldEnabled=false;
  let tip:null|{x:number;y:number;index:number;draw:number}=null;
  let state=sampleGeneratedInk(schedule,1,highlights);
  function paint(value:number,enabled:boolean) {
    state=sampleGeneratedInk(schedule,value,highlights);
    if(oldProgress===state.progress && oldEnabled===enabled)return {...state,tip};
    oldProgress=state.progress;oldEnabled=enabled;
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
    points.forEach((point,i)=>point.setAttribute('opacity',String(enabled?state.keyLights[i]:0)));
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
      tip=state.travelling?null:{x:point.x,y:point.y,index:state.index,draw:state.draw};
    } else tip=null;

    return {...state,tip};
  }
  return {paint};
}
