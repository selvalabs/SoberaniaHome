# Issue 41 — voo da folha e tema escuro

Issue: https://github.com/selvalabs/SoberaniaHome/issues/41

Branch: `feat/41-leaf-orbit-dark-theme`, criada no GitHub a partir da main
`e3f4035015f5a49fd80cc242248b2bff5bdb2092`. A revisão editorial e a ordem
aprovada das 16 dobras são preservadas. O PR #40 (histórico do índice) continua
independente, sem incorporação nesta branch.

## Experiência

- O relógio da queda passa de 2,4 para 1,65 unidades por viewport: progressão
  31,25% mais lenta. A saída da árvore tem um percurso 22% mais longo e não
  acompanha a subida do documento até a borda antes de começar a cair.
- Um impulso já está em andamento na abertura. Novos impulsos são mais
  frequentes nas dobras editoriais e nas duas galerias, mantendo o balanço
  pendular, a torção e a reversibilidade da simulação existente.
- A cena VIDA compartilha uma fase angular entre anel, palavras e folha.
  A folha percorre uma elipse interna, sem atravessar o centro, com captura e
  liberação graduais. Duas voltas no próprio eixo somam-se à órbita. O percurso
  de scroll da cena aumenta para dar tempo à leitura e ao movimento.
- A preferência de movimento reduzido e o modo de leitura continuam soberanos.
  Não há animação contínua em repouso nem captura de cliques sobre interfaces.

## Aparência

O botão de sol/lua na navegação alterna claro e escuro. O índice oferece
Claro, Escuro e Acompanhar o sistema. A escolha é salva em `sl-theme` e
sincronizada entre abas; sem armazenamento, funciona durante a visita.
O script no head aplica a preferência antes da pintura. A página de perguntas
também oferece o controle. Sem JavaScript, controles inativos ficam ocultos.

A paleta escura combina carvão, verdes e marcações quentes. Autonomia,
soberania, caderno, caça-palavras, diálogos e modo de leitura recebem cores
próprias. As imagens e interfaces de demonstração mantêm suas cores originais.
O glow recalcula a tinta ao trocar o tema. A impressão usa a paleta clara.
Em celulares estreitos, o modo de leitura permanece acessível no índice.

## Verificação

A nova suíte `tests/test_theme_orbit.py` cobre teclado, persistência, preferência
do sistema, armazenamento bloqueado, troca sem deslocamento da página, tinta do
glow, contraste de superfícies editoriais selecionadas, queda inicial, relógio
mais lento, quatro quadrantes da órbita, sincronismo, reversibilidade, junções,
repouso e movimento reduzido em 390×844 e 1440×900. Está incluída no CI.

Inspeção visual de hero, projetos, autonomia, soberania, referências, caderno e
espiral; inspeção da navegação de 320 a 1440 px. A auditoria de contraste das
cores sólidas é uma verificação direcionada, não uma certificação completa de
acessibilidade. Validação de navegador feita em Chromium; Safari físico não
foi testado. A física continua sendo um modelo reduzido com direção artística.

Resultados locais em 19/10/2026: `npm run check`, `npm test` (36 testes),
`npm run build`, `check-static.mjs`, `node --check public/scripts/theme.js` e
`git diff --check` passaram. `npm audit --audit-level=low` e `pip-audit`
não encontraram vulnerabilidades conhecidas. As oito suítes de navegador
passaram: motion edition, leaf flow, theme orbit, horizontal viewports,
project galleries, site edition, landing touch e atelier edge UI. A suíte nova
também passou pela URL Wi-Fi. As duas inicializações que expiraram ao executar
suítes simultâneas no servidor local foram verificadas novamente em execução
sequencial, com sucesso; nenhuma asserção foi relaxada para isso.

## Entrega e reversão

Preview local de homologação: http://192.168.1.4:4196/

Build canônica: `.edition-builds/leaf-theme-41-04`. O servidor da porta 4196 usa
`.edition-builds/leaf-theme-41-01`, atualizada com os mesmos arquivos finais;
arquivos antigos sem referência são mantidos. Main permanece na porta 4190 e
a correção independente #39 na 4193.

Sem merge, tag de release, publicação em produção, migração ou mudança de VPS.
Espelho VPS não foi acessado. Rollback de referência: main `e3f4035`; basta usar
seu preview ou, após eventual integração, reverter o PR por novo PR revisado.
