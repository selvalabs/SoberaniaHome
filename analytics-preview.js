/* Open the Analytics login gallery only when explicitly requested. */
(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('projeto') !== 'analytics' || params.get('vista') !== 'login') return;
  const open = () => {
    const deadline = performance.now() + 10000;
    function ready() {
      const figure = document.querySelector('[data-work-gallery="analytics"]');
      const button = [...(figure?.querySelectorAll('.work-page-selector button') || [])].find(item => item.textContent === 'Login');
      if (!button || !window.__SL_DEBUG?.ready) {
        if (performance.now() < deadline) requestAnimationFrame(ready);
        return;
      }
      if (document.documentElement.classList.contains('motion')) window.SLMotion.jumpScene('trabalho', 0);
      else figure.closest('article').scrollIntoView({block:'center',behavior:'instant'});
      requestAnimationFrame(() => requestAnimationFrame(() => button.click()));
    }
    ready();
  };
  if (document.readyState === 'complete') open();
  else window.addEventListener('load', open, {once:true});
})();
