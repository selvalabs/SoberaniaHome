import '../styles/hero-print.css';

const clamp = (n: number) => Math.max(0, Math.min(1, n));
type PrintBlock = { element: HTMLElement; lines: { top: number; bottom: number }[]; top: number; height: number };

/** A reversible print pass over the original semantic text; no cloned lettering. */
export function createHeroPrint(hero: HTMLElement | null) {
  const stage = hero?.querySelector<HTMLElement>('.hero-stage');
  if (!hero || !stage) return null;
  const blocks: PrintBlock[] = Array.from(hero.querySelectorAll<HTMLElement>('.hero-lead,.hero-argument,.hero-method'))
    .map(element => ({ element, lines: [], top: 0, height: 0 }));
  let enabled = false, pinned = false, start = 0, run = 1, viewport = innerHeight;
  function measure(active: boolean, height: number, width: number, mast: number) {
    enabled = active; viewport = height;
    hero!.dataset.printPinned = 'false';
    const rect = stage!.getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(hero!).paddingTop) + parseFloat(getComputedStyle(hero!).paddingBottom);
    pinned = active && width >= 1100 && rect.height + mast + 24 <= height;
    start = Math.max(0, rect.top + scrollY - mast - 12);
    run = Math.round(Math.min(1100, height * 1.15));
    hero!.dataset.printEnabled = String(active);
    hero!.dataset.printPinned = String(pinned);
    hero!.style.height = pinned ? `${rect.height + run + padding}px` : '';
    for (const block of blocks) {
      const bounds = block.element.getBoundingClientRect();
      block.top = bounds.top + scrollY; block.height = bounds.height;
      const lines: PrintBlock['lines'] = [];
      const walker = document.createTreeWalker(block.element, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent?.trim()) continue;
        range.selectNodeContents(walker.currentNode);
        for (const r of Array.from(range.getClientRects())) {
          const top = Math.max(0, r.top - bounds.top - 3), bottom = Math.min(bounds.height, r.bottom - bounds.top + 3);
          const line = lines.find(l => Math.abs(l.top - top) < 10);
          if (line) { line.top = Math.min(line.top, top); line.bottom = Math.max(line.bottom, bottom); }
          else lines.push({ top, bottom });
        }
      }
      block.lines = lines.sort((a,b) => a.top-b.top);
    }
  }
  function render(y: number) {
    const progress = clamp((y-start)/run);
    blocks.forEach((block,index) => {
      const p = !enabled ? 1 : pinned
        ? clamp((progress - [0,.22,.45][index]) / .36 + (index === 0 ? .12 : 0))
        : clamp((viewport * .78 - (block.top-y)) / Math.min(block.height + viewport*.22, viewport*.6));
      const {element,lines,height} = block;
      element.dataset.printProgress = p.toFixed(3);
      if (p >= 1 || !lines.length) element.style.removeProperty('clip-path');
      else {
        const cursor = p * lines.length;
        const i = Math.min(lines.length-1,Math.floor(cursor));
        const line = lines[i];
        const top = i === 0 ? 0 : (lines[i-1].bottom+line.top)/2;
        const bottom = i === lines.length-1 ? height : (line.bottom+lines[i+1].top)/2;
        const x = (cursor-i)*108-4;
        // Uneven ink edge advances across one complete line at a time.
        element.style.clipPath = `polygon(0 0,100% 0,100% ${top}px,${x}% ${top}px,${x+1.4}% ${top+(bottom-top)*.3}px,${x-.8}% ${top+(bottom-top)*.65}px,${x+.6}% ${bottom}px,0 ${bottom}px)`;
      }
      element.style.setProperty('--print-register',`${(1-p)*1.8}px`);
      element.style.setProperty('--print-highlight',`${clamp((p-.55)/.45)*100}%`);
    });
  }
  return { measure, render };
}
