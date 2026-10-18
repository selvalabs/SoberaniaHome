/** Reduced flutter model, in dimensionless units. Not a CFD solver.
 * The self-excited angular oscillator is a normal-form approximation of
 * aerodynamic flutter; its energy comes from descent and saturates with angle.
 * Translation then responds to attitude, relative wind and quadratic drag.
 * Fixed-step samples make scroll scrubbing reversible and frame-rate independent.
 * Background: Andersen, Pesavento & Wang (2005), doi:10.1017/S002211200500594X.
 */
export type LeafState = { x:number; vx:number; fallSpeed:number; bank:number; angularSpeed:number; twist:number; wind:number };

/** A separate gust response preserves the accepted flutter orbit. The impulse
 * is filtered through damped inertial stages: displacement rises then relaxes;
 * angular momentum makes one turn and settles without winding back. This is
 * an art-directed reduced response, not a calibrated aerodynamic prediction.
 * Coupled 3D rotation reference: Varshney, Chang & Wang (2013),
 * doi:10.1103/PhysRevE.87.053021 (their experiments use still air).
 */
export function leafGust(elapsed:number, direction=1) {
  if(elapsed<=0)return {drift:0,turn:0,spin:0};
  const q=elapsed/.48, decay=Math.exp(-q);
  return {
    drift:direction*q*q*Math.exp(2-q)/4,
    turn:direction*360*(1-decay*(1+q+q*q/2)),
    spin:direction*q*q*decay/2
  };
}

export function createLeafFlight(step=1/120) {
  if(!Number.isFinite(step)||step<=0||step>1/60)throw new RangeError('Leaf integration step must be between 0 and 1/60.');
  const gust=(t:number)=>.12*Math.sin(t*.43)+.06*Math.sin(t*1.17+.8)+.025*Math.sin(t*2.31+1.6);
  // x, horizontal velocity, descent velocity, bank, angular velocity,
  // torsion and torsional velocity. Position is never prescribed by a sine.
  let state=[0,0,.8,.22,.6,0,0];
  const output=(s:number[],t:number):LeafState=>({x:s[0],vx:s[1],fallSpeed:s[2],bank:s[3],angularSpeed:s[4],twist:s[5],wind:gust(t)});
  const frames:LeafState[]=[output(state,0)];
  function derivative(s:number[],t:number) {
    const [,vx,vz,bank,omega,twist,twistSpeed]=s;
    // Coherent gusts at several time scales, never per-frame random jitter.
    const wind=gust(t),relative=vx-wind;
    const angularAcceleration=-(1.65**2)*bank+.85*(1-(bank/.25)**2)*omega+wind*.45;
    const lift=2.8*Math.sin(bank);
    const horizontalDrag=1.25*relative*Math.abs(relative);
    const verticalDrag=(1.8*Math.cos(bank)**2+.25)*vz*Math.abs(vz);
    const rotationalLift=.8*omega*relative;
    // Torsional inertia lags the aerodynamic load. The blade banks before
    // its momentum changes direction, then twists as the new glide develops.
    const twistTarget=.6*omega+.45*relative+wind;
    return [vx,lift-horizontalDrag,1.45-verticalDrag-rotationalLift,omega,angularAcceleration,twistSpeed,7*(twistTarget-twist)-3.6*twistSpeed];
  }
  function advance() {
    const t=(frames.length-1)*step;
    // Midpoint integration avoids the phase drift of forward Euler, while
    // remaining inexpensive enough to seek through an entire long page.
    const first=derivative(state,t);
    const midpoint=state.map((value,i)=>value+first[i]*step*.5);
    const second=derivative(midpoint,t+step*.5);
    state=state.map((value,i)=>value+second[i]*step);
    frames.push(output(state,t+step));
  }
  return (seconds:number):LeafState => {
    const t=Math.max(0,Number.isFinite(seconds)?seconds:0);
    const index=Math.floor(t/step),fraction=t/step-index;
    while(frames.length<=index+1)advance();
    const a=frames[index],b=frames[index+1];
    const lerp=(key:keyof LeafState)=>a[key]+(b[key]-a[key])*fraction;
    return {x:lerp('x'),vx:lerp('vx'),fallSpeed:lerp('fallSpeed'),bank:lerp('bank'),angularSpeed:lerp('angularSpeed'),twist:lerp('twist'),wind:lerp('wind')};
  };
}
