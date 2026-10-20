import '../styles/hero-print.css';

const clamp = (n: number, max = 1) => Math.max(0, Math.min(max, n));
const starts = [.07, .38, .69];
const duration = .24;

/** One complete paragraph per print pass, with a reading pause between passes. */
export function createHeroPrint(hero: HTMLElement | null) {
  const stage = hero?.querySelector<HTMLElement>('.hero-stage');
  if (!hero || !stage) return null;
  const message = hero.querySelector<HTMLElement>('.hero-message');
  const blockGeometry: { top: number; height: number; lines: number }[] = [];
  let messageHeight = 0;
  const blocks = Array.from(hero.querySelectorAll<HTMLElement>('.hero-lead,.hero-argument,.hero-method'));
  let enabled = false, start = 0, run = 1, anchor = 0;
  let framing: number[] = [];
  function measure(active: boolean, height: number, _width: number, mast: number) {
    enabled = active;
    hero!.dataset.printPinned = 'false';
    message?.style.removeProperty('height');
    const rect = stage!.getBoundingClientRect();
    const messageRect = message!.getBoundingClientRect();
    messageHeight = messageRect.height;
    blockGeometry.length = 0;
    blocks.forEach(block => { const r=block.getBoundingClientRect(); blockGeometry.push({top:r.top-messageRect.top,height:r.height,lines:Math.max(1,Math.round(r.height/parseFloat(getComputedStyle(block).lineHeight)))}); });
    hero!.style.setProperty('--print-stage-height', `${rect.height}px`);
    const padding = parseFloat(getComputedStyle(hero!).paddingTop) + parseFloat(getComputedStyle(hero!).paddingBottom);
    anchor = mast + 12;
    start = Math.max(0, hero!.getBoundingClientRect().top + scrollY + parseFloat(getComputedStyle(hero!).paddingTop) - anchor);
    run = Math.round(Math.max(1800, Math.min(3400, height * 2.8)));
    const room = height - anchor - 16;
    const travel = Math.max(0, rect.height - room);
    framing = blocks.map(block => {
      const r = block.getBoundingClientRect();
      return clamp(r.top - rect.top - Math.max(12,(room-r.height)/2),travel);
    });
    hero!.dataset.printEnabled = String(active);
    hero!.dataset.printPinned = String(active);
    hero!.dataset.printStart = String(start);
    hero!.dataset.printRun = String(run);
    hero!.style.height = active ? `${rect.height + run + padding}px` : '';
  }
  function render(y: number) {
    const progress = clamp((y-start)/run);
    let shift = 0, occupied = 0, pressure = 0;
    blocks.forEach((element,index) => {
      // Finish the previous block before the next even starts.
      const p = enabled ? clamp((progress-starts[index])/duration) : 1;
      element.dataset.printProgress = p.toFixed(3);
      const geometry = blockGeometry[index];
      const cursor=p*geometry.lines;
      const fraction=cursor-Math.floor(cursor);
      const advance=clamp((fraction-.12)/.76);
      const printed=p>=1?1:(Math.floor(cursor)+advance*advance*(3-2*advance))/geometry.lines;
      if (p>0 && p<1) pressure=Math.sin(advance*Math.PI);
      if (p > 0) occupied = Math.max(occupied, geometry.top + geometry.height*printed);
      if (p >= 1) element.style.removeProperty('clip-path');
      else if (p <= 0) element.style.clipPath = 'inset(0 0 100% 0)';
      else {
        const edge=printed*100;
        element.style.clipPath=`polygon(0 0,100% 0,100% ${edge}%,74% ${edge+.5}%,42% ${edge-.4}%,16% ${edge+.3}%,0 ${edge}%)`;
      }
      element.style.setProperty('--print-register',`${(1-p)*1.8}px`);
      element.style.setProperty('--print-highlight',`${clamp((p-.55)/.45)*100}%`);
      // Tall compositions stay pinned too; frame each paragraph during the pause.
      const previous=index===0?0:framing[index-1];
      const t=clamp((progress-(starts[index]-.07))/.07);
      shift+=(framing[index]-previous)*t*t*(3-2*t);
    });
    hero!.style.setProperty('--print-pressure',String(enabled?pressure:0));
    if (message) message.style.height = enabled ? `${Math.min(messageHeight,occupied)}px` : '';
    hero!.style.setProperty('--print-anchor',`${anchor-(enabled?shift:0)}px`);
  }
  return { measure, render };
}
