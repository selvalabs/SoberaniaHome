/** Editorial cable dynamics sampled from scroll, never from elapsed wall time. */
export type Point = {x:number;y:number};
export type NetworkWire = {id:string;kind:'capture'|'profit'|'common';from:Point;to:Point;c1:Point;c2:Point;seed:number};
const clamp=(n:number)=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const ease=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
export const networkPasses=[{start:0,end:.19},{start:.20,end:.60},{start:.64,end:1}];
export const networkWires:NetworkWire[]=[
  {id:'attention',kind:'capture',from:{x:350,y:530},to:{x:1010,y:198},c1:{x:550,y:545},c2:{x:800,y:190},seed:.2},
  {id:'data',kind:'capture',from:{x:420,y:588},to:{x:1010,y:276},c1:{x:650,y:600},c2:{x:790,y:290},seed:1.1},
  {id:'production',kind:'capture',from:{x:715,y:555},to:{x:1110,y:348},c1:{x:865,y:455},c2:{x:1000,y:354},seed:2.4},
  {id:'revenue',kind:'profit',from:{x:1198,y:70},to:{x:1430,y:182},c1:{x:1330,y:10},c2:{x:1428,y:45},seed:.7},
  {id:'publish',kind:'common',from:{x:355,y:635},to:{x:455,y:310},c1:{x:945,y:455},c2:{x:650,y:455},seed:1.9},
  {id:'organize',kind:'common',from:{x:930,y:622},to:{x:1100,y:252},c1:{x:480,y:420},c2:{x:1110,y:365},seed:3.1},
  {id:'share',kind:'common',from:{x:1110,y:255},to:{x:1280,y:405},c1:{x:1105,y:340},c2:{x:1300,y:320},seed:4.3},
];

export function sampleNetwork(value:number,active=true){
  const p=active?clamp(value):1;
  const collective=p>=.95?1:ease((p-.73)/.22),capture=ease((p-.20)/.18);
  const transition=ease((p-.54)/.11);
  return {progress:p,act:networkPasses.reduce((at,pass,i)=>p>=pass.start?i:at,0),collective,capture,
    // A complete first plate, a reading pause, then a separately drawn answer.
    // Linear ink time avoids accelerating through the final detailed contours.
    ink:clamp(p/.42),responseInk:p>=.95?1:clamp((p-.56)/.39),transition,
    primaryOpacity:active?1-transition:1,responseOpacity:active?transition:1,
    commonLight:active?.15+.85*collective:.8,
  };
}

export function cableGeometry(wire:NetworkWire,value:number){
  const p=clamp(value),entry=wire.kind==='common'?.70:.26;
  const local=clamp((p-entry)/(wire.kind==='common'?.25:.35));
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
