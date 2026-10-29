/** A local draft only: no request, URL parameters or browser storage. */
function initContactBrief() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-brief]');
  if (!form || form.dataset.contactReady === 'true') return;
  const name = form.querySelector<HTMLInputElement>('#contact-brief-name');
  const reply = form.querySelector<HTMLInputElement>('#contact-brief-reply');
  const project = form.querySelector<HTMLTextAreaElement>('#contact-brief-project');
  const copy = form.querySelector<HTMLButtonElement>('[data-contact-brief-copy]');
  const status = form.querySelector<HTMLElement>('[data-contact-brief-status]');
  if (!name || !reply || !project || !copy || !status) return;

  project.addEventListener('input', () => project.setCustomValidity(''));
  form.addEventListener('input', () => { status.textContent = ''; });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    project.setCustomValidity(project.value.trim() ? '' : 'Conte o que você quer construir ou melhorar.');
    if (!form.reportValidity()) return;
    const message = [
      'Uma conversa com a Soberania Labs',
      name.value.trim() && `Nome: ${name.value.trim()}`,
      reply.value.trim() && `Contato: ${reply.value.trim()}`,
      `Projeto ou necessidade:\n${project.value.trim()}`,
    ].filter(Boolean).join('\n\n');

    copy.disabled = true;
    status.textContent = 'Preparando sua mensagem…';
    try {
      if (!window.isSecureContext || !navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(message);
      status.textContent = 'Mensagem copiada. Nada foi enviado.';
    } catch {
      // HTTP previews on Wi-Fi do not normally have Clipboard API access.
      try {
        const url = URL.createObjectURL(new Blob([message], { type: 'text/plain;charset=utf-8' }));
        const download = document.createElement('a');
        download.href = url;
        download.download = 'mensagem-soberania-labs.txt';
        download.hidden = true;
        document.body.append(download);
        download.click();
        download.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        status.textContent = 'A cópia não está disponível neste navegador. Iniciamos o download da mensagem em .txt. Nada foi enviado.';
      } catch {
        status.textContent = 'Não foi possível copiar ou baixar. Seu texto continua nos campos para copiar manualmente. Nada foi enviado.';
      }
    } finally {
      copy.disabled = false;
    }
  });

  // The submit button remains disabled and hidden without JavaScript.
  // Field controls intentionally have no name attributes and never submit data.
  form.dataset.contactReady = 'true';
  copy.hidden = false;
  copy.disabled = false;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initContactBrief, { once: true });
else initContactBrief();
