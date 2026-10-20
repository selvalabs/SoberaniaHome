/** A local helical gust layered on the approved pendular fall.
 * Spatial displacement fades at both ends; completed axial turns remain. */
export function galleryLeafSpiral(progress: number, turns: number, direction: number) {
  const p=Math.max(0,Math.min(1,progress));
  const cycles=Math.max(3,Math.min(5,Math.round(turns)));
  const eased=p*p*(3-2*p);
  const phase=eased*Math.PI*2*cycles;
  const envelope=Math.sin(Math.PI*p)**2;
  return {
    envelope,
    x:direction*envelope*Math.sin(phase),
    y:envelope*Math.cos(phase),
    roll:direction*cycles*360*eased,
    pitch:envelope*24*Math.sin(phase+Math.PI/4),
    yaw:direction*envelope*46*Math.cos(phase),
    bank:direction*envelope*32*Math.sin(phase)
  };
}
