# ESCOPO — INLINE_EDITOR_PACK v1.5

## 0. Objetivo da rodada

Evoluir a v1.4 sem reescrever a arquitetura já estabilizada de geometria, mantendo o editor leve/autocontido, mas preparando a toolbox para crescer sem voltar a ficar uma coluna vertical enorme.

A v1.5 terá quatro focos principais:

1. **UI escalável em abas + subabas**;
2. **edição em lote / multiseleção**;
3. **Visual e Efeitos mais completos e parametrizáveis**;
4. **segurança de autoria**: reset com confirmação, dirty state e proteção contra fechar/recarregar com alterações não salvas.

A v1.4 é considerada baseline funcional. Não há bug crítico confirmado neste momento; esta rodada é majoritariamente expansão/refatoração controlada.

---

# 1. Princípios que NÃO mudam

- HTML final continua autocontido.
- Editor continua sendo camada temporária de autoria, não CMS/page builder.
- Não criar backend.
- Não reordenar seções por drag nesta versão.
- Não converter elementos para `absolute` silenciosamente.
- Mudanças devem ser registradas no histórico e exportadas no HTML salvo.
- Toda interface do editor deve herdar a paleta/variáveis da página quando possível.
- Tooltips devem ser estilizados; não usar `title` nativo na toolbox.
- `prefers-reduced-motion` deve continuar respeitado.
- GeometryController v1.4 permanece como base única para move/resize.

---

# 2. Organização da toolbox: abas + subabas

## 2.1 Main tabs

Manter as cinco abas principais:

- **CONTEÚDO**
- **LAYOUT**
- **VISUAL**
- **EFEITOS**
- **MAIS**

## 2.2 Subabas obrigatórias

Cada aba principal terá uma segunda linha de navegação horizontal compacta. Mesmo subabas com poucos controles devem existir para garantir escalabilidade futura.

### CONTEÚDO

1. **Texto**
   - edição direta
   - B / I / U
   - cor do texto
   - marca-texto
   - alinhamento textual quando aplicável

2. **Tipografia**
   - família
   - tamanho da fonte
   - **altura da linha (`line-height`)**
   - **espaçamento entre letras (`letter-spacing`)**
   - peso numérico opcional quando suportado
   - transformação de caixa: normal / MAIÚSCULA / minúscula / Capitalizar

3. **Link / CTA**
   - URL/destino
   - mesma aba / nova aba
   - texto do CTA editável
   - comportamento protegido em modo edição

4. **Mídia**
   - alt
   - trocar imagem
   - metadados básicos

### LAYOUT

1. **Tamanho**
   - largura
   - altura
   - min-width / min-height quando fizer sentido
   - auto/reset individual
   - lock de proporção para mídia

2. **Espaçamento**
   - padding por lado
   - margin por lado
   - vínculo dos quatro lados

3. **Alinhamento**
   - esquerda / centro / direita
   - topo / meio / base onde houver contexto geométrico válido
   - alinhamento de mídia
   - alinhamento de grupo quando multiseleção estiver ativa

4. **Posição**
   - fluxo normal / relative / absolute / fixed / sticky
   - Mover livre
   - X/Y numérico
   - Smart Guides
   - snapping on/off
   - **grade de 9 posições SOMENTE quando `position:absolute` ou `fixed`**

5. **Tabela**
   - largura de coluna
   - altura de linha
   - bloqueio em `colspan/rowspan` ambíguo

6. **Grupo**
   - visível somente com 2+ elementos selecionados
   - alinhar grupo: esquerda / centro / direita / topo / meio / base
   - distribuir horizontalmente / verticalmente
   - espaçamento uniforme entre selecionados

### VISUAL

1. **Fundo**
   - cor sólida
   - remover fundo
   - gradiente de duas cores
   - ângulo do gradiente
   - imagem de fundo
   - cover/contain/auto
   - repeat/no-repeat
   - posição do background
   - opacidade de overlay quando aplicável

2. **Bordas**
   - borda principal (atual)
   - **borda interna**
   - **borda externa**
   - largura / cor / estilo
   - offset da borda externa
   - radius
   - opção de vincular/desvincular cantos em etapa avançada

3. **Sombra**
   - presets: Nenhuma / Suave / Elevada / Profunda / Glow
   - modo avançado:
     - X
     - Y
     - blur
     - spread
     - cor
     - opacidade

4. **Filtros**
   - brilho
   - contraste
   - saturação
   - grayscale
   - blur
   - reset filtros

5. **Mídia**
   - object-fit
   - enquadramento 3x3
   - radius
   - borda de mídia
   - drop-shadow contextual para PNG/SVG transparente

6. **Transparência**
   - opacidade geral
   - mantida como subaba própria para não ficar perdida

### EFEITOS

1. **Hover**
2. **Entrada**
3. **Contínuo**
4. **Interação** (`:active` / clique/press)

Cada subaba de efeito terá:

- seletor de efeito;
- slider **Intensidade 0–100**;
- velocidade/duração;
- preview;
- reset daquele efeito;
- tooltip explicando em linguagem simples.

### MAIS

1. **Selos & detalhes**
   - substitui o nome “Camada decorativa”
   - esconder `::before` / `::after` da linguagem principal
   - seletor visual:
     - “Antes do conteúdo”
     - “Depois do conteúdo”
   - texto
   - cor do texto
   - fundo
   - fonte
   - padding
   - radius
   - posição básica quando possível
   - ajuda visual curta: `[Antes]  Conteúdo  [Depois]`
   - tooltip técnico opcional explicando que isso usa pseudo-elementos CSS

2. **Elemento**
   - ocultar/mostrar
   - overflow
   - z-index quando relevante
   - pointer-events avançado somente se solicitado/seguro

3. **Histórico**
   - undo
   - redo
   - checkpoint de save
   - resetar sessão opcional

4. **Avançado**
   - controles menos usados
   - informações de tag/classe/id somente leitura
   - posição CSS avançada

---

# 3. SubTabController

Criar um controlador próprio para subabas.

Requisitos:

- uma subaba ativa por main tab;
- estado persistido por main tab em `localStorage`;
- subabas horizontais compactas com scroll em telas estreitas;
- subabas irrelevantes ao contexto devem ficar **desabilitadas**, não desaparecer, para manter posição consistente;
- tooltip estilizado em todas as subabas;
- ao trocar o elemento selecionado, manter a última subaba válida se ela ainda se aplicar;
- caso não se aplique, cair na primeira subaba habilitada.

---

# 4. Multiseleção / edição em lote

## 4.1 Modelo de seleção

Evoluir de:

`EditorState.selected`

para:

- `EditorState.selected` = seleção primária / âncora
- `EditorState.selectionSet` = lista ordenada de elementos selecionados

## 4.2 Gestos

- clique normal: substitui seleção;
- `Ctrl + clique` / `Cmd + clique`: adiciona/remove elemento da seleção;
- `Esc`: limpa toda seleção;
- último elemento adicionado vira seleção primária;
- Shift fica reservado para GeometryController / axis lock, não para multiseleção.

## 4.3 Overlay

Com 2+ selecionados:

- outline individual sutil em cada elemento;
- elemento primário com outline mais forte;
- bounding box geral do grupo;
- contador na toolbox: `3 elementos`.

## 4.4 Edição em lote permitida

Aplicar aos selecionados:

- fonte;
- tamanho;
- B/I/U;
- cor;
- line-height;
- letter-spacing;
- opacidade;
- bordas;
- sombra;
- filtros;
- efeitos;
- ocultar/mostrar;
- reset.

## 4.5 Edição em lote bloqueada

Não editar simultaneamente:

- conteúdo textual diferente de vários elementos;
- URLs diferentes;
- `src` de múltiplas imagens.

Nesses casos, mostrar `— valores diferentes —` / “Selecione um único elemento para editar conteúdo”.

---

# 5. GroupController

Novo controlador para operações de grupo.

## 5.1 Alinhamento

- esquerda
- centro horizontal
- direita
- topo
- meio vertical
- base

## 5.2 Distribuição

- distribuir horizontalmente
- distribuir verticalmente
- espaçamento uniforme configurável

## 5.3 Restrição de segurança

Operações de distribuição devem exigir:

- mesmo container pai ou mesmo sistema de coordenadas;
- caso contrário, bloquear e explicar via toast.

## 5.4 Movimento do grupo

Quando 2+ elementos estiverem selecionados:

- grab do grupo move todos juntos;
- GeometryController registra um gesto único no histórico;
- Shift axis lock e Smart Guides funcionam para o bounding box do grupo;
- Alt ignora snap.

---

# 6. Navegação estrutural Pai / Filho

## 6.1 Pai

Manter `↑ Pai`.

## 6.2 Filho

Adicionar `↓ Filho`.

Comportamento:

- se houver um único filho editável significativo: seleciona diretamente;
- se houver vários: abre mini-popover listando filhos diretos editáveis;
- label do item mostra tag + classe curta + começo do texto quando houver;
- não listar scripts/styles/editor runtime.

## 6.3 Breadcrumb

Mantido como terceira forma de navegar pela hierarquia.

---

# 7. NumericStepperController

Todo controle numérico calibrável terá:

`−  [valor]  +`

Requisitos:

- click simples incrementa/decrementa pelo step daquele campo;
- segurar botão repete após pequeno delay;
- `Shift + clique` usa step ×10;
- teclado ↑/↓ continua funcionando;
- unidade visível: px / % / deg quando aplicável;
- campos ainda podem receber valor digitado manualmente.

Steps sugeridos:

- dimensões: 1 px
- margin/padding: 1 px
- font-size: 1 px
- line-height: 0.05
- letter-spacing: 0.1 px
- radius: 1 px
- border width: 1 px
- intensidade: 5%
- gradiente: 1°
- filtros: 5%

---

# 8. Reset no topo + BaselineManager

## 8.1 Botão Reset

Mover reset para a área superior da toolbox.

Fluxo:

1. usuário clica `Reset`;
2. abrir modal estilizado de confirmação;
3. mostrar alvo:
   - 1 elemento selecionado; ou
   - N elementos selecionados;
4. confirmar restauração.

## 8.2 BaselineManager

O reset deve voltar o elemento ao estado **anterior às alterações feitas pelo editor**, não apenas limpar algumas propriedades inline.

Implementar baseline lazy:

- primeiro toque/mutação em um elemento captura seu estado-base;
- inclui attrs + innerHTML quando necessário;
- reset restaura esse baseline;
- reset é undoable.

## 8.3 Reset de sessão

Em `MAIS > Histórico`, incluir opção separada:

- `Resetar todas as alterações desta sessão`

com confirmação dupla/destrutiva.

---

# 9. DirtyStateGuard

## 9.1 Estado sujo

Marcar `dirty=true` após qualquer mutação real.

## 9.2 Save checkpoint

Após salvar HTML com sucesso:

- registrar checkpoint;
- `dirty=false`;
- novas alterações tornam dirty novamente.

## 9.3 Fechar / recarregar

Quando `dirty=true`:

- registrar `beforeunload`;
- browser deve pedir confirmação antes de fechar/recarregar;
- usar confirmação nativa do navegador (mensagem customizada não é garantida pelos browsers modernos).

## 9.4 Navegação via CTA

Se existir mudança não salva e o usuário confirmar um CTA externo/âncora que implique navegação:

- snackbar deve mencionar que há alterações não salvas;
- opções: cancelar / salvar / continuar.

---

# 10. GeometryController v1.5

A v1.4 já estabilizou move/resize. Não reescrever; apenas estender.

Adicionar:

- suporte a grupo;
- campos X/Y numéricos;
- UI da grade 3x3 somente em `absolute/fixed`;
- steppers para dimensões/offsets;
- alinhamento em lote;
- distribuição;
- manter:
  - release sem salto;
  - Shift axis lock latched;
  - Alt ignora snap;
  - Smart Guides;
  - um gesto = uma entrada no histórico.

---

# 11. VisualEngine v2

## 11.1 Composição de bordas

Suportar simultaneamente:

- borda principal;
- borda interna;
- borda externa.

Implementação sugerida:

- principal: `border`;
- externa: `outline + outline-offset`;
- interna: layer `inset` em compositor de `box-shadow`.

## 11.2 ShadowComposer

Criar compositor para não destruir:

- sombra original da página;
- borda interna;
- sombra aplicada pelo editor.

Usar CSS vars / metadata authored em vez de sobrescrever cegamente `box-shadow`.

## 11.3 FilterComposer

Filtros visuais e efeitos animados usam `filter`.

Criar composição que evite conflito entre:

- brilho/contraste/saturação/blur;
- hover glow;
- loop glow;
- drop-shadow de mídia.

---

# 12. EffectsEngine v2

## 12.1 Regra geral

Cada grupo de efeito terá variáveis próprias:

- `--ie-hover-intensity`
- `--ie-enter-intensity`
- `--ie-loop-intensity`
- `--ie-interaction-intensity`

Intensidade 0–100 deve mapear proporcionalmente para distância, escala, blur, glow, opacidade etc.

## 12.2 Hover — ampliar biblioteca

Manter existentes e adicionar:

- elevar
- scale
- sombra suave
- glow
- iluminar
- dim
- deslocar direita
- borda/acento
- **tilt esquerda**
- **tilt direita**
- **zoom + glow**
- **desaturado → cor**
- **cor → desaturado**
- **blur → nítido**
- **sombra lateral**
- **leve profundidade 3D**

## 12.3 Entrada — ampliar biblioteca

Manter existentes e adicionar:

- blur in
- rotate suave
- zoom + subir
- reveal por clip horizontal
- reveal por clip vertical
- drop suave
- pop suave
- slide diagonal

Parâmetros:

- intensidade
- duração
- delay

## 12.4 Contínuo — ampliar biblioteca

Manter existentes e adicionar:

- sway
- drift horizontal
- bob vertical
- brilho oscilante
- border pulse
- shimmer suave
- tilt pendular
- micro bounce

Parâmetros:

- intensidade
- duração

## 12.5 Nova classe: Interação

Efeitos de `:active` / press:

- pressionar
- tap scale
- sink
- flash glow
- pulse once

Evitar ripple JS nesta versão para não criar dependência estrutural desnecessária.

## 12.6 Compatibilidade

- efeitos devem continuar usando canais compostos de translate/scale/rotate/filter;
- GeometryController não pode perder offset authored;
- conflitos devem ser prevenidos ou compostos;
- efeitos do host existentes não podem ser removidos silenciosamente.

---

# 13. Tooltip / Help v2

## 13.1 Tooltips

Adicionar tooltip estilizado em:

- main tabs;
- subabas;
- toggles;
- labels técnicas;
- sliders;
- steppers;
- presets de efeitos;
- controles de borda;
- GroupController.

Nunca duplicar com `title` nativo.

## 13.2 Tutorial modal

Atualizar modal para explicar:

- abas/subabas;
- seleção única;
- multiseleção;
- Pai / Filho;
- mover livre;
- Smart Guides;
- intensidade dos efeitos;
- borda interna/externa;
- reset;
- save e aviso ao fechar/recarregar;
- Selos & detalhes.

---

# 14. Limpeza técnica da v1.4

Durante a v1.5 revisar e remover resíduos que não são bugs visíveis, mas já são dívida técnica:

- prefixo histórico `iev12-*` → prefixo version-agnostic `iehid-*`;
- remover CSS legado de `.ie-panel/details` que não é mais usado;
- remover campos/handlers antigos de `resize` / `elementDrag` que foram substituídos pelo GeometryController;
- centralizar constants/storage keys da versão;
- garantir que serializers removam somente runtime/transient e preservem authored CSS vars;
- revisar listeners para evitar duplicidade após Save/Reopen;
- revisar z-index do editor/modal/tooltip/overlay;
- garantir acessibilidade básica das tabs/subtabs (`role=tab`, `aria-selected`, keyboard arrows).

---

# 15. Dirty / History / Multi-select integration

Histórico deve suportar snapshots de N elementos.

Toda operação em lote deve gerar **uma única entrada**:

- “Aplicar fonte em 4 elementos”
- “Alinhar 3 elementos”
- “Distribuir 5 elementos”
- “Resetar 2 elementos”

Undo deve restaurar o conjunto inteiro de forma atômica.

---

# 16. Responsividade da toolbox

Desktop:

- largura semelhante à v1.4;
- main tabs em 1 linha;
- subtabs em linha horizontal rolável;
- somente o painel da subaba ativa ocupa altura;
- alvo: toolbox significativamente menor que v1.4 para uma mesma operação.

Mobile:

- main tabs roláveis horizontalmente;
- subtabs roláveis horizontalmente;
- controles em 1–2 colunas conforme largura;
- modal de ajuda ocupa quase toda viewport;
- multiseleção continua utilizável, mas sem exigir precisão extrema.

---

# 17. Critérios de aceite / QA v1.5

## Gate 01 — Boot
- editor inicia sem erro JS.

## Gate 02 — Main tabs
- 5 abas funcionam e têm tooltip.

## Gate 03 — Subtabs
- todas as abas possuem subabas, estado correto e contexto válido.

## Gate 04 — Typography
- font-size, line-height e letter-spacing persistem e undo/redo funciona.

## Gate 05 — Numeric steppers
- +/- funcionam, hold-repeat funciona, Shift ×10 funciona.

## Gate 06 — Single selection
- seleção, pai, filho e breadcrumb funcionam.

## Gate 07 — Multi-select
- Ctrl/Cmd click adiciona/remove;
- primary selection correta;
- overlays corretos.

## Gate 08 — Batch formatting
- cor/fonte/opacidade/efeito aplicados a todos selecionados.

## Gate 09 — Group align
- left/center/right/top/middle/bottom.

## Gate 10 — Group distribute
- horizontal/vertical e gap padrão.

## Gate 11 — Group drag
- mover grupo é um único gesto e undo único.

## Gate 12 — Geometry regression
- resize/move v1.4 continuam sem jump/deformação.

## Gate 13 — Absolute grid visibility
- 3x3 só aparece em absolute/fixed.

## Gate 14 — Visual / borders
- principal + interna + externa coexistem.

## Gate 15 — Shadow/filter composition
- visual não destrói efeitos ou sombras do host.

## Gate 16 — Effects intensity
- intensidade altera magnitude de cada classe de efeito.

## Gate 17 — Extended effects
- novos hover/entrada/contínuo/interação funcionam.

## Gate 18 — Reset selected
- confirmação + baseline + undo.

## Gate 19 — Dirty guard
- fechar/reload com alteração não salva pede confirmação.

## Gate 20 — Save checkpoint
- após salvar, dirty=false; nova edição volta a dirty=true.

## Gate 21 — Selos & detalhes
- before/after editáveis com linguagem leiga.

## Gate 22 — Table regression
- resize tabela v1.4 continua funcionando.

## Gate 23 — CTA regression
- snackbar continua bloqueando navegação acidental.

## Gate 24 — Save / reopen
- HTML salvo reabre com authored state intacto e editor funcional.

## Gate 25 — Mobile
- tabs/subtabs/toolbox/modal continuam utilizáveis.

## Gate 26 — Landing real
- smoke test na Rotina da Empreendedora Selvagem.

---

# 18. Ordem de implementação obrigatória

1. limpeza técnica v1.4;
2. SubTabController;
3. Typography + NumericStepperController;
4. SelectionModel multiselect;
5. Pai/Filho + overlay de grupo;
6. GroupController;
7. GeometryController group extension;
8. DirtyStateGuard + BaselineManager + Reset;
9. VisualEngine v2 / ShadowComposer / FilterComposer;
10. EffectsEngine v2 + intensity;
11. Selos & detalhes rename/rework;
12. Help/tooltip v2;
13. Serializer/Save checkpoint;
14. QA no template;
15. reintegração na landing limpa;
16. smoke completo na landing real;
17. gerar `INLINE_EDITOR_PACK_v1.5.zip` + landing v1.5 + relatórios.

---

# 19. Entregáveis do próximo RUN

- `INLINE_EDITOR_PACK_v1.5.zip`
- `INLINE_EDITOR_TEMPLATE.html`
- `SKILL.md`
- `CHANGELOG.md`
- `QA_MATRIX.md`
- `VALIDATION_REPORT.md`
- `rotina-empreendedora-selvagem-EDITAVEL-v1.5.html`

---

# 20. Decisões fechadas para evitar ambiguidade no RUN

- Próxima versão: **v1.5**.
- A v1.4 é baseline funcional.
- Main tabs permanecem.
- Todas ganham subabas.
- “Camada decorativa” vira **Selos & detalhes**.
- line-height e letter-spacing ficam em **Conteúdo > Tipografia**.
- grade 3x3 de posição do elemento aparece apenas em absolute/fixed.
- multiseleção = Ctrl/Cmd + clique.
- Shift continua exclusivo para axis-lock do GeometryController.
- reset do topo restaura baseline do(s) elemento(s) e pede confirmação.
- browser close/reload usa `beforeunload` quando dirty.
- borda interna + externa entram na v1.5.
- Visual ganha Fundo, Bordas, Sombra, Filtros, Mídia e Transparência.
- Efeitos ganham intensidade e uma nova classe **Interação**.
- nenhuma mudança transforma a ferramenta em page builder estrutural.
