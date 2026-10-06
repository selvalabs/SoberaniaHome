# Dobra do processo: tabuleiro e coluna lateral

Issue #28, branch `feat/28-process-board-sidebar`, base local `45ebfbbba3dd99fa64d62e6b5047901535568ef7`.

A montagem fica centralizada à esquerda, com as seis explicações em uma coluna vertical à direita, reveladas conforme as peças avançam. Em telas pequenas, a composição mantém o tabuleiro central e mostra o resumo da etapa ativa no cartão abaixo. A barra de navegação recolhe após rolagem para baixo e retorna após uma rolagem curta para cima. O título da sequência complementa o eyebrow sem repeti-lo.

Validado visualmente na prévia local em desktop e mobile; a coluna mostra as seis etapas quando a montagem termina. `git diff --check` e `node --check motion.js` passam. Reversão: remover o bloco `process-board-and-notes-28`, restaurar o centro horizontal original e a lógica/classe de visibilidade da barra.
