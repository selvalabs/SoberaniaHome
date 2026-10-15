# ESCOPO — INLINE_EDITOR_PACK v1.5.3

## 0. Título da rodada

**Edição textual direta + formatação por trecho + navegação por Tab**

Versão-alvo: `1.5.3`
Baseline obrigatório: `INLINE_EDITOR_PACK_v1.5.2`

---

## 1. Objetivo

Transformar a edição de texto da toolbox em uma experiência de editor visual real:

1. ao selecionar/clicar em um elemento textual no modo de edição, ele já entra automaticamente em edição direta;
2. não exigir mais o botão **Editar texto na página**;
3. quando o usuário selecionar apenas um trecho do texto, qualquer formatação inline deve ser aplicada somente àquele trecho;
4. a implementação deve segmentar o trecho com um `span` autoral controlado pelo editor, sem alterar o restante do bloco;
5. `Tab` deve avançar para o próximo elemento textual editável e `Shift + Tab` voltar ao anterior;
6. preservar histórico, undo/redo, dirty state, serializer, responsividade, links/CTAs protegidos e Clean Build.

A regra central desta versão é:

> **Elemento textual selecionado = editável imediatamente. Trecho selecionado = formatação aplicada somente ao trecho.**

---

## 2. Diagnóstico da v1.5.2

A baseline já contém parte da infraestrutura necessária:

- `SelectionEngine.refreshFlags()` já aplica `contenteditable="true"` quando existe uma única seleção textual;
- `selectionchange` já salva um `Range` não colapsado em `EditorState.savedRange`;
- `TextEditor.apply()` já tenta envolver um trecho selecionado em `<span>`;
- `beforeinput`, `input` e `paste` já integram edição textual ao histórico;
- links e CTAs já têm proteção contra navegação acidental.

Mas existem gaps concretos:

### 2.1 O texto fica `contenteditable`, mas não entra em edição de forma confiável

A seleção do elemento ocorre no `click`, depois do `pointerdown` que normalmente define caret/seleção no navegador.

Consequência:
- o elemento pode receber `contenteditable` tarde demais para aquele gesto;
- o usuário precisa recorrer a **Editar texto na página** ou a um segundo gesto para começar a digitar com previsibilidade.

### 2.2 O botão “Editar texto na página” é redundante

`TextEditor.editDirect()` hoje:
- dá `focus()`;
- seleciona todo o conteúdo do elemento;
- salva o Range.

Na nova UX isso deve acontecer automaticamente quando necessário, sem botão intermediário.

### 2.3 A implementação de trecho é funcional, mas simplista

Hoje `TextEditor.apply()` faz:

```text
range.extractContents()
→ cria span
→ insere fragmento dentro do span
→ aplica estilo
→ reinsere span
```

Isso funciona nos casos simples, porém pode gerar:
- spans aninhados em operações sucessivas;
- wrappers redundantes;
- estruturas ruins quando o Range atravessa nós inline diferentes;
- risco de envolver conteúdo estrutural dentro de `span` em células/tipos complexos;
- dificuldade de remover uma formatação apenas do trecho já segmentado.

### 2.4 O `savedRange` só é mantido quando a seleção não está colapsada

Para edição direta mais natural precisamos distinguir:

- **caret**: ponto de digitação;
- **range**: trecho selecionado;
- **bloco**: elemento textual selecionado sem trecho ativo.

### 2.5 Tab ainda não navega entre textos da página

Hoje `Tab` é tratado apenas para foco preso em modais.

No conteúdo da página não existe um `TextNavigationController`.

---

## 3. Arquitetura proposta

Criar quatro responsabilidades explícitas:

```text
TextActivationController
TextRangeController
InlineFormatEngine
TextNavigationController
```

Não substituir `SelectionEngine`, `HistoryManager` ou `TextEditor` por completo.

A v1.5.3 deve estender esses componentes e manter compatibilidade com o restante da v1.5.2.

---

# PARTE A — ATIVAÇÃO AUTOMÁTICA DE EDIÇÃO

## 4. TextActivationController

### 4.1 Ativação no `pointerdown`

Quando `EditorState.editMode === true` e o alvo resolver para contexto:

```text
text
link
table_cell
```

executar a seleção do elemento ainda na fase de `pointerdown`, antes do comportamento nativo do navegador definir caret/Range.

Requisitos:

- não chamar `preventDefault()` para texto normal;
- tornar o elemento `contenteditable` antes da seleção nativa ocorrer;
- permitir ao navegador posicionar o caret exatamente onde o usuário clicou;
- preservar drag nativo para seleção de texto;
- não iniciar GeometryController ao clicar no texto;
- `Ctrl/Cmd + clique` continua reservado à multiseleção de elementos.

### 4.2 Clique simples em texto

Resultado esperado:

```text
1 clique
→ elemento selecionado
→ contenteditable ativo
→ caret no ponto clicado
→ usuário pode digitar imediatamente
```

Nenhum botão adicional.

### 4.3 Seleção por arraste

Resultado esperado:

```text
pointerdown + drag sobre texto
→ elemento permanece selecionado
→ Range nativo é preservado
→ toolbar reconhece "Trecho selecionado"
```

O `click` disparado após o drag não pode zerar `savedRange`.

### 4.4 CTA / link

Manter a segurança atual:

- não navegar automaticamente;
- o CTA deve poder ter seu texto editado diretamente;
- o snackbar de destino permanece disponível;
- o mecanismo de proteção não pode destruir o Range textual.

Critério:

> Um CTA pode ser selecionado, receber caret, selecionar trecho e editar texto sem navegar.

---

# PARTE B — ESTADO DE SELEÇÃO TEXTUAL

## 5. TextRangeController

Criar estado explícito:

```js
EditorState.textRange = {
  elementId,
  range,
  collapsed,
  mode: 'caret' | 'range' | 'block'
}
```

### 5.1 Modos

#### `range`
Existe seleção textual real não colapsada dentro de um único elemento editável.

#### `caret`
Existe caret colapsado dentro do elemento editável.

#### `block`
Existe elemento textual selecionado, mas nenhum Range/caret válido no conteúdo.

### 5.2 Persistência da seleção ao usar a toolbox

Ao clicar num controle da toolbox, o navegador pode tirar foco visual do conteúdo.

A toolbox deve:

1. congelar o Range antes de perder o foco;
2. aplicar a ação ao Range salvo;
3. restaurar Range/caret quando fizer sentido;
4. não depender de `window.getSelection()` ainda estar visualmente ativo.

### 5.3 Indicador de escopo na UI

Adicionar indicador compacto na aba Conteúdo:

```text
ESCOPO: TRECHO
ESCOPO: BLOCO
ESCOPO: CARET
```

Tooltips:

- **Trecho** — “a formatação será aplicada apenas ao texto selecionado.”
- **Bloco** — “sem trecho selecionado, a formatação afeta o elemento textual inteiro.”
- **Caret** — “você está digitando neste ponto; selecione um trecho para formatar só uma parte.”

---

# PARTE C — FORMATAÇÃO INLINE POR TRECHO

## 6. InlineFormatEngine

Substituir a lógica simples `extractContents() → span` por um formatter seguro.

### 6.1 Propriedades consideradas inline

Quando `mode === 'range'`, aplicar somente ao trecho:

```text
font-family
font-size
font-weight
font-style
text-decoration-line
color
background-color
letter-spacing
line-height
text-transform
```

### 6.2 Propriedades de bloco

Continuam atuando no elemento inteiro mesmo havendo Range:

```text
text-align
```

Outros controles de Layout/Visual permanecem no elemento, nunca no fragmento textual.

### 6.3 Criação de text runs

Trechos segmentados pelo editor devem usar:

```html
<span data-ie-text-run="1" style="...">trecho</span>
```

O atributo é de autoria do editor e deve ser tratado pelo serializer/Clean Build conforme contrato.

### 6.4 Não envolver blocos dentro de span

O engine deve operar por **text nodes**, não por um único `extractContents()` envolvendo tudo.

Algoritmo recomendado:

1. coletar text nodes intersectados pelo Range;
2. quebrar os text nodes nas fronteiras exatas da seleção;
3. para cada fragmento textual selecionado:
   - reutilizar run compatível quando possível;
   - senão criar `span[data-ie-text-run]`;
4. aplicar a propriedade somente aos runs selecionados;
5. normalizar DOM após operação.

### 6.5 Preservar semântica existente

Não destruir:

```html
<strong>
<em>
<a>
<mark>
<small>
```

Exemplo:

```html
<p>Texto <strong>muito importante</strong> aqui</p>
```

Selecionar apenas `importante` e mudar cor deve resultar em estrutura equivalente a:

```html
<strong>muito <span data-ie-text-run="1" style="color:...">importante</span></strong>
```

Não remover o `<strong>`.

### 6.6 Normalização obrigatória

Após cada operação:

- remover spans vazios;
- remover `data-ie-text-run` sem estilo útil;
- unir runs adjacentes com estilos idênticos;
- evitar aninhamento desnecessário de runs do editor;
- quando possível, mover propriedade para run existente em vez de criar outro;
- chamar `Node.normalize()` no bloco editado onde seguro.

### 6.7 Toggle em seleção parcial

Para B / I / U:

- se todo o Range já estiver com o estilo, remover apenas daquele Range;
- caso contrário, aplicar ao Range inteiro;
- texto fora do Range não muda.

### 6.8 Alteração sucessiva da mesma seleção

Selecionar uma palavra e aplicar:

```text
negrito
cor
tamanho
```

não deve produzir três spans aninhados.

Esperado:

```html
<span data-ie-text-run="1" style="font-weight:700;color:...;font-size:...">palavra</span>
```

ou estrutura semanticamente equivalente e normalizada.

---

# PARTE D — COMPORTAMENTO SEM RANGE

## 7. Regra de escopo quando não há trecho selecionado

### 7.1 `block`

Se o elemento está selecionado mas não existe caret/range dentro dele:

- formatação textual afeta o bloco inteiro;
- comportamento compatível com versões anteriores.

### 7.2 `caret`

Nesta versão, controles tipográficos com caret colapsado **não criarão estado de estilo para texto futuro**.

Para evitar comportamento implícito e complexo:

- se o caret está presente e não há Range, controles de formatação aplicam ao bloco textual inteiro;
- UI informa “Selecione um trecho para formatar apenas parte do texto”.

**Non-goal v1.5.3:** implementar “typing style state” tipo Google Docs/Word para texto futuro.

Isso pode entrar numa versão posterior.

---

# PARTE E — EDIÇÃO DIRETA

## 8. Remover necessidade dos botões de entrada em edição

### 8.1 Remover da UX principal

Remover ou ocultar:

```text
Editar texto na página
Editar texto do botão
```

Esses controles deixam de ser necessários.

### 8.2 Substituição útil

Opcionalmente substituir por:

```text
Selecionar todo o texto
```

Ação:

- seleciona todo o conteúdo textual do elemento atual;
- útil para formatar o bloco inteiro via Range ou substituir todo o texto.

Essa ação não deve ser necessária para edição normal.

---

# PARTE F — TAB ENTRE ELEMENTOS EDITÁVEIS

## 9. TextNavigationController

### 9.1 Tab

Quando o foco está dentro de um elemento textual da página em modo de edição:

```text
Tab
→ commit da edição corrente
→ próximo elemento textual editável
→ selecionar elemento
→ ativar contenteditable
→ foco no elemento
→ caret no início
```

### 9.2 Shift + Tab

```text
Shift + Tab
→ elemento textual editável anterior
→ caret no fim
```

### 9.3 Não interferir na toolbox

Se o foco estiver dentro de:

```text
#ie-toolbar
modal
snackbar
input/select/button da UI
```

Tab mantém comportamento de acessibilidade/foco da UI.

### 9.4 Ordem de navegação

Usar **ordem semântica do DOM**, não coordenadas visuais.

Isso torna o comportamento:

- determinístico;
- previsível;
- compatível com acessibilidade;
- independente de layouts flex/grid responsivos.

### 9.5 Unidade de navegação

Não navegar por todo `<span>`, `<strong>` ou run interno.

Criar conceito de **Text Navigation Root**.

Priorizar:

```text
h1-h6
p
li
blockquote
figcaption
label
a
button
td/th
```

Spans/strong/em só entram como unidade se forem textos standalone sem ancestral textual principal elegível.

Excluir sempre:

```text
span[data-ie-text-run]
elementos ocultos
runtime/editor
svg
scripts/styles
inputs não textuais
```

### 9.6 Scroll

Se o próximo elemento estiver fora da viewport:

```js
scrollIntoView({block:'center',behavior:'smooth'})
```

Mas:
- não iniciar navegação de links;
- não mover elementos da landing;
- respeitar `prefers-reduced-motion` usando `auto` quando necessário.

---

# PARTE G — INTERAÇÃO COM MULTISELEÇÃO

## 10. Multiseleção

A edição direta por caret/Range só existe com **uma seleção**.

Quando `selection().length > 1`:

- nenhum elemento recebe `contenteditable`;
- seleção textual parcial fica desativada;
- formatação textual continua podendo ser aplicada em lote aos blocos completos, como já ocorre;
- indicador mostra:

```text
ESCOPO: 3 BLOCOS
```

Ctrl/Cmd + clique mantém funcionamento atual.

---

# PARTE H — HISTÓRICO E DIRTY STATE

## 11. Undo / redo

Cada ação deve ser atômica:

### Digitação

Continuar agrupando digitação por janela temporal usando `beginContinuous()`.

### Formatação de Range

Uma ação de toolbar = uma entrada de histórico profunda (`deep:true`) no elemento textual raiz.

Exemplo:

```text
selecionar palavra
→ clicar negrito
→ 1 undo
```

### Tab

Tab sozinho não cria histórico.

Antes de navegar:

```text
H.commitContinuous()
```

### Undo de fragmento

Undo precisa restaurar:

- conteúdo;
- spans/runs;
- estilos;
- elemento selecionado quando possível.

Não é obrigatório restaurar exatamente o mesmo Range visual após undo nesta versão.

---

# PARTE I — SERIALIZER / CLEAN BUILD

## 12. Persistência

HTML salvo precisa preservar:

- texto editado;
- `span` necessários para formatação parcial;
- estilos inline autorais dos runs;
- sem `contenteditable`;
- sem seleção/transientes.

### 12.1 `data-ie-text-run`

Duas opções aceitáveis para o HTML salvo pelo editor:

**Preferida:** preservar `data-ie-text-run="1"` no artefato editável para futuras edições.

No Clean Build:

- remover o atributo `data-ie-text-run`;
- preservar o `<span>` e seu estilo quando necessário.

### 12.2 Normalização antes de salvar

Antes da serialização:

- remover runs vazios;
- unir runs adjacentes equivalentes;
- remover runs sem estilo;
- preservar estrutura semântica original.

---

# PARTE J — UI / UX

## 13. Mudanças na aba Conteúdo

### Texto

Remover botão “Editar texto na página”.

Adicionar:

```text
[ Escopo: TRECHO ]
```

ou

```text
[ Escopo: BLOCO ]
```

Adicionar opcional:

```text
Selecionar todo o texto
```

### Tipografia

Todos os controles inline devem respeitar Range ativo:

- fonte;
- tamanho;
- peso;
- B/I/U;
- cor;
- marca-texto;
- altura de linha;
- espaçamento entre letras;
- text-transform.

`text-align` permanece propriedade de bloco.

### Color picker

Aproveitar esta rodada para corrigir o gap já identificado:

- `input` = preview ao vivo;
- `change` = commit;
- uma sessão de picker = uma operação de histórico;
- Range ativo continua sendo o alvo durante o picker.

---

# PARTE K — CASOS ESPECIAIS

## 14. Links e CTAs

- edição textual direta permitida;
- clique continua sem navegar automaticamente;
- snackbar não destrói Range;
- Tab deve incluir CTA como unidade textual editável;
- Enter dentro de CTA não deve acionar navegação acidental.

## 15. Células de tabela

- conteúdo da célula pode ser editável;
- Range dentro de texto simples da célula funciona;
- se o Range atravessar múltiplos blocos dentro da célula, InlineFormatEngine deve processar text nodes separadamente;
- nunca envolver `<div>`, `<p>`, `<ul>` etc. dentro de um `<span>`.

## 16. Texto com markup existente

Testar explicitamente:

```text
strong
em
a
span original
br
small
sup/sub se existirem
```

A formatação do editor não pode destruir semântica ou href.

## 17. Quebras de linha

- Enter continua comportamento nativo do contenteditable;
- Shift+Enter continua quebra simples;
- não interceptar Enter salvo em ações/CTAs onde o navegador possa disparar ação;
- serializer deve manter resultado válido.

---

# PARTE L — TESTES / QA

## 18. Fixture dedicada

Adicionar fixture textual contendo:

1. H1 simples;
2. parágrafo longo;
3. parágrafo com `<strong>`;
4. parágrafo com `<em>`;
5. link inline;
6. CTA;
7. lista;
8. célula de tabela;
9. texto com `<br>`;
10. span standalone;
11. card com título + parágrafo;
12. dois textos consecutivos para testar Tab.

---

## 19. Gates obrigatórios — v1.5.3

### Boot

- [ ] G01 — runtime inicia sem erro JS;
- [ ] G02 — regressão v1.5.2 permanece PASS.

### Auto-edit

- [ ] G03 — primeiro clique em parágrafo ativa edição;
- [ ] G04 — caret fica no ponto clicado;
- [ ] G05 — digitar após primeiro clique altera texto imediatamente;
- [ ] G06 — botão “Editar texto” não é necessário;
- [ ] G07 — drag para selecionar texto preserva Range após mouseup/click.

### Range

- [ ] G08 — negrito em uma palavra altera somente a palavra;
- [ ] G09 — itálico em parte do texto altera somente o trecho;
- [ ] G10 — underline parcial;
- [ ] G11 — cor parcial;
- [ ] G12 — background/marca parcial;
- [ ] G13 — font-size parcial;
- [ ] G14 — font-family parcial;
- [ ] G15 — letter-spacing parcial;
- [ ] G16 — line-height parcial;
- [ ] G17 — text-transform parcial.

### Normalização

- [ ] G18 — 3 formatações sucessivas não criam 3 spans aninhados desnecessários;
- [ ] G19 — remover toggle de trecho não remove estilo fora do trecho;
- [ ] G20 — runs adjacentes idênticos são unidos;
- [ ] G21 — run sem estilo é removido/desembrulhado;
- [ ] G22 — nenhum bloco estrutural é colocado dentro de span.

### Markup existente

- [ ] G23 — seleção dentro de `<strong>` preserva `<strong>`;
- [ ] G24 — seleção dentro de link preserva `href`;
- [ ] G25 — seleção atravessando inline markup permanece válida.

### Tab

- [ ] G26 — Tab vai para próximo Text Navigation Root;
- [ ] G27 — Shift+Tab volta ao anterior;
- [ ] G28 — Tab não visita `span[data-ie-text-run]`;
- [ ] G29 — Tab dentro da toolbox continua navegação de UI normal;
- [ ] G30 — próximo elemento fora da viewport recebe scroll adequado.

### CTA / tabela

- [ ] G31 — CTA editável sem navegação acidental;
- [ ] G32 — texto parcial em TD/TH funciona sem DOM inválido.

### Histórico

- [ ] G33 — uma formatação de Range = um undo;
- [ ] G34 — undo/redo restaura trecho corretamente;
- [ ] G35 — Tab commita digitação antes da troca.

### Save / reopen

- [ ] G36 — salvar e reabrir preserva formatação parcial;
- [ ] G37 — HTML salvo não contém `contenteditable` transitório;
- [ ] G38 — reabrir no editor permite editar novamente o mesmo run.

### Landing real

- [ ] G39 — headline da landing: formatação parcial;
- [ ] G40 — texto de card: edição direta no primeiro clique;
- [ ] G41 — CTA: editar trecho sem navegar;
- [ ] G42 — Tab percorre textos reais da landing sem entrar na toolbox;
- [ ] G43 — mobile: seleção e edição direta continuam utilizáveis.

**Total: 43 gates.**

---

# PARTE M — ORDEM DE IMPLEMENTAÇÃO

## 20. Sequência obrigatória

1. congelar baseline v1.5.2 e rodar regressão;
2. criar `TextRangeController`;
3. ativação no `pointerdown`;
4. corrigir preservação de Range após click/drag;
5. implementar `InlineFormatEngine` por text nodes;
6. normalização de runs;
7. integrar controles de tipografia ao novo engine;
8. remover necessidade do botão Editar texto;
9. implementar `TextNavigationController`;
10. integrar links/CTA;
11. integrar tabela;
12. histórico profundo + dirty state;
13. serializer/normalização;
14. color picker live/coalescido;
15. fixture textual;
16. rodar 43 gates no template;
17. somente após PASS integrar na landing;
18. smoke desktop/mobile na landing;
19. gerar pacote/relatórios/hashes.

---

# PARTE N — NON-GOALS

## 21. Não entra na v1.5.3

- rich-text completo estilo ProseMirror/Tiptap;
- markdown;
- listas estruturais avançadas;
- mudança de H1 para H2/P via toolbar;
- comentários;
- colaboração;
- spellchecker próprio;
- typing-style state para texto futuro com caret colapsado;
- edição simultânea de Range em múltiplos blocos;
- seleção textual atravessando dois elementos raíz diferentes;
- alteração do GeometryController;
- alteração do BoxModelController;
- novos efeitos visuais.

---

# PARTE O — ENTREGÁVEIS

## 22. Arquivos finais

```text
INLINE_EDITOR_PACK_v1.5.3.zip
INLINE_EDITOR_PACK_v1.5.3/
  INLINE_EDITOR_TEMPLATE.html
  SKILL.md
  CHANGELOG.md
  QA_MATRIX.md
  VALIDATION_REPORT.md
  TEXT_RANGE_AUDIT.md
  VERSION.json
  src/...
  tests/...
  qa/...

rotina-empreendedora-selvagem-EDITAVEL-v1.5.3.html
```

---

## 23. Critério de conclusão

A task só pode ser considerada concluída quando:

```text
[ ] baseline v1.5.2 sem regressão
[ ] 43/43 gates v1.5.3 PASS
[ ] template canônico homologado
[ ] landing real homologada desktop/mobile
[ ] save/reopen testado
[ ] ZIP testzip() = None
[ ] hashes internos conferidos
```

Não declarar conclusão com QA parcial.

---

## 24. Regra de ouro da v1.5.3

> **O usuário não deve pensar em “editar o elemento”. Ele deve clicar no texto e editar. Se selecionar uma palavra, a toolbox atua na palavra; se não selecionar trecho, atua no bloco.**
