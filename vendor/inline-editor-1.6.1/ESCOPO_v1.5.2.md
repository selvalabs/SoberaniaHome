# ESCOPO — INLINE_EDITOR_PACK v1.5.2

## 1. Objetivo da rodada

Corrigir e endurecer a funcionalidade de **Espaçamento / Box Model** do Inline Editor, preservando a estabilidade da v1.5.1 e evitando que ajustes visuais simples destruam intenção responsiva, unidades relativas ou comportamentos de layout do HTML hospedeiro.

Esta rodada é deliberadamente **cirúrgica**. Não deve reescrever GeometryController, EffectsEngine, SelectionEngine, multiseleção geral ou mobilidade, exceto quando estritamente necessário para integrar o novo BoxModelController.

---

## 2. Baseline obrigatória

Partir exclusivamente de:

- `INLINE_EDITOR_PACK_v1.5.1`
- `rotina-empreendedora-selvagem-EDITAVEL-v1.5.1.html`

A v1.5.1 permanece preservada e imutável como baseline homologada.

A nova implementação será construída em pasta independente:

```text
INLINE_EDITOR_PACK_v1.5.2/
```

---

## 3. Problemas confirmados na auditoria

### 3.1 Uso agressivo de `!important`

Hoje alterações de padding/margin podem escalar para `!important`, vencendo media queries e regras responsivas do HTML hospedeiro.

**Risco:** uma decisão feita no desktop pode congelar o mesmo espaçamento no mobile.

### 3.2 Perda de `margin:auto`

Valores `auto` são lidos como medidas computadas em pixels.

Exemplo:

```text
margin-left:auto
margin-right:auto
```

pode aparecer na toolbox como algo como:

```text
204px / 204px
```

Ao editar, a intenção de centralização é perdida.

### 3.3 Achatamento de unidades responsivas

Valores definidos como `%`, `rem`, `em`, `vw`, `vh`, `clamp()`, `calc()` etc. podem ser exibidos apenas como pixels computados.

Exemplo:

```css
padding-left: 10%;
```

pode aparecer como:

```text
80.8px
```

Editar esse campo converte silenciosamente uma regra fluida em px fixo.

### 3.4 Stepper incorreto em multiseleção com valores diferentes

Com seleção múltipla:

```text
A = 10px
B = 30px
```

se o campo está em estado misto e o usuário clica `+1`, a operação não pode normalizar ambos para `1px`.

Comportamento esperado:

```text
A = 11px
B = 31px
```

Ou, caso a operação relativa não seja suportada naquele contexto, o stepper deve ficar bloqueado até o usuário definir valor comum explícito.

### 3.5 Margin vertical em elemento inline

Em elementos `display:inline`, `margin-top` e `margin-bottom` normalmente não deslocam o elemento como o usuário espera.

Hoje o editor aceita a alteração sem explicar que o efeito visual pode ser nulo.

### 3.6 Margin em células de tabela

Aplicar margin em `td/th` não é uma ferramenta confiável para deslocar uma célula dentro da tabela.

O controle deve ser contextualizado ou desabilitado.

### 3.7 Toggle “Vincular lados” vaza entre seleções

O estado do toggle pode permanecer ativo ao trocar de elemento, criando risco de alterar quatro lados sem intenção.

### 3.8 Min/max declarados mas não aplicados pelo runtime

O input pode declarar `max=2000`, mas ainda aceitar e aplicar valores como `5000` se o usuário digitar manualmente.

### 3.9 Ausência de `gap`

Containers `flex` e `grid` deveriam oferecer `gap`, `row-gap` e `column-gap` como ferramenta de primeira classe, evitando uso indevido de margin entre filhos.

---

# 4. Arquitetura nova — BoxModelController

Criar um controlador único responsável por:

```text
padding
margin
gap
row-gap
column-gap
unidades
auto
valores mistos
steppers
vinculação de lados
validação
contexto do elemento
reset local
histórico
serialização
```

Nome recomendado:

```js
BoxModelController
```

O controlador deve substituir handlers dispersos da subaba Espaçamento.

---

# 5. Modelo semântico de valor

A toolbox não deve tratar espaçamento apenas como `number`.

Cada valor deve poder representar:

```js
{
  kind: 'length' | 'auto' | 'expression' | 'mixed',
  value: number | null,
  unit: 'px' | '%' | 'rem' | 'em' | 'vw' | 'vh' | null,
  raw: string,
  source: 'inline' | 'stylesheet' | 'computed' | 'authored'
}
```

## 5.1 `length`

Exemplos:

```text
24px
1.5rem
10%
2vw
```

## 5.2 `auto`

Aplicável principalmente a margin.

A interface deve exibir explicitamente:

```text
AUTO
```

Nunca converter `auto` para pixels só porque o navegador fornece um valor computado.

## 5.3 `expression`

Exemplos:

```text
calc(...)
clamp(...)
min(...)
max(...)
var(...)
```

A v1.5.2 **não precisa criar um editor visual completo de expressões**, mas deve:

- detectar;
- preservar;
- exibir o valor bruto;
- avisar antes de substituí-lo por valor fixo.

## 5.4 `mixed`

Usado em multiseleção quando os elementos possuem valores diferentes.

Exibir:

```text
— valores diferentes —
```

Sem inventar um número-base.

---

# 6. Estratégia de leitura do valor original

Ordem de prioridade:

1. valor authored pelo próprio editor;
2. valor inline existente;
3. regra CSS aplicável quando for possível identificar valor semântico;
4. computed style apenas como fallback visual.

Sempre que o valor exibido for apenas computado, a UI deve indicar:

```text
Calculado
```

ou tooltip equivalente.

Objetivo: impedir que o usuário confunda um resultado do layout com a regra original.

---

# 7. Unidades

Cada campo de comprimento deve possuir seletor de unidade quando aplicável:

```text
px
%
rem
em
vw
vh
```

### Regras

- preservar a unidade original ao abrir o campo;
- stepper trabalha na unidade atual;
- trocar unidade deve converter usando o contexto atual quando possível;
- se conversão não puder ser determinada com segurança, pedir confirmação e usar equivalência computada atual;
- padding não aceita `auto`;
- margin aceita `auto`;
- valores negativos são permitidos em margin, não em padding;
- `%` deve seguir semântica CSS real do elemento/container.

---

# 8. Interface da subaba Espaçamento

Reorganizar para linguagem visual clara.

## 8.1 Espaço interno

```text
ESPAÇO INTERNO

        ↑ 24 px
← 24 px       24 px →
        ↓ 24 px

[ Vincular 4 lados ]
[ Restaurar interno ]
```

Tooltip:

> Espaço entre o conteúdo deste elemento e sua própria borda.

## 8.2 Espaço externo

```text
ESPAÇO EXTERNO

        ↑ 12 px
← AUTO         AUTO →
        ↓ 12 px

[ Vincular 4 lados ]
[ Restaurar externo ]
```

Tooltip:

> Espaço entre este elemento e os elementos ao redor.

## 8.3 Espaço entre filhos

Exibir somente quando o elemento selecionado for container `flex` ou `grid`.

```text
ESPAÇO ENTRE ITENS

Gap geral        16 px
Horizontal       16 px
Vertical         12 px

[ Vincular H/V ]
[ Restaurar gap ]
```

Mapeamento CSS:

```text
gap
column-gap
row-gap
```

---

# 9. Steppers

Todos os valores numéricos da área devem usar o padrão já adotado no editor:

```text
[ − ] [ valor ] [ + ] [ unidade ]
```

Comportamento:

- clique: ±1 unidade;
- Shift + clique / Shift + seta: ±10;
- segurar botão: repetição progressiva;
- ArrowUp / ArrowDown no input;
- clamp real pelo runtime;
- nunca aplicar valor fora da faixa permitida.

## 9.1 Multiseleção com valor misto

Stepper deve operar relativamente:

```text
10px + 1 => 11px
30px + 1 => 31px
```

Isso precisa acontecer elemento por elemento.

Ao digitar explicitamente `20`, o usuário está normalizando o conjunto:

```text
10px => 20px
30px => 20px
```

---

# 10. Vincular lados

O estado de vinculação deve ser **local à seleção/contexto**, não global acidental.

Regras:

- ao selecionar outro elemento, resetar para OFF por padrão;
- exceção futura pode existir via preferência explícita, mas não nesta versão;
- quando ligado, o estado precisa ser visualmente forte;
- tooltip deve explicar que alterar um lado alterará os quatro;
- em multiseleção, vínculo aplica a lógica a cada elemento separadamente.

---

# 11. Tratamento contextual por display/tag

## 11.1 `display:inline`

Ao selecionar inline:

- padding permanece permitido;
- margin-left/right permanece permitido;
- margin-top/bottom deve ficar desabilitado ou com warning explícito.

Mensagem sugerida:

> Espaçamento externo vertical normalmente não desloca elementos inline. Use altura da linha, transforme em inline-block ou edite o container.

Não converter automaticamente para `inline-block`.

## 11.2 `td/th`

Em células de tabela:

- padding permitido;
- margin desabilitado;
- direcionar para `Tabela` quando o objetivo for tamanho/posição estrutural.

Mensagem:

> Margem não reposiciona células de tabela de forma confiável. Use espaço interno ou os controles de tabela.

## 11.3 Flex/Grid

Ao selecionar container flex/grid:

- mostrar Gap;
- indicar quando margins nos filhos podem estar competindo com gap;
- não remover margins automaticamente.

## 11.4 Elementos absolute/fixed

Padding/margin continuam permitidos, mas tooltip deve diferenciar margin de `top/left/X/Y`.

---

# 12. Estratégia para `!important`

A v1.5.2 não deve chamar `strong:true` automaticamente para padding/margin.

Fluxo obrigatório:

1. aplicar estilo inline sem priority;
2. medir se o computed style corresponde ao valor solicitado;
3. se a regra do host continuar vencendo:
   - identificar conflito;
   - exibir aviso;
   - oferecer explicitamente `Forçar neste breakpoint` / `Forçar regra`;
4. somente após ação explícita usar `!important`.

Nunca promover silenciosamente para `!important`.

### Responsividade

Se uma regra responsiva do host estiver sendo vencida pelo override, informar:

> Este valor forçado pode prevalecer em outros tamanhos de tela.

Não implementar editor completo por breakpoint nesta rodada.

---

# 13. Valores fluidos e expressions

Ao detectar:

```text
%
rem
em
vw
vh
calc()
clamp()
var()
```

não converter silenciosamente para px.

Se o usuário trocar por um valor numérico diferente, apresentar aviso leve:

> Esta propriedade usa uma medida responsiva. Alterar para px pode mudar o comportamento em outras telas.

Opções:

```text
Cancelar
Aplicar mantendo unidade
Converter para px
```

Quando aplicável.

---

# 14. Reset local de espaçamento

Adicionar:

```text
Restaurar espaço interno
Restaurar espaço externo
Restaurar gap
```

Cada ação deve restaurar o baseline capturado pelo `BaselineManager`, sem resetar:

- texto;
- cores;
- posição;
- efeitos;
- imagem;
- demais propriedades do elemento.

Reset local deve:

- pedir confirmação apenas se houver múltiplas propriedades relevantes alteradas;
- entrar no undo/redo;
- marcar dirty state.

---

# 15. Undo / Redo / Dirty State

Toda operação de box model deve obedecer:

```text
1 gesto = 1 operação no histórico
```

Exemplos:

- digitar um valor e confirmar = 1 operação;
- segurar `+` por 2 segundos = 1 operação consolidada;
- alterar quatro lados vinculados = 1 operação;
- alterar multiseleção = 1 operação batch;
- reset local = 1 operação.

Dirty state deve mudar para `true` após qualquer mudança efetiva.

---

# 16. Serialização

O HTML salvo precisa preservar semanticamente:

```text
margin:auto
10%
1.5rem
calc(...)
gap
row-gap
column-gap
```

Não converter tudo para pixels no Serializer.

Remover somente metadados transitórios da UI, preservando decisões authored.

---

# 17. Clean Build

A futura limpeza para deploy deve:

- preservar os valores semânticos escolhidos;
- preservar `auto`;
- preservar unidades;
- preservar gap;
- remover apenas runtime/toolbox/metadados temporários;
- nunca recalcular espaçamentos durante o Clean Build.

---

# 18. Compatibilidade com GeometryController

Não reescrever GeometryController v1.5.1.

Auditar apenas interações inevitáveis:

- margin afetando cálculo de posição;
- padding alterando box size;
- resize com `box-sizing`;
- gap alterando bounding box do container;
- movement preview após mudança de margin.

Após alteração de Box Model:

```text
OverlayManager.update()
GeometryController deve ler a geometria nova apenas no próximo gesto.
```

Não manter caches geométricos antigos após mutação do box model.

---

# 19. Multiseleção — contrato detalhado

Para cada propriedade:

### Todos iguais

Mostrar valor normalmente.

### Valores diferentes, mesma unidade

Mostrar:

```text
— vários — px
```

Stepper = operação relativa.

### Valores diferentes e unidades diferentes

Mostrar:

```text
— unidades diferentes —
```

Stepper bloqueado.

Usuário pode:

- digitar valor comum + unidade para normalizar;
- cancelar;
- opcionalmente converter para unidade comum explicitamente.

### `auto` misturado com length

Exibir:

```text
— auto + valores —
```

Stepper bloqueado até normalização explícita.

---

# 20. Tooltips / ajuda

Atualizar Help Modal com seção **Espaçamento** explicando de modo leigo:

- Espaço interno / padding;
- Espaço externo / margin;
- Auto;
- Gap;
- unidades relativas;
- diferença entre margin e mover elemento;
- comportamento em tabela;
- comportamento inline;
- por que o editor avisa ao substituir valores responsivos.

Todos os novos toggles, unidades, estados `AUTO`, `Calculado`, `Vários` e ações de force devem ter tooltip estilizado.

Sem `title` nativo duplicado.

---

# 21. QA dedicado — Box Model Matrix

A v1.5.2 só pode ser homologada após uma matriz dedicada além dos testes de regressão da v1.5.1.

## Gate 01 — Boot

- runtime inicia sem erro;
- toolbox abre;
- subaba Espaçamento carrega.

## Gate 02 — Padding individual

- top/right/bottom/left separados;
- valores persistem após blur.

## Gate 03 — Padding vinculado

- um lado altera quatro;
- undo restaura os quatro atomicamente.

## Gate 04 — Margin individual

- quatro lados independentes;
- negativos válidos.

## Gate 05 — Margin vinculado

- quatro lados juntos;
- undo atômico.

## Gate 06 — `margin:auto`

- auto é detectado;
- exibido como AUTO;
- salvo/reaberto como auto.

## Gate 07 — Centralização por auto

- `margin-left:auto; margin-right:auto` não vira px;
- centralização permanece após save/reopen.

## Gate 08 — Unidade `%`

- 10% abre como 10%;
- editar para 12% preserva `%`.

## Gate 09 — `rem`

- preservação de rem;
- stepper opera em rem.

## Gate 10 — `em`

- preservação de em.

## Gate 11 — viewport units

- vw/vh preservados.

## Gate 12 — `calc/clamp/var`

- reconhecidos como expression;
- não achatados automaticamente.

## Gate 13 — Conversão explícita

- converter unidade apenas após ação do usuário.

## Gate 14 — Responsive host CSS

- edição normal não injeta `!important` silencioso;
- media query continua podendo vencer quando apropriado.

## Gate 15 — Forçar regra

- conflito real pode ser explicitamente forçado;
- warning aparece.

## Gate 16 — Inline element

- margin vertical bloqueada/avisada;
- padding e horizontal margin seguem funcionais.

## Gate 17 — Table cell

- padding funciona;
- margin indisponível;
- link para controles de tabela funciona.

## Gate 18 — Flex gap

- gap geral funciona;
- row/column gap funcionam.

## Gate 19 — Grid gap

- gap funciona em grid.

## Gate 20 — Toggle vínculo por seleção

- selecionar outro elemento reseta vínculo para OFF.

## Gate 21 — Clamp

- entrada > max não é aplicada;
- entrada < min não é aplicada;
- feedback visual claro.

## Gate 22 — Stepper single

- ±1;
- Shift ±10;
- hold repeat;
- teclado.

## Gate 23 — Multiselect iguais

- batch absoluto funciona.

## Gate 24 — Multiselect mistos mesma unidade

- stepper relativo preserva diferenças.

## Gate 25 — Multiselect unidades distintas

- stepper bloqueado;
- normalização explícita funciona.

## Gate 26 — Multiselect auto + length

- estado misto reconhecido;
- nenhuma conversão silenciosa.

## Gate 27 — Reset interno

- só padding restaura.

## Gate 28 — Reset externo

- só margin restaura.

## Gate 29 — Reset gap

- só gap restaura.

## Gate 30 — Undo/redo

- todos os casos acima preservam atomicidade.

## Gate 31 — Dirty state

- mutação marca dirty;
- save limpa checkpoint.

## Gate 32 — Save/reopen

- auto/unidades/gap persistem semanticamente.

## Gate 33 — Geometry regression

- resize/move continuam estáveis após alteração de padding/margin.

## Gate 34 — Effects regression

- efeitos continuam funcionando depois de alterações de Box Model.

## Gate 35 — Desktop real landing

- testar cards, CTA, mockups e seções da landing real.

## Gate 36 — Mobile landing

- valores responsivos não são congelados indevidamente;
- UI da toolbox continua utilizável.

---

# 22. Test fixture obrigatória

Adicionar ao template canônico uma área específica de Box Model com:

```text
- block com px;
- block com %;
- block com rem;
- block centralizado com margin:auto;
- inline span;
- flex container com gap;
- grid container com row/column gap;
- table cell;
- regra responsiva com !important;
- calc()/clamp();
- três cards para multiseleção com valores diferentes.
```

Isso deve permanecer no template de homologação do pacote para regressões futuras.

---

# 23. Ordem de implementação

Executar nesta ordem:

1. congelar baseline v1.5.1;
2. criar test fixture Box Model;
3. implementar parser semântico de valores;
4. implementar BoxModelController sem alterar UI existente;
5. corrigir leitura `auto` / unidades / expressions;
6. corrigir aplicação sem `!important` automático;
7. implementar UI com unidade + AUTO;
8. implementar steppers robustos;
9. implementar comportamento mixed/multiselect;
10. implementar controles contextuais inline/table;
11. implementar gap flex/grid;
12. implementar reset local;
13. integrar history/dirty/serializer;
14. atualizar tooltips/help;
15. executar 36 gates no template;
16. corrigir até 36/36 PASS;
17. integrar no HTML da landing v1.5.1 limpa;
18. smoke desktop/mobile na landing;
19. gerar pacote v1.5.2;
20. validar ZIP/hashes.

---

# 24. Non-goals desta rodada

Não adicionar nesta versão:

- editor por breakpoint completo;
- custom CSS textarea;
- editor de CSS variables genérico;
- drag-and-drop de seções;
- novos efeitos;
- novas classes de animação;
- alterações no motor de mobilidade além de regressão;
- reformulação visual da toolbox;
- alterações em multiseleção fora do necessário para Box Model;
- CMS/backend.

---

# 25. Entregáveis finais

A rodada deve produzir:

```text
INLINE_EDITOR_PACK_v1.5.2.zip
INLINE_EDITOR_PACK_v1.5.2/
├── INLINE_EDITOR_TEMPLATE.html
├── SKILL.md
├── CHANGELOG.md
├── README.md
├── QA_MATRIX.md
├── VALIDATION_REPORT.md
├── BOX_MODEL_AUDIT.md
└── testes/reprodutores necessários

rotina-empreendedora-selvagem-EDITAVEL-v1.5.2.html
```

---

# 26. Critério de aceite

A versão só pode ser chamada de `v1.5.2` final se:

```text
[ ] 36/36 gates PASS
[ ] zero erro JS no boot
[ ] auto preservado
[ ] unidades relativas preservadas
[ ] sem !important silencioso em padding/margin
[ ] multiselect mixed correto
[ ] inline/table contextuais
[ ] gap flex/grid funcionando
[ ] save/reopen sem achatamento para px
[ ] resize/move sem regressão
[ ] desktop real PASS
[ ] mobile real PASS
[ ] ZIP testzip() = None
```

Se qualquer gate falhar, o status deve permanecer:

```text
BUILD / QA PENDING
```

Nunca entregar como homologado apenas porque o HTML abriu.

---

# 27. Regra de ouro da v1.5.2

> **O editor deve alterar a intenção de espaçamento do usuário — não apenas o valor computado que o navegador mostrou naquele instante.**

A prioridade desta versão é preservar semântica, responsividade e previsibilidade do Box Model.
