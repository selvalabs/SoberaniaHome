/** CSS owns the loop; JS only supplies pause and visibility state. */
export function initWorkMarquee() {
  const marquee = document.querySelector<HTMLElement>('[data-work-marquee]');
  const toggle = marquee?.querySelector<HTMLButtonElement>('.work-marquee-toggle');
  if (!marquee || !toggle || marquee.dataset.marqueeReady) return;
  marquee.dataset.marqueeReady = 'true';
  marquee.dataset.marqueePaused = 'false';
  toggle.addEventListener('click', () => {
    const paused = marquee.dataset.marqueePaused !== 'true';
    marquee.dataset.marqueePaused = String(paused);
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.setAttribute('aria-label',paused ? 'Retomar faixa de Trabalho' : 'Pausar faixa de Trabalho');
    toggle.textContent = paused ? 'Retomar faixa' : 'Pausar faixa';
  });
  const windowElement = marquee.querySelector<HTMLElement>('.work-marquee-window');
  const track = marquee.querySelector<HTMLElement>('.work-marquee-track');
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
  const observer = new IntersectionObserver(entries => {
    marquee.dataset.marqueeVisible = String(entries[0]?.isIntersecting ?? false);
  });
  observer.observe(marquee);
}
