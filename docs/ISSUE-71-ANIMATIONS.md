# Issue 71 — Caderno de movimento

Issue: https://github.com/selvalabs/SoberaniaHome/issues/71

## Entrega e limites

`/ensaios/animacoes/` é um caderno de homologação, separado da narrativa da landing page. Contém o roteiro aprovado de cinco momentos sobre tempo e trabalho, dois estudos sobre saberes e autonomia, e um storyboard navegável para cada cena. As duas polaridades usam o seletor de tema existente. A rota declara `noindex,follow`, não tem canonical e não integra o sitemap.

O texto da referência histórica e sua fonte permanecem acessíveis. O primeiro roteiro distingue a leitura do exemplo de Lenin (momentos 1–3) da proposta da Soberania Labs (momentos 4–5). O quarto de tempo é uma ilustração do exemplo citado, não um dado atual ou uma promessa comercial.

A landing mantém seus conteúdos e cenas. A única mudança no desenho anterior é a extração do mecanismo de traços, com os mesmos tempos e resultado visual.

## Contrato e módulos

- `src/data/ink-scenes.ts`: identidade, versão, semente, mensagem, etapas e intervalos contíguos de cada cena.
- `src/scripts/ink-model.ts`: funções puras para fases, sementes, impulsos, partículas e enquadramento. Nenhuma depende de tempo real, número de frames ou estado acumulado.
- `src/scripts/ink-drawing.ts`: medição única de cada traço e distribuição do avanço por seu comprimento. Subpaths são separados nos comandos `M`, permitindo que o lápis levante entre traços. Compartilhado com `work-pencil.ts`.
- `src/components/InkSceneDrawing.astro`: ilustrações autorais com hachura, granulação reproduzível, mãos, ferramentas, papel e mecanismos. SVGs sem dependências, imagens externas ou fontes remotas. `InkStrokes.astro` emite os traços normalizados.
- `src/scripts/ink-notebook.ts`: um renderizador sob demanda, alimentado pela posição nativa do documento. A landing não inicializa seu motor nesta rota (`interactive=false`), portanto não há dois motores competindo.
- `src/styles/ink-notebook.css`: composição, polaridades, storyboard, controles e comportamento em fluxo normal.

Uma cena é amostrada por `sampleInkScene(definition, progress)`. Para as mesmas entradas, devolve o mesmo estado, independentemente de ter chegado pelo avanço, retorno ou salto direto. Geometria, controles e lápis acompanham esse estado.

## Matéria e movimento

O modelo usa uma resposta analítica de mola amortecida. O impulso tem aceleração gradual, ultrapassagem e acomodação; é amostrado em segundos narrativos derivados do scroll. A alavanca gira em torno do pivô e a mão acompanha o mesmo movimento. Pistão e roda têm movimento coerente com o mecanismo desenhado.

As cordas usam ondas transversais amortecidas nos pontos de controle de curvas cúbicas; suas extremidades permanecem fixas. A deformação começa depois da conclusão do traço, preservando a correspondência entre ponta e tinta. As pequenas partículas descrevem trajetórias curvas com dispersão por semente. São transferências únicas, sem reinício aleatório a cada frame.

O enquadramento em retrato acompanha a etapa com transições contínuas. Isso mantém mão, relógio, moedas e alavanca visíveis em escala útil, em vez de encolher todo o quadro. Desktop e storyboard conservam a composição geral.

São modelos dirigidos artisticamente, não simulações científicas calibradas. Sua função é explicar esforço, conexão e transferência com movimentos convincentes.

## Navegação e alternativas

- Scroll vertical nativo; nenhum `preventDefault` de wheel/touch ou suavizador adicional.
- Botões de etapa e controle de progresso levam à posição correspondente do documento. O slider também funciona pelo teclado.
- O viewport usa a área pequena (`svh`), descontando a barra superior e respeitando a área segura inferior. Resize conserva o progresso da cena ativa.
- Abaixo de 580 px de altura, no modo de leitura ou com movimento reduzido, as cenas entram no fluxo normal, com todos os textos e o desenho completo.
- Sem JavaScript, a mesma leitura está disponível. Os controles inativos não são exibidos.
- Storyboards são preparados apenas quando abertos; ficam estáticos depois de desenhados.
- Renderização para em repouso e com a página oculta. As cenas fora de vista mantêm os estados 0/1 sem redesenho. O modelo não altera nenhum relógio ou parâmetro da folha.

## Criar uma nova cena

1. Definir a ideia em uma frase e os objetos capazes de explicá-la.
2. Adicionar uma definição com semente estável e intervalos contíguos que cubram 0–1. Manter uma pausa após desenhar cada etapa.
3. Organizar a ilustração em grupos `data-ink-phase`, com caminhos `data-pencil` e `pathLength=1`. Colocar anotações no respectivo `data-ink-label`.
4. Definir movimentos no modelo puro e aplicá-los aos grupos `data-matter`, preservando os pontos de contato.
5. Se houver enquadramento em retrato, acrescentar seus pontos a `inkCamera` e verificar a continuidade entre etapas.
6. Conferir storyboard, avanço, retorno, salto, temas e alternativas estáticas antes de integrar à landing.

O código atual é um padrão pequeno apoiado nos três ensaios, sem tentar antecipar toda possível família de animações. Um novo tipo físico pode acrescentar sua própria função de amostragem, mantendo o contrato de progresso e semente.

## Validação

`npm run check`, `npm test`, `npm run build` e `node scripts/check-static.mjs .edition-builds/latest`.

`tests/ink-model.test.mjs` verifica sequência, determinismo, retorno, frequências de amostragem, continuidade, acomodação, partículas e enquadramento. `tests/test_ink_notebook.py` verifica o navegador em sete viewports, incluindo temas, reversão, botões, teclado, ponta do lápis, pin, repouso, storyboard e alternativas. A suíte está registrada no runner existente.

Executar pelo artefato construído:

```powershell
python scripts/run-browser-tests.py --directory .edition-builds/latest --tests test_ink_notebook.py test_choices_print.py test_knowledge_print.py test_leaf_reveal_origin.py test_horizontal_viewports.py
```

## Base, dependências e reversão

Branch `feat/71-animations-system`, criada no GitHub a partir da main `057cf68630c899401cad6284833eb53b67b86a82`. Antes de implementar, foram incorporados por fast-forward os ajustes já aprovados até `4022d6ed286bcee03a35b0a0606617d3924642c3` (PRs 66, 68 e 70), preservando os commits e sem alterar a main.

O PR da issue 71 documenta essa dependência. Se esses PRs ainda não estiverem integrados, o diff contra main também os incluirá. A reversão apenas desta unidade pode ser feita revertendo seus commits sobre a base de dependência `4022d6e`; não é necessário desfazer a física da folha ou os reveals. Nenhuma release, VPS, banco ou migração participa desta entrega.
