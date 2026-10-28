/** Editorial cable dynamics sampled from scroll, never from elapsed wall time. */
export type Point = {x:number;y:number};
export type NetworkWire = {id:string;kind:'capture'|'profit'|'common';from:Point;to:Point;c1:Point;c2:Point;seed:number};
const clamp=(n:number)=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const ease=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
export const networkWires:NetworkWire[]=[
  {id:'attention',kind:'capture',from:{x:350,y:530},to:{x:1010,y:198},c1:{x:550,y:545},c2:{x:800,y:190},seed:.2},
  {id:'data',kind:'capture',from:{x:420,y:588},to:{x:1010,y:276},c1:{x:650,y:600},c2:{x:790,y:290},seed:1.1},
  {id:'production',kind:'capture',from:{x:715,y:555},to:{x:1110,y:348},c1:{x:865,y:455},c2:{x:1000,y:354},seed:2.4},
  {id:'revenue',kind:'profit',from:{x:1198,y:70},to:{x:1430,y:182},c1:{x:1330,y:10},c2:{x:1428,y:45},seed:.7},
  {id:'publish',kind:'common',from:{x:230,y:850},to:{x:703,y:866},c1:{x:320,y:728},c2:{x:570,y:735},seed:1.9},
  {id:'organize',kind:'common',from:{x:703,y:866},to:{x:1045,y:885},c1:{x:810,y:742},c2:{x:980,y:765},seed:3.1},
  {id:'share',kind:'common',from:{x:903,y:757},to:{x:230,y:850},c1:{x:930,y:1000},c2:{x:390,y:1020},seed:4.3},
];

export function sampleNetwork(value:number,active=true){
  const p=active?clamp(value):1;
  const collective=ease((p-.60)/.31),capture=ease((p-.27)/.14);
  return {progress:p,act:p<.31?0:p<.62?1:2,collective,capture,
    // Shared artwork uses the established three-phase pencil schedule unchanged.
    ink:p<.32?.27*ease(p/.32):p<.64?.27+.16*ease((p-.32)/.32):.43+.57*ease((p-.64)/.32),
    platformLight:active?capture*(1-.6*collective):.3,
    commonLight:active?.15+.85*collective:.8,
  };
}

export function cableGeometry(wire:NetworkWire,value:number){
  const p=clamp(value),entry=wire.kind==='common'?.59:.26;
  const local=clamp((p-entry)/.35);
  // A damped impulse: endpoints stay attached, sag overshoots and settles.
  const impulse=Math.sin(local*Math.PI*3)*Math.exp(-local*4)*Math.sin(local*Math.PI);
  const sag=impulse*(wire.kind==='common'?75:36);
  const lean=impulse*Math.sin(wire.seed)*22;
  return {from:wire.from,to:wire.to,c1:{x:wire.c1.x+lean,y:wire.c1.y+sag},c2:{x:wire.c2.x-lean,y:wire.c2.y+sag}};
}
export function cubicPoint(curve:ReturnType<typeof cableGeometry>,value:number):Point{
  const t=clamp(value),u=1-t;
  return {x:u*u*u*curve.from.x+3*u*u*t*curve.c1.x+3*u*t*t*curve.c2.x+t*t*t*curve.to.x,
    y:u*u*u*curve.from.y+3*u*u*t*curve.c1.y+3*u*t*t*curve.c2.y+t*t*t*curve.to.y};
}
export function networkParticles(wire:NetworkWire,value:number,active=true){
  const state=sampleNetwork(value,active),curve=cableGeometry(wire,state.progress);
  const common=wire.kind==='common';
  const reveal=common?state.collective:state.capture;
  const strength=active?reveal*(common?1:1-state.collective*.72):0;
  return Array.from({length:5},(_,i)=>{
    const t=((state.progress*(common?9:13)+wire.seed+i/5)%1+1)%1;
    return {...cubicPoint(curve,t),opacity:strength*Math.sin(Math.PI*t)**2};
  });
}
export function cablePath(curve:ReturnType<typeof cableGeometry>){
  const f=(n:number)=>n.toFixed(3);
  return `M${f(curve.from.x)} ${f(curve.from.y)} C${f(curve.c1.x)} ${f(curve.c1.y)} ${f(curve.c2.x)} ${f(curve.c2.y)} ${f(curve.to.x)} ${f(curve.to.y)}`;
}
