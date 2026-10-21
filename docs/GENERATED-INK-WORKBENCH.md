# Estudo 01 — Arte gerada e contorno extraído

Issue [71](https://github.com/selvalabs/SoberaniaHome/issues/71) · branch `feat/71-animations-system` · PR [72](https://github.com/selvalabs/SoberaniaHome/pull/72).

## O que avaliar

`/ensaios/arte-gerada/` apresenta o primeiro estudo com ilustração gerada. Há uma chamada no início do caderno `/ensaios/animacoes/`; as três cenas anteriores permanecem disponíveis para comparação. O estudo nasceu isolado da landing. A integração posterior da issue #73 compartilha seu painter, sem reutilizar o controlador de scroll do ensaio; ver [GENERATED-INK-LANDING.md](GENERATED-INK-LANDING.md). A rota de estudo é `noindex,follow`, sem canonical e fora do sitemap.

O roteiro começa na bancada e na morsa, passa pela ferramenta e pela peça, e chega às mãos. A mensagem é: **a ferramenta amplia; a experiência conduz**. Scroll e slider percorrem o mesmo estado; voltar desfaz o desenho. Reproduzir percorre a cena em 52 segundos, a partir do ponto atual. Wheel, gesto de navegação, pausa ou mudança de aba interrompem a reprodução.

Os contornos acompanham o lápis e o desenho cresce por vizinhança: uma região ganha corpo antes de o instrumento mudar de lugar. A hachura fina que não entra nos percursos selecionados completa a arte antes do trecho final. A luz acompanha a tinta recém-revelada e depois acentua o gesto da mão, a chave e o apoio sobre a peça. Não há alegação de recuperar a ordem original de desenho da IA. Também não há animação independente de mão, chave ou morsa neste piloto: isso requer geração/separação de camadas e direção dos pontos de contato.

## Arte original e procedência

- Asset: `public/assets/ink/workbench-generated-v1.png`.
- Dimensões: 1536 × 1024; PNG original de 1.73 MB, preservado sem reamostragem ou edição de pixels.
- Ferramenta: geração de imagens integrada (`image_gen`), modo de edição do primeiro estudo, com fundo branco. Nenhuma API/key externa foi usada.
- SHA-256: `fe28ee077d001bbcf1748e4d1324d20b1e884893bbbc58db07204bdc5df55e6d`.
- O primeiro estudo mais denso e os exemplos vetoriais anteriores foram preservados.

Prompt final utilizado para a arte selecionada:

> Edit this generated editorial illustration into a much cleaner refined LINE DRAWING, suitable for an interactive pencil-following-contours animation. Keep the same subject and skilled natural anatomy: the two working hands and rolled sleeves, wrench correctly seated on the nut, metal fixture secured in the bench vise, and wooden bench, in a coherent three-quarter view. Preserve the convincing proportions, contact between objects and overall composition. Replace the background with an absolutely uniform pure white (#FFFFFF) background, including generous white negative space around the drawing; remove ALL dark/gray background shading and halos. Make the ink drawing elegant, confident and sparse, like a beautifully commissioned contemporary editorial illustration with realistic observational drawing. Reduce the number of hatching lines by about 85 percent. Remove all dense stippling, crosshatching, tiny repeated texture strokes, hair-like microtexture and large dark shadow masses. Describe volume primarily with well-shaped expressive contours, selected internal construction lines, and a few restrained groups of parallel hatching only where essential. Maintain nuanced medium-to-fine line weight, with slightly stronger silhouette outlines and delicate interior details. Keep the hands sophisticated and anatomically convincing, never simplistic mitten-like hands or cartoon clipart. Render metal, skin and wood through contour quality and just a few surface marks; do not fill them with gray. All strokes crisp black on white. No gradients, no gray paint, no paper texture, no glow, no labels, no lettering, no numbers, no signature, no border. Fully include the small visible bench section with a clean end contour and white margin, rather than fading into the edge. Important: this must be a high-quality fully resolved finished line illustration, not a traced photograph, wireframe, generic SVG icon, loose sketch or coloring-book image. It will later be revealed one contour at a time.

O resultado ainda contém hachura e pequenos recortes da bancada na borda. Isso está visível no estudo e deve ser avaliado, não descrito como um desenho perfeito ou um asset já homologado.

## Método reproduzível

`scripts/trace-ink.py` lê a imagem, analisa os pixels de tinta e extrai eixos centrais com thinning de duas passagens. Em seguida, separa cadeias em interseções e simplifica os percursos com tolerância de 0.65 pixel. Não salva ou modifica a imagem. A versão 2 ordena pelas extremidades próximas, favorece a continuidade da direção e une somente pontas coincidentes com tangentes compatíveis. Reverter uma linha ou uni-la a outra no mesmo ponto não modifica sua geometria. O resultado são **559 percursos**, com hash da origem em `src/data/workbench-traces.json`.

O script é uma ferramenta de autoria, não uma dependência de execução, CI ou build. Foi executado com Python 3.13, Pillow 12.0.0 e NumPy 2.3.5:

```powershell
python scripts/trace-ink.py public/assets/ink/workbench-generated-v1.png src/data/workbench-traces.json
```

As regiões e a ordem são dirigidas para esta composição; não são um classificador universal de objetos. Percursos maiores recebem mais tempo. A sequência anterior, ordenada por tamanho, exigia 292290 unidades de deslocamento entre traços dentro das etapas. A ordenação local reduz esse total a 14909 (94.9%): mediana de 14.9 e percentil 90 de 47.6 unidades, na imagem de 1536 × 1024. Saltos acima de 150 unidades caíram de 544 para 13. A comparação exclui as transições entre as três etapas editoriais e conserva o PNG original.

O intervalo de cada traço inclui um levantamento proporcional à distância até a próxima ponta. Em deslocamentos próximos, o lápis sobe e percorre a transição sem riscar; nos saltos grandes e nas mudanças de assunto, ele sai da cena brevemente. Seu corpo facetado, madeira, grafite e sombra são vetores com gradientes, sem textura ou imagem externa. A inclinação responde à tangente local, e a sombra acompanha a elevação.

A iluminação usa até 16 trechos recentes, cada um limitado às últimas 115 unidades de linha. Uma máscara aplica cor e bloom somente à tinta já revelada; não desenha uma trilha nova sobre a arte. A luz recente decai pelo progresso, de forma reversível. O quarto final da sequência reserva cerca de 11 segundos, na reprodução completa, para acentos nos três pontos de contato. No fim, fica uma luz discreta e estável nesses pontos, sem loop de animação em repouso. No modo de leitura, sem JavaScript, com movimento reduzido ou em telas baixas, a arte aparece sem esses glows.

`GeneratedWorkbench.astro` conserva a imagem como fonte de todos os detalhes. Uma máscara SVG de luminância extrai a tinta, e outra máscara abre os percursos pelo progresso. Uma transferência linear remove o quase branco do fundo somente na composição do navegador. A tinta assume a cor do tema, sem retângulo branco no modo escuro. O PNG permanece intacto.

`generated-ink-model.ts` calcula a sequência como função pura do progresso. `generated-ink.ts` aplica apenas as mudanças de máscara necessárias, usa o próprio percurso SVG para posicionar a ponta e para de renderizar em repouso. Não há interceptação de wheel/touch, bibliotecas novas ou relógio compartilhado com a folha.

Para não filtrar 1.5 milhão de pixels em cada repaint, o navegador prepara uma única máscara de exibição em Canvas e a mantém em um blob local em memória. O arquivo original não é alterado ou regravado. Sem Canvas, ou se a preparação falhar, a máscara de luminância SVG permanece funcional; sem JavaScript, ela também apresenta a arte inteira. A máscara em cache é preservada ao entrar no histórico rápido do navegador e liberada ao sair definitivamente da página.

## Alternativas e validação

- Sem JavaScript: arte completa e os quatro textos no fluxo normal.
- Movimento reduzido, modo de leitura ou altura inferior a 580 px: mesma alternativa, sem pin ou reprodução.
- Desktop e celular: cena presa abaixo da barra superior durante o desenho; controles de reprodução, reinício, slider e botões de momento no desktop.
- Mudança de viewport conserva o progresso. Ocultar a aba pausa. Teclado e toque permitem pausar e buscar sem reiniciar involuntariamente.
- Impressão revela a arte inteira; ao sair, o estado da navegação volta a ser amostrado.

Os testes Node verificam vínculo com o PNG original, limites dos percursos, continuidade espacial, iluminação somente em traços já revelados, acentos finais, sequência, determinismo, reversão e conclusão. `tests/test_generated_ink.py` verifica oito viewports, carregamento do PNG, pin, encaixe do texto/figura, alinhamento da ponta, controle por teclado/toque, resize, temas, repouso, impressão e alternativas. O teste anterior do caderno permanece registrado.

Builds de validação são gravados em diretórios novos, ignorados pelo Git; nenhum artefato de build integra o commit. Não houve alteração na main, release, publicação, banco, VPS ou espelho remoto. A reversão do refinamento de continuidade, luz e lápis é `e8eebd8dd50f331a7db6cd00e9473ed6a5ee2591`; o estado anterior ao piloto completo permanece em `083c672ba5c7e623096d34524fb5589c4361eedc`.

## Referências técnicas

- [SVG mask — MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/mask)
- [SVG getPointAtLength — MDN](https://developer.mozilla.org/en-US/docs/Web/API/SVGPathElement/getPointAtLength)
- [Centerline tracing e limites da vetorização — Inkscape](https://inkscape-manuals.readthedocs.io/en/latest/tracing-an-image.html)

Estes são guias do mecanismo. A ilustração é o asset gerado indicado acima.
