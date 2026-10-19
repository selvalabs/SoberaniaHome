export function luminance(rgb:number[]) {
  return rgb.slice(0,3).map(value=>{
    const c=value/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;
  }).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
}

export function contrast(a:number,b:number) {return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}

function hueColor(hue:number,light:number) {
  const h=((hue%360)+360)%360/60,c=(1-Math.abs(2*light-1))*.78;
  const x=c*(1-Math.abs(h%2-1)),m=light-c/2;
  const values=h<1?[c,x,0]:h<2?[x,c,0]:h<3?[0,c,x]:h<4?[0,x,c]:h<5?[x,0,c]:[c,0,x];
  return values.map(v=>Math.round((v+m)*255));
}

/** Pick colored ink for the actual paper under a text run, not the page theme.
 * Keep the original light/dark polarity wherever it can reach the contrast
 * floor. The safety margin also protects interpolation inside the gradient. */
export function glowColor(hue:number,background:number,foreground:number) {
  let lightInk=foreground>background;
  if(contrast(lightInk?1:0,background)<4.8)lightInk=!lightInk;
  let light=lightInk?.74:.32;
  let rgb=hueColor(hue,light);
  while(contrast(luminance(rgb),background)<4.8&&light>0&&light<1){
    light=Math.max(0,Math.min(1,light+(lightInk?.01:-.01)));rgb=hueColor(hue,light);
  }
  return rgb;
}

export function textSurface(element:HTMLElement) {
  const chain:HTMLElement[]=[];
  for(let node:HTMLElement|null=element;node;node=node.parentElement)chain.unshift(node);
  let background=[255,255,255];
  for(const node of chain){
    const color=(getComputedStyle(node).backgroundColor.match(/[\d.]+/g)||[]).map(Number);
    const alpha=color.length===3?1:color[3]||0;
    if(!alpha)continue;
    background=background.map((value,index)=>color[index]*alpha+value*(1-alpha));
  }
  const color=getComputedStyle(element).color;
  return {background:luminance(background),foreground:luminance((color.match(/[\d.]+/g)||[]).map(Number)),color};
}
