export type RevealRunway = { start: number; end: number; extra: number };

/** Remove reading runway from the physics clock, with smooth speed at both ends.
 * The page still scrolls normally; one natural fall is spread over the whole fold. */
export function leafScrollClock(scroll: number, runways: readonly RevealRunway[]) {
  let removed = 0;
  for (const {start,end,extra} of runways) {
    const length=end-start;
    if (length<=0 || extra<=0 || scroll<=start) continue;
    if (scroll>=end) { removed+=extra; continue; }
    const t=(scroll-start)/length;
    // Keep speed positive even for unusually short content and a long hold.
    const edge=Math.min(.08,Math.max(.000001,(1-extra/length)*.5));
    const integral=(u:number)=>edge*(u*u*u-.5*u*u*u*u);
    const area=1-edge;
    const distance=t<edge ? integral(t/edge)
      : t>1-edge ? area-integral((1-t)/edge)
      : t-edge*.5;
    removed+=extra*distance/area;
  }
  return scroll-removed;
}
