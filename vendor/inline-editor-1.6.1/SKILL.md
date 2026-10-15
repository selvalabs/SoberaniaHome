# Inline Editor Pack — 1.6.1

## 1. Finalidade e fonte de verdade

Adicionar uma camada temporária de autoria visual a um **HTML existente**, sem reconstruir a landing ou converter o projeto em CMS/page builder. A baseline desta rodada é a v1.6.0, preservada. O contrato atual está em `ESCOPO_v1.6.1.md` (Delete & Smart Reflow). `ESCOPO_v1.6.0.md` registra Ajuda, Sobre e clareza de ações. `ESCOPO_v1.5.4.md` registra duplicação estrutural e comentários de autoria/LLM. `ESCOPO_v1.5.3.md` registra edição textual por Range/Tab; `ESCOPO_v1.5.2.md` registra o Box Model preservado; `ESCOPO_v1.5.md` registra a expansão anterior.

O template canônico é `INLINE_EDITOR_TEMPLATE.html`. As fontes e fragmentos compilados estão em `src/`. **Não recriar uma toolbox aproximada a partir desta descrição.** Integrar os blocos canônicos e adaptar somente conflitos demonstrados por teste. A tentativa parcial anterior da v1.5 não é fonte de código ou evidência desta entrega.

## 2. Contrato de integração

1. Trabalhar sobre a landing oficial limpa ou sobre um Clean Build que conserve as edições do usuário. Preservar uma cópia antes de qualquer alteração.
2. Confirmar que não existem outro runtime do editor, IDs do editor repetidos ou listeners concorrentes de manipulação.
3. Inserir `src/head.fragment.html` antes de `</head>` e `src/body.fragment.html` antes de `</body>`.
4. Nunca copiar o conteúdo entre `SITE-DEMO:START/END` do template para a landing.
5. Não reescrever copy, links, seções, idiomas, imagens, identidade ou CSS/JS de produção para “melhorar” a página durante a integração.
6. Manter os assets já incorporados ao HTML. O integrador não transforma recursos externos em Data URI automaticamente.
7. Validar o template; depois validar a landing real. Sintaxe válida e arquivo que abre não equivalem a funcionalidade homologada.

O script `tools/integrate.mjs` automatiza a integração em HTMLs completos sem editor e recusa uma entrada já editável para evitar duplicidade.

### Marcadores

- `IE-AUTHORED:START/END`: suporte de produção para decisões visuais e efeitos.
- `INLINE-EDITOR:HEAD:START/END`: CSS exclusivo da autoria.
- `INLINE-EDITOR:BODY:START/END`: interface e runtime exclusivo da autoria.
- `[data-ie-runtime]`: interface, overlays, modais e script/CSS temporários.
- `[data-ie-authored]` e os metadados descritos abaixo: decisões que precisam sobreviver ao Clean Build.

## 3. Interface

A paleta usa as variáveis do host quando disponíveis: `--paper`, `--cream`, `--ink`, `--muted`, `--plum`, `--plum-deep`, `--lilac`, `--line` e `--sans`. Há fallbacks legíveis. Os estilos são restritos à UI; não definem um tema novo para a landing.

A toolbox abre pelo botão **Editar página**. Possui cabeçalho arrastável, minimizar, fechar, ajuda, status de alterações, **Salvar editável**, **Reset**, **↑ Pai**, **↓ Filho**, breadcrumb e modo de multiseleção.

As cinco abas principais contêm 25 subabas:

| Aba | Subabas |
|---|---|
| Conteúdo | Texto; Tipografia; Link / CTA; Mídia |
| Layout | Tamanho; Espaçamento; Alinhamento; Posição; Tabela; Grupo |
| Visual | Fundo; Bordas; Sombra; Filtros; Mídia; Transparência |
| Efeitos | Hover; Entrada; Contínuo; Interação |
| Mais | Selos & detalhes; Elemento; Comentários; Histórico; Avançado |

Apenas a subaba ativa ocupa o painel. Opções incompatíveis permanecem identificáveis e explicam o contexto necessário. Tabs/subtabs têm navegação por setas e ARIA. A ajuda usa tooltip estilizado, sem `title` nativo duplicado. No mobile, a toolbox é um painel inferior minimizável.

## 4. Seleção e conteúdo

Clique seleciona; Ctrl/Cmd + clique adiciona/remove elementos; **Selecionar vários** fornece a alternativa de toque. Alt + clique prioriza estruturas. Há seleção primária e conjunto de seleção, com outlines individuais e caixa do grupo. Pai/filho sobrepostos são normalizados para não movimentar o mesmo conteúdo duas vezes.

**↑ Pai** sobe na hierarquia. **↓ Filho** seleciona o único filho significativo ou abre um seletor dos filhos diretos. Scripts, estilos, formulários sensíveis, head, iframes, canvas e a própria interface não viram conteúdo editável. SVG é tratado como peça única.

Texto pode ser editado diretamente, com formatação por seleção textual ou bloco. Tipografia reúne fonte, tamanho, peso, altura de linha e espaço entre letras. A edição em lote aceita formatação, mas não substitui silenciosamente textos, destinos ou arquivos de vários itens. Campos mistos indicam valores diferentes.

Para texto, geometria e aparência, o StyleEngine mantém seu comportamento anterior. **Espaçamento usa exclusivamente o BoxModelController:** não deve passar por StyleEngine.set, pois esse caminho pode promover importância automaticamente. Espaçamento só recebe !important após confirmação explícita. Nunca retirar em massa os `!important` da landing.

## 5. Geometria e grupo

Existe **um GeometryController** e uma sessão de ponteiro para mover/redimensionar. Não adicionar listeners concorrentes sobre o grab.

- Oito handles. Cantos respeitam o lock de proporção; lados alteram um eixo. Largura e altura numéricas são independentes e têm retorno para `auto`.
- O último frame aplicado é o estado final. `pointerup` não recalcula dimensões ou proporções.
- Um gesto gera uma entrada no histórico; Escape/pointercancel cancelam e restauram.
- Shift escolhe e trava um eixo depois do limiar de movimento. O snapping não pode alterar o eixo bloqueado. Alt ignora snap temporariamente.
- Guias usam pai, irmãos próximos e centro do viewport; o badge mostra tamanho ou deslocamento.
- Elementos do fluxo usam deslocamento autoral; elementos absolutos/fixos usam offsets. Nunca converter automaticamente o fluxo inteiro em absolute.
- Transforms e animações originais são preservados. As animações podem ser pausadas apenas durante a manipulação e retomadas depois.
- A grade 3×3 de posição aparece apenas para absolute/fixed.
- Imagens podem ser alinhadas à esquerda, centro ou direita; alinhamento vertical só é habilitado quando o contexto suporta.
- Grupo: seis alinhamentos, distribuir horizontal/vertical, distância uniforme e mover junto. Distribuição/alinhamento de grupo exige o mesmo pai; o editor bloqueia em vez de adivinhar outro sistema de coordenadas.
- Tabelas: largura da coluna inteira e altura da linha. `colspan/rowspan` bloqueiam o resize estrutural ambíguo.

Essas operações não são um sistema de reflow automático ou reordenação de seções. O usuário ainda deve revisar os outros tamanhos de tela depois de mover elementos.

## 6. Visual e efeitos

**Visual** oferece sólido, gradiente de duas cores/ângulo/transparência, imagem de fundo e véu; borda principal, borda interna por inset-shadow e borda externa por outline; sombras adicionais; brilho, contraste, saturação, grayscale, blur; enquadramento e drop-shadow de mídia; opacidade.

O ShadowComposer mantém a sombra original + borda interna + sombra adicional. O FilterComposer mantém filtros originais + ajustes visuais + drop-shadow. Canais registrados de animação são compostos sobre essas decisões: alterar um efeito não apaga a sombra do host e um `!important` de aparência não neutraliza o brilho animado.

São **48 presets**: 16 hover, 14 entrada, 13 contínuos e 5 interação/press. Cada classe tem intensidade 0–100, duração, prévia e remoção própria. Entrada tem espera adicional. Giro contínuo completa 360°; intensidade regula sua velocidade sem criar quebra na volta. Respeitar `prefers-reduced-motion`.

`data-ie-effects`, `data-ie-visual`, `data-ie-bg-config`, variáveis CSS autorais e classes de deslocamento compõem o estado persistente. O runtime `IEAuthored` reconstrói efeitos ao reabrir. Propriedades transitórias derivadas das animações são normalizadas ao serializar, para não se acumularem a cada salvamento.

## 7. Selos & detalhes

Esta é a apresentação leiga de `::before` e `::after`. Selecionar o elemento dono do selo e abrir **Mais → Selos & detalhes → Antes do conteúdo / Depois do conteúdo**. Editar texto, cores, fonte, espaço, cantos e deslocamento. O CSS gerado usa uma chave específica do alvo, com conteúdo escapado.

Não transformar automaticamente pseudo-elementos em outros nós da landing. Não confundir o selo do CSS com o texto principal do card.

## 8. Histórico, reset e proteção

Snapshots por elemento preservam atributos e conteúdo quando necessário; o histórico não substitui `body.innerHTML`. Operações de lote, drag, resize, sliders e steppers pressionados são agrupadas.

**Reset** captura uma baseline antes da primeira mutação da sessão, solicita confirmação e restaura o estado real; pode ser desfeito. **Mais → Histórico → Resetar sessão** exige duas confirmações. Reabrir um HTML salvo inicia nova sessão e nova baseline, a partir daquele arquivo.

Alterações reais marcam `dirty`. Fechar a toolbox pede confirmação quando necessário. Fechar/recarregar a página usa `beforeunload` nativo; texto personalizado e exibição universal não são garantidos pelos navegadores. CTAs/ações são interceptados durante edição e usam snackbar. Com alterações pendentes, o aviso oferece cancelar, salvar ou continuar.

## 9. Salvar / Clean Build

Salvar gera nova cópia HTML, com editor desativado e interfaces limpas. Preferir File System Access quando disponível; fallback Blob/download. Gravação cancelada não limpa o dirty state. Nova edição durante salvamento não perde o aviso. No fallback, “salvo” significa download iniciado; conferir o arquivo no navegador/disco.

Para Clean Build, o serviço `InlineEditor.serialize({clean:true})` remove runtime/UI da cópia, preservando decisões visuais, copy e código do site. Também é possível processar posteriormente o arquivo salvo conforme os marcadores.

**Não remover indiscriminadamente todo `data-ie-*` ou toda classe `ie-*`.** São necessários em produção, quando usados: `data-ie-effects`, `data-ie-effect-key`, `data-ie-visual`, `data-ie-bg-config`, `data-ie-decor`, `data-ie-decor-key`, a classe `ie-move-authored`, variáveis `--ie-move-*`/`--ie-base-translate-*` e o suporte `IE-AUTHORED`. IDs de histórico, seleção, contenteditable e infraestrutura `data-ie-runtime` são temporários. Normalização posterior pode substituir esses metadados por classes equivalentes, mas somente com teste de equivalência visual/comportamental.

Nunca alterar textos do usuário durante limpeza. Não remover scripts de analytics, checkout, tradução, formulários ou animações do host.

## 10. Testes e limites

Executar os **36 gates de Box Model e as regressões anteriores** em `QA_MATRIX.md`, não apenas `node --check`. Os testes e evidências estão no pacote. O gate 26 usa a landing real entregue separadamente.

A homologação desta versão cobre Chromium 144/Linux com emulação de viewport. Não atribuir resultado a Safari/Firefox ou dispositivos físicos que não foram testados. Transformações 2D comuns e pai escalado têm cobertura; não prometer edição geométrica genérica para cenas 3D/perspectiva complexa. Não há backend, colaboração, autosave remoto ou publicação automática.


## 11. Contrato de Box Model 1.5.2

`src/45-box-model.js` contém `BoxValue`, `BoxSourceResolver` e `BoxModelController`. O controlador é a fonte única dos handlers de **Layout → Espaçamento**. Os handlers antigos foram removidos; não adicionar um segundo caminho de escrita de padding/margin/gap.

### Estados e origem

Uma medida possui `kind` (length, auto, expression, mixed), valor, unidade, raw e origem (inline, stylesheet, computed, authored). A UI separa **No CSS**, **No HTML**, **Editado**, **Calculado**, **AUTO**, fórmulas e valores mistos. O computed style é informação de resultado, não substituto silencioso da declaração de origem.

O resolver cobre folhas legíveis, seletores usuais, especificidade :is/:not/:has/:where, @media e @supports. Declarações lógicas são mapeadas conforme a direção. Shorthands com var() são lidos do CSS serializado quando o CSSOM fornece longhands vazios. Cascatas que não podem ser identificadas com confiança — folhas inacessíveis, camadas, nesting/escopos não resolvidos — usam o estado **Calculado**, sem atribuir uma unidade original inventada. Não apresentar o resolver como DevTools universal.

### Edição e consentimento

Padding: quatro lados, sem negativos/auto. Margin: quatro lados, negativos e auto. Gap geral expande para row-gap/column-gap; ambos têm controles individuais e vínculo H/V. Gap aparece somente para seleção formada por containers flex/grid.

Unidades: px, %, rem, em, vw, vh. Valores relativos continuam relativos ao digitar na mesma unidade. Conversões preservam a equivalência atual quando ela é determinável; transformar uma medida relativa em px ou substituir AUTO/fórmula exige confirmação. Em contexto sem conversão segura, solicitar valor explícito, sem tentar adivinhar.

O ajuste ordinário é inline **sem prioridade**. A verificação é transacional: se o host bloqueia uma operação ou um lote, restaurar o estado anterior e oferecer Cancelar/Forçar regra. Forçar ainda exige diálogo com aviso de que !important afeta **todas as telas**. Não existe botão que prometa restrição a um breakpoint. Transições CSS não devem ser confundidas com conflito de prioridade.

Mesmo inline normal pode substituir media queries sem !important. Mostrar a orientação de revisar outras larguras; a v1.5.2 não implementa um editor por breakpoint.

### Steppers e multiseleção

−/+ e ArrowUp/ArrowDown operam ±1 na unidade atual, Shift ±10. Hold repete e acelera; um hold equivale a uma operação de histórico. A validação no runtime rejeita entradas fora de 0..2000 para padding/gap e −2000..2000 para margin, na unidade escolhida. Steppers param nos limites. Valores originais fora da faixa não são corrigidos ao selecionar.

Mesma unidade e valores distintos: incremento relativo por alvo e lado; 10/30px vira 11/31px. Digitação define valor comum. Unidades diferentes, auto misto, fórmula ou origem calculada bloqueiam incremento até normalização explícita. Ao mudar a seleção/contexto, os vínculos voltam a OFF. Nenhuma conversão ou vínculo decorre da seleção em si.

### Contexto e restauração

Inline não substituído: margem vertical bloqueada, sem mudar display. Células/linhas de tabela: margem bloqueada; célula mantém padding e atalho à subaba Tabela. Em flex/grid, avisar sobre margens dos filhos, sem removê-las. Absolute/fixed: avisar que margem é diferente de offsets X/Y. Gap não é sinônimo de distância final entre caixas.

Restaurar interno/externo/gap recupera apenas a família correspondente da baseline capturada antes da primeira edição da sessão, incluindo shorthands/unidades/prioridades originais. Não recalcular baseline a partir do tamanho atual. Preservar outras propriedades e metadata; reset é desfazível. Várias propriedades restauradas exigem confirmação.

### Histórico, serialização e mobilidade

Usar HistoryManager/BaselineManager/DirtyStateGuard existentes. Lote, vínculo e hold são transações atômicas. Atualizar overlay ao concluir; GeometryController lê a nova geometria apenas no próximo gesto. O módulo 30-geometry.js não foi reescrito nesta versão.

`data-ie-box-model` registra decisões durante autoria. A cópia editável preserva-o; Clean Build remove esse bookkeeping e mantém os estilos inline sem recalcular auto, unidades ou expressões. O editor salvo reabre desativado e sem formulários temporários de confirmação. Tooltips exclusivamente estilizados, sem title nativo.


## 12. Contrato normativo de texto 1.5.3 (preservado)

### Componentes e fronteiras

- `TextActivationController`: ativa o root no pointerdown antes da seleção nativa; não impede a seleção por arraste.
- `TextRangeController`: distingue bloco, caret, range e multiseleção. Mantém Range e bookmark UTF-16 dentro de um root, preservando a direção da seleção. Um foco na toolbox mantém a seleção congelada; mudanças de foco durante blur/change não roubam o foco de campos.
- `InlineFormatEngine`: divide text nodes nos limites, reutiliza runs e preserva os nós semânticos originais. Não usa um extractContents global para embrulhar blocos em span.
- `TextNavigationController`: navega por Text Navigation Roots visíveis na ordem do DOM. Não visita os spans de formatação.
- `TextEditor`: fachada dos comandos, colagem, digitação, composição e picker de cor. Continua usando HistoryManager, BaselineManager e dirty state existentes.

### Regras obrigatórias

1. Edição automática ocorre **apenas quando o modo global de edição está ativo**. Fora dele, links e conteúdo mantêm seu comportamento de produção.
2. Primeiro pointerdown em texto torna o root editável. Não chamar preventDefault no gesto textual comum nem selecionar todo o texto automaticamente.
3. Ctrl/Cmd + clique e o modo de seleção múltipla continuam selecionando elementos. Em multiseleção, nenhum alvo recebe contenteditable.
4. Com range válido, as dez propriedades inline do escopo atuam só nos text nodes selecionados. `text-align` e controles de Layout/Visual continuam no bloco.
5. Runs do editor são `span[data-ie-text-run="1"]`. Não apagar strong, em, a, small, sub/sup ou spans do host. Não copiar/remover IDs de elementos semânticos para facilitar a formatação.
6. Sucessivas formatações reutilizam o run compatível. Runs vazios ou sem estilo são removidos; irmãos equivalentes são unidos. A normalização não deve desembrulhar spans do host que não estejam marcados como runs do editor.
7. Um range cruzando dois roots é bloqueado com orientação. Nunca convertê-lo silenciosamente em uma alteração de bloco inteiro.
8. Com caret colapsado, a formatação atua no bloco. Não implementar estado de estilo futuro nesta versão.
9. Tab/Shift+Tab no conteúdo levam ao próximo/anterior root, com caret no início/fim. Tab em toolbar, modal, seletor e input conserva comportamento de foco. No limite da página o foco retorna ao Salvar.
10. CTA conserva edição e range, mas não executa clique/Enter sem liberação. O texto de um link pode ser formatado sem mudar href.
11. Picker: input apresenta prévia; change/saída encerra a sessão. Uma sessão equivale a uma operação de histórico; não registrar cada cor intermediária.
12. Beforeinput começa snapshot profundo; composição não é fragmentada pelo timeout. Tab commita digitação pendente antes de trocar root. Undo/redo invalidam bookmarks que apontem a nós antigos.
13. Enter permanece nativo. Quando o navegador inserir um DIV de linha inválido dentro de P/H*, converter apenas o novo container de linha em BR após input, preservando caret, texto e histórico. Não reestruturar as células com vários blocos.
14. Movimento reduzido usa scroll automático sem a animação smooth do host. Qualquer override transitório de scroll-behavior deve ser restaurado imediatamente e nunca salvo.
15. Não acrescentar listeners concorrentes de drag nem modificar GeometryController/BoxModelController nesta rodada.

### Salvamento e Clean Build

O HTML editável preserva `data-ie-text-run` para próximas edições. O Clean Build remove esse atributo; o span e seu style permanecem se têm função visual. A normalização pré-save opera na **cópia**, sem alterar o DOM que o usuário está editando ou criar uma nova entrada de histórico. Não salvar caret, seleção, contenteditable temporário, comments de passagem ou foco da toolbar.

### Homologação desta rodada

Executar os 43 gates de `tests/test_text_range.py`, os complementares de `test_text_edges.py` e as regressões do pacote. Integrar na landing somente depois dos gates do template; validar novamente no HTML completo. Relatórios devem distinguir Chromium emulado, native picker/IME simulado e dispositivos físicos não testados. Não alegar paridade entre browsers não ensaiados.


## Comentários e handoff para LLM — v1.5.4

O editor suporta **Nota** e **Ajuste para LLM** em `Mais → Comentários`. No HTML editável salvo, `#ie-comments-data` contém um protocolo explícito. Um agente/LLM que receber esse HTML deve tratar somente registros `llm_task` com `status=open` como solicitações explícitas de alteração do usuário, aplicando cada uma ao elemento cujo `data-ie-comment-anchor` corresponde ao campo `target`. Registros `note` são contexto informativo e não devem gerar alterações por conta própria. Registros resolvidos não devem ser reaplicados. Em Clean Build, esses metadados de autoria são removidos.

A duplicação de elemento está em `Mais → Elemento → Duplicar`. A cópia preserva o visual e o conteúdo, mas recebe IDs únicos e não herda comentários do original.

## 13. Contrato normativo de duplicação e comentários 1.5.4

### Duplicação

- Disponível em **Mais → Elemento → Duplicar** para seleção única.
- Clonar conteúdo, estilos autorais, efeitos e mídia sem reescrever o original.
- Regenerar IDs do clone e descendentes e remapear referências internas (`for`, ARIA, `href=#...` e referências SVG `url(#...)`).
- Não copiar flags transitórias, IDs de histórico ou comentários de autoria.
- Elementos `absolute/fixed` podem receber pequeno deslocamento inicial para a cópia ficar visível.
- A operação deve ser atômica no undo/redo.

### Comentários

- **Nota (`note`)** é contexto informativo. Nunca deve ser convertida automaticamente em alteração.
- **Ajuste para LLM (`llm_task`)** com `status=open` é uma solicitação explícita do usuário para modificar o elemento marcado.
- O alvo é identificado por `data-ie-comment-anchor`; o HTML editável salvo materializa o registro global em `<script type="application/json" id="ie-comments-data">`.
- Se existir seleção textual por Range no momento da criação, registrar `quote`, `start` e `end` como referência adicional; o anchor do elemento continua sendo a referência canônica.
- `llm_task` resolvido não deve ser reaplicado. Se um LLM devolver outro HTML editável depois de executar a tarefa, deve marcá-la como `resolved` ou preservar o status resolvido já existente.
- Em Clean Build/deploy, remover `#ie-comments-data`, o comentário de protocolo, `data-ie-comments` e `data-ie-comment-anchor`.
- Reset visual do elemento não apaga comentários. Duplicar não copia comentários.

### Regra obrigatória para um LLM que recebe o HTML editado

1. Procurar `#ie-comments-data`.
2. Ler `instructionsForLLM`.
3. Aplicar cada registro `type="llm_task"` com `status="open"` ao elemento com anchor igual a `target`, usando `range.quote` apenas como referência de trecho quando presente.
4. Tratar registros `type="note"` somente como contexto.
5. Não inferir uma alteração a partir de Nota.
6. Não reaplicar tarefas resolvidas.


## 14. Superfície de produto 1.6.0

- Manter a organização atual do pacote e a injeção canônica. Não substituir os motores por outro Core nem preparar backend nesta release.
- `?` abre a Central de Ajuda local; `©` abre Sobre. Ambos são UI `data-ie-runtime`, removida pelo Clean Build.
- A versão de UI/runtime é compilada a partir de VERSION.json pelo build existente. Tokens de fonte não devem ser injetados sem compilação.
- Fechar edição e × apenas fecham as ferramentas. Salvar editável conserva editor/comentários. Exportar final confirma e usa o mesmo serializer com clean:true.
- Exportar final não marca o editável como salvo: os comentários e tarefas só estão garantidos em uma cópia editável.
- Sobre não impõe branding ao host. COPYRIGHT.md explicita uso interno e ausência de titular jurídico informado. Não preencher titularidade por inferência.
- Modais devem preservar Range, histórico e seleção. Não usar innerHTML com o texto da busca.
- QA específico: tests/test_product_ui.py. O runner completo inclui 40 casos de produto, além dos 170 herdados e do ensaio de mobilidade.
- A fixture recovered-landing-host.html é recuperada de uma evidência salva da 1.5.4; não apresentá-la como a fonte original oficial.


## Delete & Smart Reflow — contrato adicional 1.6.1

`27-delete.js` usa o HistoryManager existente; não adicionar uma pilha concorrente. Del fora de texto/Range/campos exclui as raízes normalizadas da seleção. Lixeira e menu são runtime e somem no Clean Build. Respeitar a proteção de documento, UI, raízes e subtrees sinalizados.

Exclusão normal remove nós, sem reescrever CSS do host. O reflow é do navegador. Preservar espaço cria uma caixa neutra validada no viewport atual; não equivale a reconstrução das media queries. O spacer pode ser identificado por `data-ie-spacer` enquanto editável. Clean Build remove **só o atributo**, não a caixa espacial; nunca eliminar todos os elementos vazios indiscriminadamente.

Reter o nó real e seus descendentes no histórico para Undo preservar listeners, estado e comentários. Não usar `body.innerHTML`. Não persistir os nós excluídos dentro do HTML salvo. Avisar que Undo é limitado à sessão e ao limite herdado do histórico.

Comentários vivem nos alvos; quando o subtree sai do DOM, seus registros saem do agregado salvo. Desfazer restaura metadados sem criar novo status. `llm_task` aberta no alvo ou descendentes exige confirmação. Revalidar seleção/pai após o diálogo para não operar sobre um alvo que mudou.

Compactação e remoção de wrapper vazio são operações adicionais, explícitas e conservadoras. Não remover alturas originais, fontes CSS, cenas sticky/scrollytelling ou ancestrais em cascata. Regras e limites estão em `DELETE_REFLOW_AUDIT.md`. A feature não corrige JavaScript do host que ainda referencie alvos removidos.

QA novo: `tests/test_delete_reflow.py`, além da regressão integral. `qa/evidence/baseline-v160/` é a baseline executada; `qa/v161/` contém a evidência atual. Suporte declarado deve continuar limitado ao ambiente efetivamente ensaiado.
