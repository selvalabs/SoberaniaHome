import { glowColor, textSurface } from './leaf-contrast';

type LeafLight = { x: number; y: number; hue: number; radius: number };

/** CSS owns the loop. Only this moving strip repaints its ink at rest;
 * the document renderer and the leaf's scroll clock remain asleep. */
export function initWorkMarquee() {
  const marquee = document.querySelector<HTMLElement>('[data-work-marquee]');
  const toggle = marquee?.querySelector<HTMLButtonElement>('.work-marquee-toggle');
  if (!marquee || !toggle || marquee.dataset.marqueeReady) return;
  marquee.dataset.marqueeReady = 'true';
  marquee.dataset.marqueePaused = 'false';
  const tokens = Array.from(marquee.querySelectorAll<HTMLElement>('[data-marquee-token]'));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const surfaces = new Map<HTMLElement, ReturnType<typeof textSurface>>();
  let light: LeafLight | null = null, inkFrame = 0;

  function color(token: HTMLElement, hue: number) {
    const surface = surfaces.get(token);
    if (!surface) return;
    const rgb = glowColor(hue, surface.background, surface.foreground);
    token.style.setProperty('--marquee-glow-color', `rgb(${rgb.join(',')})`);
    token.style.setProperty('--marquee-halo', rgb.join(' '));
  }
  function refreshColors() {
    for (const [index, token] of tokens.entries()) {
      // Measure the unpainted parent so hover/leaf ink cannot contaminate the
      // next theme's foreground or contrast calculation.
      surfaces.set(token, textSurface(token.parentElement!));
      color(token, (light?.hue ?? 315) + index % 4 * 47);
    }
    scheduleInk();
  }
  function clearInk() {
    for (const token of tokens) {
      delete token.dataset.marqueeLit;
      token.style.removeProperty('--marquee-leaf-glow');
    }
  }
  function stopInk() {
    if (inkFrame) cancelAnimationFrame(inkFrame);
    inkFrame = 0;
  }
  function paintInk() {
    inkFrame = 0;
    if (!light || document.hidden || marquee!.dataset.marqueeVisible !== 'true' || reduced.matches || document.documentElement.dataset.reading === 'true') {
      clearInk(); return;
    }
    const viewport = windowElement!.getBoundingClientRect();
    const distance = Math.max(viewport.top - light.y, 0, light.y - viewport.bottom);
    if (distance >= light.radius) { clearInk(); return; }
    for (const [index, token] of tokens.entries()) {
      const rect = token.getBoundingClientRect();
      const visible = rect.width > 0 && rect.right > Math.max(0, viewport.left) && rect.left < Math.min(innerWidth, viewport.right);
      const vertical = Math.max(rect.top - light.y, 0, light.y - rect.bottom);
      const horizontal = Math.max(rect.left - light.x, 0, light.x - rect.right) * .18;
      const p = Math.min(1, Math.hypot(vertical, horizontal) / light.radius);
      const glow = visible ? 1 - p * p * (3 - 2 * p) : 0;
      if (glow > .03) {
        color(token, light.hue + index % 4 * 47);
        token.dataset.marqueeLit = 'true';
        token.style.setProperty('--marquee-leaf-glow', String(glow));
      } else {
        delete token.dataset.marqueeLit;
        token.style.removeProperty('--marquee-leaf-glow');
      }
    }
    // A moving copy can enter the beam without a new scroll event. Paused,
    // offscreen and reading states need no continuous geometry sampling.
    if (track?.getAnimations()[0]?.playState === 'running') scheduleInk();
  }
  function scheduleInk() {
    if (!inkFrame && !document.hidden) inkFrame = requestAnimationFrame(paintInk);
  }
  toggle.addEventListener('click', () => {
    const paused = marquee.dataset.marqueePaused !== 'true';
    marquee.dataset.marqueePaused = String(paused);
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.setAttribute('aria-label',paused ? 'Retomar faixa de Trabalho' : 'Pausar faixa de Trabalho');
    toggle.textContent = paused ? 'Retomar faixa' : 'Pausar faixa';
    scheduleInk();
  });
  const windowElement = marquee.querySelector<HTMLElement>('.work-marquee-window');
  const track = marquee.querySelector<HTMLElement>('.work-marquee-track');
  if (!windowElement || !track) return;
  let rateFrame = 0;
  function rate(value: number) {
    if (rateFrame) cancelAnimationFrame(rateFrame);
    const animation = track?.getAnimations()[0];
    if (!animation) return;
    const from = animation.playbackRate, started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1,(now-started)/180);
      const eased = progress*progress*(3-2*progress);
      animation.updatePlaybackRate(from+(value-from)*eased);
      rateFrame = progress < 1 ? requestAnimationFrame(tick) : 0;
    };
    rateFrame = requestAnimationFrame(tick);
  }
  windowElement?.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch') rate(2.4);
  });
  windowElement?.addEventListener('pointerleave', () => rate(1));
  marquee.addEventListener('focusin', scheduleInk);
  marquee.addEventListener('focusout', scheduleInk);
  document.addEventListener('sl:themechange', refreshColors);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopInk(); clearInk(); }
    else scheduleInk();
  });
  reduced.addEventListener('change', scheduleInk);
  const observer = new IntersectionObserver(entries => {
    marquee.dataset.marqueeVisible = String(entries[0]?.isIntersecting ?? false);
    if (marquee.dataset.marqueeVisible === 'true') scheduleInk();
    else { stopInk(); clearInk(); }
  });
  observer.observe(marquee);
  refreshColors();
  return {
    setLeafLight(value: LeafLight | null) {
      light = value;
      if (light) scheduleInk();
      else { stopInk(); clearInk(); }
    }
  };
}
