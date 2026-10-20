# Issue 43 — narrativa visual e cultura tecnológica brasileira

Issue: https://github.com/selvalabs/SoberaniaHome/issues/43
Branch: `feat/43-visual-storytelling`.
Base: `77cbc76c632c95281d7cc2cc2e65af4f5362c061` (main após PR 42).

## Composição entregue

- Trabalho: papéis repetidos atravessam uma ferramenta e se redistribuem por cuidado, criação e vida. A conclusão questiona a distribuição dos ganhos. Diagrama conceitual, sem métricas inventadas.
- Entrega: a interface se abre em código, dados, chaves e memória; uma bancada sustentada por mãos aparece sob as partes. Imagem original gerada, não fotografia de clientes.
- Soberania: o sistema e seus dados atravessam um caminho entre duas infraestruturas, passando por uma conferência. O inventário anterior permanece expansível.
- Inteligências: a colagem de campo, mãos e código converge com o scroll. A síntese fica visível, e o argumento completo permanece expansível.
- Processo: cada peça revela o resultado da etapa, com um traço de evidência que acompanha a montagem. O método completo está no detalhe de cada etapa.
- Conexões: a órbita preserva VIDA e a folha, com um fio que liga o conceito em foco ao centro. Os textos de relação são curtos, com explicação expansível.
- Hero, produtos, Sobre, Manifesto e Caderno: sínteses e leitura opcional; todos os nove cards, mockups e oito landing pages preservados. As condições técnicas e de disponibilidade não foram convertidas em promessas.

## Movimento e legibilidade

As três cenas novas acompanham o scroll nativo sem criar áreas presas. Controles de etapas permitem examinar a cena por mouse, toque e teclado. Um novo gesto de scroll retoma a narrativa. A progressão é determinística e reversível; não há ticker contínuo. Movimento reduzido e modo de leitura mostram as explicações juntas e mantêm seleção instantânea. Sem JavaScript, os diagramas e as três legendas permanecem disponíveis, assim como os detalhes HTML nativos.

A proposta aproveita a organização de estados e a progressão vinculada ao scroll pesquisadas em GSAP, sem instalar outro motor ou disputar o controle da rolagem existente. Animações em SVG/DOM, com imagem apenas onde há benefício de matéria visual. Texto de interface permanece selecionável/semântico.

## Referências consultadas

- https://gsap.com/docs/v3/Plugins/ScrollTrigger/ — progressão por scroll.
- https://gsap.com/docs/v3/Plugins/Flip/ — transformação entre estados/layouts.
- https://gsap.com/showcase/ — repertório de movimento.
- https://www.awwwards.com/sites/ocean-lovers-guide-to-compost — referência curatorial ambiental e ilustrativa.
- https://www.awwwards.com/inspiration/interactive-overlays-terranest — camadas e parallax.
- https://www.lua.org/about.html — linguagem criada na PUC-Rio; autores identificados na fonte.
- https://rnp.br/sobre-nos/nossa-historia/ — infraestrutura brasileira de educação/pesquisa.
- https://www.scielo.org/pt-br/sobre-o-scielo/programa-scielo-modelo-scielo-de-publicacao-e-rede-scielo/ — rede de comunicação científica em acesso aberto.
- https://alvarovieirapinto.org/o-conceito-de-tecnologia/ — obra de Álvaro Vieira Pinto; a referência não é uma citação literal.
- https://gilbertogil.com.br/textos/diversidade/ — texto autoral sobre cultura digital e comunidades.
- Paulo Freire: referência e fonte do MEC já presentes na página, preservadas.

Os exemplos nacionais são referências de leitura/contexto, não parceiros nem dependências declaradas do produto. Novos resumos são editoriais, sem aspas atribuídas aos autores. A paráfrase de Lenin e sua identificação permanecem acessíveis.

## Asset original

`public/assets/edition/cooperative-bench-43.webp`, 1536×1024, ~400 KiB, RGBA.
Gerado pela ferramenta integrada de imagens; PNG original preservado em `.codex/generated_images`. Apenas conversão para WebP com alpha preservado, sem alteração de conteúdo. Não há terceiros identificáveis.

Prompt final: Create one original high resolution transparent PNG editorial cutout illustration for a Brazilian social technology laboratory website. Wide composition, approximately 3:2. Four anatomically plausible adult working hands of different brown skin tones reach gently from left and right, collectively supporting a single long weathered wooden workbench plank. On the plank: one modest small open laptop with a BLANK muted screen, a handwritten notebook with only abstract strokes (no readable text), a small rooted native-looking leafy seedling with visible fine roots below the plank, a simple small metal key and two stacked cards. Clear separated silhouettes, generous transparent negative space around and above. Hybrid Brazilian popular woodcut printmaking and botanical scientific engraving, intricate hatching, tactile ink, imperfect carved contours, sophisticated restrained editorial collage. Palette dark forest-green ink, warm ochre, muted terracotta, subtle cream highlights, desaturated skin tones. No lettering, no slogans, no logos, no flags, no corporate glossy 3D, no neon, no background rectangle, no shadows outside cutout. Hands and objects form a grounded image of shared ownership, care, knowledge and work; dignified contemporary working people, no stereotype. Keep laptop and plant distinct, not magically fused. Transparent background must be real alpha. This is a reusable foreground asset for a layered animated educational scene, not a finished webpage.

## Homologação e reversão

Preview local no Wi-Fi: http://192.168.1.4:4197/.
Sem merge, release/tag, publicação em produção, migração ou acesso/sincronização do espelho VPS. Main preservada em `77cbc76`; essa é a base de rollback. Após eventual integração, reversão por PR revisado. Sem remoção de arquivos ou encerramento dos servidores anteriores.

## Limites

Diagramas explicativos são modelos editoriais, não simulações físicas/cálculos de produtividade ou execuções reais de migração. As referências do Awwwards foram consultadas como documentação curatorial; a implementação é autoral. Testes de navegador automatizados não substituem homologação em Safari/iOS físico. Os detalhes continuam disponíveis, mas seu recolhimento inicial é uma mudança de hierarquia editorial a homologar.

## Medição de leitura inicial

Comparação com a base `77cbc76`, mesma página e mesmos viewports, detalhes recolhidos. Contagem de palavras nos nós de texto das seções, excluindo scripts, elementos explicitamente ocultos e conteúdo de `details` fechados; inclui rótulos dos diagramas. É uma medida de leitura inicial, não de remoção de conteúdo ou de tempo de leitura. Não soma apenas o texto dentro do recorte visível da tela.

| Dobra | Antes (390 px) | Depois (390 px) |
| --- | ---: | ---: |
| Hero | 110 | 59 |
| Trabalho e ganho | 120 | 69 |
| Inteligências | 71 | 57 |
| Processo | 147 | 58 |
| Entrega | 135 | 81 |
| Soberania | 100 | 78 |
| Conexões | 74 | 56 |
| Sobre | 138 | 102 |
| Manifesto | 131 | 79 |
| Caderno | 304 | 188 |
| **Total destas dez dobras** | **1330** | **827** |

Redução de **37,8%** no viewport de 390×844 e **37,1%** em 1440×900 (1365 → 859). Galerias não entram nesse total porque o texto exposto varia com o card ativo; seus nove textos completos permanecem disponíveis em “Como funciona”. Os conteúdos de IA prática, contato, referências e todos os mockups foram preservados.

## Ajustes nos testes existentes

- A abertura editorial continua verificada integralmente, agora após abrir o detalhe da hero.
- A verificação de contraste abre os detalhes que contêm os trechos avaliados; nenhum desses trechos foi excluído da cobertura.
- O teste de viewports distingue cards com overflow dos cards que passaram a caber inteiros. Em ambos verifica alcance do rodapé e devolução da rolagem à galeria.
- A nova suíte verifica etapas por teclado, reversibilidade, retomada por roda do mouse, carregamento do asset, referências nacionais, movimento reduzido e fallback sem JavaScript.

Correção de estabilidade descoberta na validação: a inicialização das legendas acontecia apenas no primeiro frame ativo, podendo alterar a altura de uma dobra anterior durante uma navegação da galeria. As cenas agora estabelecem sua geometria sincronamente ao iniciar, inclusive em abas inicialmente ocultas, e usam uma área compartilhada que reserva a altura da maior legenda. A seleção de fases deixa de deslocar as dobras seguintes.

## Validação local — 19/10/2026

- `npm run check`: passou.
- `npm test`: 38/38 passaram (incluindo Worker/privacidade, política de publicação, cor e física da folha).
- `npm run build`: passou; saída final `.edition-builds/visual-storytelling-43-05`, copiada somente após conclusão para o diretório do servidor local.
- `node scripts/check-static.mjs .edition-builds/visual-storytelling-43-05`: passou (metadados, dados estruturados, endpoints, links locais e imagens).
- `npm audit --audit-level=low` e `python -m pip_audit -r requirements-pages.txt`: nenhuma vulnerabilidade conhecida reportada.
- `git diff --check`: passou.

As suítes Chromium cobrem navegação, folha/retorno/glow, temas/órbita/contraste, controles das três novas cenas, horizontal em viewports de 240×320 a 1440×900, orientação, todos os cards e suas telas, previews internos, sem JS, movimento reduzido, referências e IA prática. A IA de borda é simulada nos testes, sem chamada de modelo externo ou implantação de Worker.

Resultado: **11/11 suítes Chromium passaram**: `test_motion_edition`, `test_leaf_flow`, `test_leaf_return`, `test_theme_orbit`, `test_leaf_contrast`, `test_visual_stories`, `test_horizontal_viewports`, `test_project_galleries`, `test_site_edition`, `test_landing_touch` e `test_atelier_edge_ui`. Depois da correção de altura, as suítes de cenas novas, galerias, edição, toque e IA foram executadas novamente; a validação de tipos e a saída estática também passaram. As cenas novas foram verificadas novamente com a asserção de altura constante entre fases. Screenshots finais inspecionados em 320/390 px e 1440 px, nos temas claro/escuro. HTTP 200 confirmado pelo endereço Wi-Fi e listener em `0.0.0.0:4197`.

## Revisão após avaliação visual — assets e texto (19/10/2026)

O usuário considerou os desenhos lineares esquemáticos demais e a redução de texto excessiva. Esta revisão substitui as ilustrações principais das três cenas por seis recortes gerados: oficina/ferramenta, trabalho comunitário, computador, arquivo portátil, chaves e casa comunitária. A bancada e o caderno já gerados são reaproveitados. SVG permanece somente como suporte de posicionamento, texto e conexões; os objetos ilustrados agora são imagens com textura e transparência.

Os seis PNGs originais permanecem em `.codex/generated_images/01a10256-6b0e-7c91-80b7-b98d8ea40e26/`. As versões servidas estão em `public/assets/edition/story-*-43-v2.webp`, até 1024 px, alpha preservado, total aproximado de 1,72 MiB. Ferramenta integrada de geração de imagens. Prompts completos e caminhos individuais: `docs/ISSUE-43-ASSET-PROMPTS.json`.

O texto principal volta a explicar o argumento da hero, a distribuição dos ganhos de produtividade, o encontro entre conhecimentos, a entrega e a portabilidade. Sobre fica aberto; Manifesto recupera contexto e o primeiro princípio aberto. Cada um dos nove projetos ganha uma descrição visível antes dos detalhes técnicos. Portanto, as métricas de redução registradas acima descrevem a primeira proposta (`60172b8`), não esta revisão: o objetivo revisado é equilibrar explicação e movimento, sem perseguir redução máxima de palavras.

A revisão continua na issue #43 e no PR #44, sem novo merge. Base preservada `77cbc76`; versão anterior da proposta `60172b8` também disponível para comparação/reversão. Mesmo preview Wi-Fi na porta 4197, sem alteração de produção/VPS.

Medição comparável desta revisão: as dez dobras editoriais passam de 827 para 1048 palavras na leitura inicial em 390 px, além das descrições visíveis dos projetos. A redução em relação à main passa a aproximadamente 21%, em vez dos 38% da proposta anterior. A contagem é apenas registro de hierarquia; não é meta editorial.

Build desta revisão: `.edition-builds/visual-storytelling-43-07`. Tipos, 38 testes Node, build, saída estática e auditorias npm/Python passaram. Nenhuma vulnerabilidade conhecida reportada. Cenas geradas, todas as galerias, conteúdo e contraste foram revalidados em navegador; sem JavaScript e movimento reduzido continuam disponíveis. A suíte de cenas agora verifica também o carregamento de cada imagem usada pelo SVG. O ajuste final de espaçamento das peças foi revalidado visualmente em 390 px e pela suíte de cenas.

Rolagem horizontal: passou em dez viewports (240×320 a 1440×900), três formatos de toque e mudanças de orientação. As cinco suítes reexecutadas nesta revisão passaram: cenas, galerias, edição, contraste e viewports horizontais. CI completo da implementação anterior (`60172b8`) estava verde; um novo ciclo será disparado pelo push desta revisão. Sem publicação de release ou acesso à VPS.


## Segunda revisão visual — cenas que demonstram uma transformação (19/10/2026)

Continuação da issue #43 e do PR #44, a partir de `44a3eb5`. A avaliação do usuário foi que a ideia estava interessante, mas os assets e os movimentos não a representavam bem. Na inspeção em 390 e 1440 px, a entrega sobrepunha duas representações do computador; a portabilidade reduzia casas e textos a miniaturas; mover objetos isolados não explicava o processo.

### Composição e comportamento

- **Trabalho e tempo:** registros de pedidos, cadastros e avisos convergem para uma rotina compartilhada. Uma faixa do dia abre espaço para outro uso do tempo. O leitor escolhe entre repartir o tempo e somente aumentar a meta; a faixa, o estado do controle e a consequência textual mudam juntos. Não há escala numérica ou promessa de produtividade. A decisão sobre a distribuição continua explícita.
- **Entrega:** uma interface se abre em quatro documentos legíveis: código, dados, acessos e documentação. Os mesmos documentos passam a formar o conjunto sustentado pelas mãos da equipe. A composição evita duplicar computador e bancada. O inventário completo permanece acessível logo abaixo.
- **Portabilidade:** origem e destino são representados por equipamentos atuais. Um único pacote identificado como memória do trabalho segue o percurso, pausa na conferência e só chega ao destino depois dela. É possível simular falha: o pacote permanece na conferência, o destino não assume e a origem continua preservada. Uma nova conferência permite concluir a demonstração.
- Os três atos podem ser percorridos com botões, teclado e scroll. Quando o quadro inteiro cabe no viewport, há um trecho curto de fixação para acompanhar a transformação. Em telas baixas, a composição segue o fluxo normal e os controles continuam disponíveis.
- As transições interpolam até o estado solicitado e param; não há relógio permanente ou captura da roda do mouse. Rolar novamente devolve o controle à progressão da página. Leitura e movimento reduzido expõem os três argumentos, com a composição estática; sem JavaScript, permanecem composição e legendas completas.
- Uma coluna editorial associa título, explicação e consequência à cena. No celular, ela vem abaixo da imagem. A altura das legendas é reservada para não deslocar as dobras seguintes ao mudar de ato. A regra antiga de flex nos textos ocultos foi retirada porque contrariava essa reserva de altura na nova composição.

### Imagens e referências

Três imagens novas, geradas pela ferramenta integrada `image_gen`: trabalho cooperativo contemporâneo, mãos sustentando uma bancada vazia e um pequeno servidor com equipamento de rede. Os textos e documentos são HTML; as imagens fornecem pessoas, materiais e infraestrutura. PNGs originais preservados no diretório de geração, WebPs de 1536×1024 com alpha no projeto; os três somam 615.598 bytes (~601 KiB). Prompts finais, origem e conversão em `docs/ISSUE-43-ASSETS-V3.json`. As pessoas são ilustrativas e geradas, não retratos de clientes ou membros reais.

Referências consultadas para progressão por estados e narrativa ambiental: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) e [Ocean Lovers Guide to Compost / Awwwards](https://www.awwwards.com/sites/ocean-lovers-guide-to-compost). A implementação continua nativa, coordenada com a rolagem existente. Não há nova dependência, reprodução de site de referência ou renderização em vídeo que impeça a leitura sem animação.

### Limites e recuperação

Prévia na porta 4197, reaproveitando o listener existente. A branch das etiquetas (#45 / porta 4198) permanece independente; esta revisão não integra seus commits. A main remota foi conferida por fetch e continua em `77cbc76`. Base da revisão recuperável: `44a3eb5`. Sem merge, release/tag, publicação em produção, migração ou acesso à VPS. As cenas são demonstrações editoriais, não fluxos produtivos em execução; Safari/iOS físico ainda precisa de homologação.


### Validação desta revisão

- Tipos (`npm run check`), 38 testes Node, build, `check-static.mjs` e `git diff --check`: passaram. Auditorias npm e Python: nenhuma vulnerabilidade conhecida reportada.
- Onze suítes Chromium passaram: `test_visual_stories`, `test_leaf_flow`, `test_leaf_return`, `test_theme_orbit`, `test_motion_edition`, `test_horizontal_viewports`, `test_project_galleries`, `test_site_edition`, `test_leaf_contrast`, `test_landing_touch` e `test_atelier_edge_ui`.
- A suíte das cenas valida seleção por teclado, reversibilidade, altura estável, retomada por roda do mouse, fixação real do quadro durante scroll, escolhas com resultados diferentes, falha e recuperação da conferência, carregamento dos recortes, ausência de overflow, repouso após assentamento, movimento reduzido e ausência de JavaScript. A conferência com falha reserva a altura da mensagem para não deslocar a página ao alternar estados.
- Nos primeiros lotes paralelos, o servidor Python existente na porta 4197 recusou conexões de módulos e imagens (`net::ERR_CONNECTION_REFUSED`). Os casos afetados foram diagnosticados com registro de requests e repetidos em um servidor local de teste com fila de 128 conexões. Esse servidor teve o ciclo de vida limitado à suíte; o listener da prévia Wi-Fi não foi encerrado.
- Screenshots de referência e revisão em `.playwright/review43/` (fora do Git), com inspeção em 320, 390 e 1440 px. As capturas isoladas das cenas ocultam temporariamente navbar/folha apenas durante a captura; os testes de interação mantêm esses elementos ativos. A última composição mobile posiciona a rotina abaixo dos rostos, preservando a leitura das pessoas na imagem.
- O último ajuste de composição foi revalidado com a suíte das cenas, tipos, build e validação estática. Não se repetiram indiscriminadamente as suítes de recursos que não receberam novas alterações.
