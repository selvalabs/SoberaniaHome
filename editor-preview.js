(() => {
  'use strict';
  const dialog = document.getElementById('inline-editor-dialog');
  const frame = document.getElementById('inline-editor-frame');
  const button = document.getElementById('enable-editor');
  let ready = false;
  frame.addEventListener('load', () => { ready = true; frame.contentWindow.InlineEditor?.open(); });
  button.addEventListener('click', () => {
    dialog.showModal();
    if (!frame.hasAttribute('src')) frame.src = './demos/editor-editavel.html';
    else if (ready) frame.contentWindow.InlineEditor?.open();
  });
  function returnToSite(event) {
    event?.preventDefault();
    const api = frame.contentWindow.InlineEditor;
    if (api?.diagnostics().dirty && !window.confirm('Há alterações ainda não salvas. Voltar ao site? Elas continuam nesta sessão; use Salvar editável para guardar um arquivo.')) return;
    dialog.close(); button.focus({preventScroll:true});
  }
  dialog.addEventListener('cancel', returnToSite);
  document.getElementById('close-inline-editor').addEventListener('click', returnToSite);
})();
