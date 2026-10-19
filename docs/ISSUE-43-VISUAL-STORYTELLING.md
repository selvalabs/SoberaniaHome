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
