import '../styles/hero-print.css';

const clamp = (n: number, max = 1) => Math.max(0, Math.min(max, n));
const starts = [.07, .38, .69];
const duration = .24;

/** One complete paragraph per print pass, with a reading pause between passes. */
export function createHeroPrint(hero: HTMLElement | null) {
  const stage = hero?.querySelector<HTMLElement>('.hero-stage');
  if (!hero || !stage) return null;
  const blocks = Array.from(hero.querySelectorAll<HTMLElement>('.hero-lead,.hero-argument,.hero-method'));
  let enabled = false, start = 0, run = 1, anchor = 0;
  let framing: number[] = [];
  function measure(active: boolean, height: number, _width: number, mast: number) {
    enabled = active;
    hero!.dataset.printPinned = 'false';
    const rect = stage!.getBoundingClientRect();
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
    let shift = 0;
    blocks.forEach((element,index) => {
      // Finish the previous block before the next even starts.
      const p = enabled ? clamp((progress-starts[index])/duration) : 1;
      element.dataset.printProgress = p.toFixed(3);
      if (p >= 1) element.style.removeProperty('clip-path');
      else if (p <= 0) element.style.clipPath = 'inset(0 100% 0 0)';
      else {
        const x=p*108-4;
        element.style.clipPath=`polygon(0 0,${x}% 0,${x+1.5}% 28%,${x-.8}% 65%,${x+.6}% 100%,0 100%)`;
      }
      element.style.setProperty('--print-register',`${(1-p)*1.8}px`);
      element.style.setProperty('--print-highlight',`${clamp((p-.55)/.45)*100}%`);
      // Tall compositions stay pinned too; frame each paragraph during the pause.
      const previous=index===0?0:framing[index-1];
      const t=clamp((progress-(starts[index]-.07))/.07);
      shift+=(framing[index]-previous)*t*t*(3-2*t);
    });
    hero!.style.setProperty('--print-anchor',`${anchor-(enabled?shift:0)}px`);
  }
  return { measure, render };
}
