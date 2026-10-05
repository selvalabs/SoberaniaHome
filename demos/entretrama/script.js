(() => {
  const dialog = document.querySelector('#trilha-dialog');
  const opener = document.querySelector('#open-trilha');
  opener.addEventListener('click', () => dialog.showModal());
  document.querySelector('#close-trilha').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); }});
  dialog.addEventListener('close', () => opener.focus({preventScroll:true}));
  document.querySelector('#download-trilha').addEventListener('click', () => {
    const text = 'ENTRETRAMA — PRIMEIRA PRÁTICA\nEstudo demonstrativo da Soberania Labs. Escola fictícia.\n\nUma pequena amostra\n1. Conheça as partes do tear e organize os materiais.\n2. Prepare uma pequena faixa de urdume.\n3. Experimente a trama simples, sem apertar as bordas.\n4. Observe a amostra e anote o que você mudaria.\n\nRoteiro ilustrativo da proposta pedagógica; não substitui uma aula técnica.\n';
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a'); a.href=url; a.download='entretrama-primeira-pratica.txt'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    document.querySelector('#download-status').textContent='Roteiro preparado para download.';
  });
})();
