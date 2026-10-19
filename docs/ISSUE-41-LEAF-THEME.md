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

Build canônica: `.edition-builds/leaf-theme-41-07`. O servidor da porta 4196 usa
`.edition-builds/leaf-theme-41-01`, atualizada com os mesmos arquivos finais;
arquivos antigos sem referência são mantidos. Main permanece na porta 4190 e
a correção independente #39 na 4193.

Sem merge, tag de release, publicação em produção, migração ou mudança de VPS.
Espelho VPS não foi acessado. Rollback de referência: main `e3f4035`; basta usar
seu preview ou, após eventual integração, reverter o PR por novo PR revisado.

## Ajuste de contraste após homologação visual

A revisão encontrou uma regra com `#folha` que prevalecia sobre o tema e
mantinha o papel claro sob a tinta clara, além do fechamento de Inteligências
e das anotações das colagens. Esses fundos e tintas foram corrigidos.

O glow agora mede a superfície composta sob cada trecho real de texto,
incluindo fundos translúcidos e elementos aninhados. Guarda a tinta própria de
cada trecho e escolhe a cor do glow com contraste mínimo de 4,8:1, preservando
a polaridade original quando possível. O halo foi reduzido para não lavar as
letras. A interface demonstrativa da cooperativa não recebe a tinta editorial.

A regressão inclui 120 matizes em sete pares de fundo/tinta e amostras internas
dos gradientes (mínimo 4,5:1), além de testes no DOM real dos dois temas,
celular/desktop, com passagem da folha, troca de tema e modo de leitura.
A auditoria anterior não incluía todos os spans gerados pelo glow; a nova suíte
`test_leaf_contrast.py` inclui esses textos e os destaques identificados.


## Retorno da folha após arrasto

A soltura agora inicia um retorno de 5,6 segundos ao destino atualizado pelo
scroll, com transição suave de posição, orientação, escala e pivô. O balanço
lateral e a torção vêm do mesmo oscilador da queda. O ponto onde o mouse pega
na folha é preservado; pegar novamente durante o retorno parte da pose visível.
Cancelamento/perda de captura também soltam a folha; leitura/movimento reduzido
cancelam a interação. Pausa e aba oculta suspendem os frames, e o loop termina
ao reencontrar a trajetória determinística.

Validação adicional: 38 testes Node, tipos, build e verificação estática;
`test_leaf_return.py` usa mouse real para soltura sem salto, retorno lento,
torção, novo arrasto, scroll durante retorno, pausa, movimento reduzido e repouso
sem RAF permanente. Suíte incluída no CI. Base desta iteração: `462967e`.
