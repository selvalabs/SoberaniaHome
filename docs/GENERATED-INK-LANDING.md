# Arte gerada na landing — issue 73

Issue [#73](https://github.com/selvalabs/SoberaniaHome/issues/73). Branch `feat/73-generated-ink-landing`.

## Contrato visual

A bancada aprovada em `a307088471073e5a66617a15e6632b4fc49a38f4` é a referência: original gerado, contornos observacionais, ordem por vizinhança, lápis facetado com madeira/grafite, levantamento nos deslocamentos, luz limitada à tinta já desenhada e acentos finais. Não se substituiu o desenho por formas SVG manuais. O SVG contém máscaras/percursos de revelação e o instrumento, não uma nova interpretação da ilustração.

A implementação compartilha `generated-ink-painter.ts` com o estudo aprovado. O ensaio conserva seus controles, duração de 52 s e rota. Na landing, apenas o clock nativo de `motion.ts` entrega progresso às cenas. Não há novo RAF, timer ou interceptação de wheel/touch. As cenas acompanham os três blocos de texto e reservam o último quarto para a luz. A nova introdução de entrega entra também na compressão de runway de `leafScrollClock`, preservando a queda lenta da folha durante a leitura.

## Direção das cenas

- **02 / Trabalho:** a bancada original cresce de base → ferramenta → mãos. Legendas conectam o gesto à pergunta sobre o tempo poupado e à proposta de distribuir os ganhos. A paráfrase histórica de Lenin e seu link permanecem distintos da proposta institucional. O desenho não é dado estatístico nem reconstituição documental.
- **04 / Saberes:** caderno de observação → plano comum → gestos de colaboração. A luz encontra a observação, o ofício e o plano compartilhado. Mantidos todos os parágrafos e a citação/fonte de Paulo Freire.
- **08 / Entrega:** chaves/dados → manual → quem já opera o sistema. A introdução desenhada precede os documentos originais, preservados com abas, teclado, hash e alternativas sem JS. A tela ilustrada é conceitual e identificada como tal.

As imagens são uma composição única cada. Não há alegação de movimentos independentes de mãos ou objetos: isso exigiria camadas dirigidas separadamente. A física existente da folha é preservada.

## Originais e geração

Modo: ferramenta integrada `image_gen`, geração com a bancada como referência de estilo, sem API/key externa. PNGs copiados sem reamostragem, mudança de pixels ou remoção de fundo. O fundo branco serve à máscara de tinta exibida no navegador; não aparece como retângulo no tema escuro.

| Cena | Asset | SHA-256 | Percursos |
| --- | --- | --- | --- |
| Trabalho | `public/assets/ink/workbench-generated-v1.png` | `fe28ee077d001bbcf1748e4d1324d20b1e884893bbbc58db07204bdc5df55e6d` | 559 |
| Saberes | `public/assets/ink/knowledge-generated-v1.png` | `0b9920aa591bfa78fd979088db84dab556b1e982a3ce358f3e03c1881a570ae5` | 820 |
| Entrega | `public/assets/ink/handover-generated-v1.png` | `f219b27c3ee59cba7d806e25154e3116629ed48e7b061f7ffe27879991eda32f` | 635 |

Todos: 1536 × 1024. A procedência e o prompt da bancada estão em [GENERATED-INK-WORKBENCH.md](GENERATED-INK-WORKBENCH.md).

Fontes geradas preservadas:
- Saberes: `C:/Users/carlo/.codex/generated_images/01a10256-6b0e-7c91-80b7-b98d8ea40e26/exec-d5ef422d-708c-4225-9755-97a78808dae6.png`.
- Entrega: `C:/Users/carlo/.codex/generated_images/01a10256-6b0e-7c91-80b7-b98d8ea40e26/exec-495b6757-69bd-44c0-92e0-f6bf7c9e0274.png`.

## Prompts finais

### Saberes

Use case: illustration-story. Create a new commissioned editorial LINE ILLUSTRATION for the Soberania Labs website, using the attached workbench artwork ONLY as a reference for drawing quality, restrained realistic contour/hatching, anatomy and visual family; do not repeat its subject. Scene: knowledge from research, skilled work and everyday community life meeting equally in a shared project. A coherent intimate three-quarter overhead view of a modest Brazilian cooperative's shared wooden table. Three natural, anatomically convincing hands and rolled-sleeve forearms enter from different edges: one beside an open field notebook with a delicate botanical observation drawing, one places a small actual wooden joinery sample, and one holds a pencil over a shared project sheet in the center. Their gestures converge around that central plan as equal collaborators. A small closed ordinary laptop sits partly behind the central sheet, secondary to the people. Include a few subtle plant leaves beside the notebook, connecting nature and careful observation. Composition: 1536x1024 landscape, generous pure white margins, all important objects fully visible, balanced central focus, enough breathing room between objects for local contour-by-contour drawing. Style MUST closely match the attached approved fine black-on-white workbench: confident finished observational drawing, sophisticated hands, nuanced thin-to-medium contours, very sparse selected groups of parallel hatching. Reduce tiny decorative marks and unnecessary texture; volume comes from excellent contours. Crisp black ink on absolutely uniform pure white #FFFFFF. No grey fills, no paper texture, no huge black masses, no gradients, no glows, no lettering, no numbers, no labels, no text, no border, no signature. No schematic clipart or wireframe or generic SVG icon style. Each finger and its contact must be plausible. Output one unified resolved editorial drawing.

### Entrega

Use case: illustration-story. Create a new fine commissioned editorial LINE ILLUSTRATION for Soberania Labs, in precisely the visual family of the attached approved workbench reference. The reference supplies only sophisticated observational drawing, realistic hand anatomy and contour quality; change the scene. Theme: delivery of a digital system should transfer the capacity to operate it, understand it and continue independently. Scene: a modest cooperative worktable, in a clean three-quarter view. A pair of people's hands collaborate around an OPEN LAPTOP with a simple, blank modular interface expressed as a few neat rectangular panels (no text). The receiver's hand rests confidently on the keyboard/trackpad, already operating it. The other person's hand sets down an open slim ring-bound operating manual beside the laptop, as if sharing the documented path rather than controlling the computer. A small physical key ring with two keys lies close to the receiver's hand; a small external data drive with a cable lies beside the manual. Three distinct visual zones, united by the same tabletop: access/keys, knowledge/manual, continuity/laptop and export drive. Keep these objects plausible, clear and restrained, not icons or floating symbols. Only two hands, convincing anatomy, rolled sleeves, no faces. Composition landscape 1536x1024, comfortable white margins, important laptop, keys and manual fully visible, no crop of key objects. Restrained natural black ink outlines on absolutely uniform pure white #FFFFFF, nuanced medium-fine contours, just a few groups of parallel hatching. No gray fills, no dense microtexture, no black shadow masses, no gradients, no glow, no text, lettering, numbers, logos, borders or signatures. Excellence and believable contact between hand and object are essential. Elegant finished line illustration, never a schematic, generic SVG, clipart or traced-photo effect.

## Autoria determinística e limites

`trace-ink.py` lê os originais sem os alterar. O thinning, a simplificação, a continuidade tangencial e a fusão apenas de extremidades coincidentes são os mesmos do estudo. `--scene` escolhe regiões e sementes editoriais específicas; não é um detector genérico de objetos nem recupera a ordem original do desenho da IA.

```powershell
python scripts/trace-ink.py public/assets/ink/knowledge-generated-v1.png src/data/knowledge-traces.json --scene knowledge
python scripts/trace-ink.py public/assets/ink/handover-generated-v1.png src/data/handover-traces.json --scene handover
```

Ferramentas offline: Python 3.13, Pillow 12.0.0, NumPy 2.3.5. Sem dependência adicional no runtime/build. Noventa por cento dos levantamentos ficam abaixo de 47.54 unidades em saberes e 55.23 em entrega; somente 17 e 13 saltos respectivamente ultrapassam 150 unidades. O lápis sai brevemente em saltos grandes. Pequenos detalhes de hachura completam o original antes da iluminação final, como no estudo aprovado.

IDs de máscaras e gradientes são exclusivos por cena. O cache Canvas de máscara é preparado perto da viewport, preserva fallback SVG e libera seu blob na saída definitiva. Em repouso não há renderização contínua. Temas mudam as tintas, não a origem do asset. Sem JS, leitura e movimento reduzido mostram a arte completa. Abaixo de 580 px de altura não há desenho animado; o layout compacto da dobra 2 prioriza o texto e a fonte histórica. A impressão revela a ilustração completa e a saída da impressão restaura o estado anterior.

## Validação local — 21/10/2026

- Typecheck, `git diff --check`, 58 testes Node: passaram. Não há script de lint dedicado no repositório.
- `npm audit --audit-level=low` e `python -m pip_audit -r requirements-pages.txt`: sem vulnerabilidades conhecidas.
- Builds root e Pages, verificadores `check-static.mjs` e `check-pages.mjs`: passaram. Pacotes locais de QA usam `v0.0.0` somente como fixture; não se criou ou publicou uma tag de release.
- `test_landing_ink.py`: sete viewports, três cenas, ponta registrada, reversão, luz final, impressão/restauração, temas, repouso, leitura, movimento reduzido, sem JS e sem Canvas: passou no root e no prefixo real `/SoberaniaHome/`.
- `test_generated_ink.py`: oito viewports e alternativas do ensaio aprovado; passou após compartilhar o painter.
- `test_choices_print.py`, `test_knowledge_print.py` e `test_hero_print.py`: revelação sucessiva, enquadramento, linhas legíveis, fonte e alternativas passaram.
- `test_mobile_viewport_fit.py`: oito viewports, agora incluindo todas as linhas da introdução de entrega, resize da barra móvel e as 16 dobras: passou no build final.
- `test_leaf_reveal_origin.py` (incluindo entrega), `test_leaf_gallery_spiral.py`, `test_horizontal_viewports.py` e `test_site_edition.py`: passaram. Galerias verificadas de 240 × 320 até 1440 × 900, toque real em três tamanhos, orientação, leitura interna e controles.
- Houve duas falhas intermitentes de navegação nos primeiros runs com múltiplos browsers concorrentes. As reproduções isoladas e a sequência completa final passaram sem relaxar as verificações; o helper de salto agora registra geometria e scroll em caso de nova falha. A causa desses dois eventos não foi demonstrada, portanto não se atribui uma correção de produto a eles.
- Capturas inspecionadas nos temas claro/escuro e desktop/celular. Preview reutiliza `0.0.0.0:4198`, PID 48284, em `192.168.1.4` (Wi-Fi), HTTP 200 e três cenas confirmadas. Nenhum servidor adicional permanente foi aberto.

O CI completo do novo PR é uma verificação separada; seus resultados devem ser consultados no GitHub antes de homologar ou fazer merge.

## Histórico e publicação

A branch nasceu no GitHub de `057cf68630c899401cad6284833eb53b67b86a82` e recebeu por fast-forward a dependência aprovada `a307088471073e5a66617a15e6632b4fc49a38f4` (PR #72, com a cadeia #66/#68/#70). Nenhuma história foi reescrita. Main, v0.2.1 e produção permanecem preservadas; sem banco, migração, release ou VPS. Rollback local de comparação: `a307088`. Builds e capturas são ignorados, não integram o commit.
