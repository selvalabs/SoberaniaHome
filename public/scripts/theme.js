/* Runs in the head, before first paint. Storage is optional. */
(() => {
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try {
    const saved = localStorage.getItem('sl-theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch { /* Private browsing must still allow an in-session choice. */ }
  function apply() {
    const theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#181e1c' : '#eeeae1');
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('title', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    });
    document.querySelectorAll('[data-theme-preference]').forEach(select => { select.value = preference; });
    document.dispatchEvent(new CustomEvent('sl:themechange', { detail: { theme, preference } }));
  }
  function choose(value) {
    if (!['light', 'dark', 'system'].includes(value)) return;
    preference = value;
    try { localStorage.setItem('sl-theme', value); } catch { /* Keep the choice for this visit. */ }
    apply();
  }
  apply();
  document.addEventListener('DOMContentLoaded', apply, { once: true });
  document.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('[data-theme-toggle]')) choose(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  document.addEventListener('change', event => {
    if (event.target instanceof HTMLSelectElement && event.target.matches('[data-theme-preference]')) choose(event.target.value);
  });
  system.addEventListener('change', () => { if (preference === 'system') apply(); });
  addEventListener('storage', event => {
    if (event.key === 'sl-theme' || event.key === null) {
      preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : 'system';
      apply();
    }
  });
})();
