# Escopo aprovado — INLINE EDITOR v1.6.1

**Base:** INLINE_EDITOR_PACK v1.6.0. **Uso:** interno. **Feature:** Delete & Smart Reflow.

## Contrato central

Excluir remove a seleção e deixa o CSS existente recompor o layout. Não é um auto-layout, uma reorganização por IA ou uma refatoração automática de CSS.

| Contexto | Exclusão normal |
|---|---|
| Fluxo normal | Irmãos ocupam o espaço segundo o CSS do host. |
| Flex e grid automático | Navegador faz a recomposição; o editor não escreve novas posições. |
| Grid explícito | Áreas, linhas e colunas dos irmãos permanecem como estavam. |
| Absolute / fixed / deslocamentos livres | Não há reposicionamento manual de outros elementos. |
| Height, min-height e cenas sticky/scrollytelling | Não são compactados automaticamente. |

## Interface e teclado

Lixeira ao lado de Mover, setinha com menu Excluir / Excluir preservando espaço, e acesso equivalente em Mais → Elemento. A lixeira também aparece quando Mover não é permitido para a seleção, como nas seções inteiras. O comportamento prévio de movimento não deve mudar.

Del/Delete aciona a exclusão estrutural somente fora de campos, edição textual, Range e composição IME. Não atribuir a Backspace a exclusão de elementos. Modificadores e repetição não devem disparar exclusões inesperadas. Modais retêm suas próprias teclas.

## Histórico

Usar o HistoryManager existente. Uma exclusão em lote é uma entrada. Reter os nós originais, pais, posição entre irmãos e seleção para restaurar DOM, listeners, estado local e comentários. Pai + filho selecionados são normalizados para uma única raiz.

Desfazer pelo aviso, Histórico ou Ctrl/Cmd+Z; Refazer pelo histórico já existente. Não criar um histórico concorrente. O aviso não deve desfazer silenciosamente outra ação mais recente. Histórico é da sessão, limitado pelo mecanismo herdado (100 entradas), não é salvo dentro do HTML.

Falhas de restauração causadas por um pai removido externamente não devem consumir a entrada do histórico nem fingir sucesso. Não usar body.innerHTML para restaurar o documento inteiro.

## Preservar espaço

Substituir por caixa neutra sem conteúdo, links, IDs ou comentários do alvo. Dimensões, margens e ocupação são medidas no viewport atual. A substituição deve ser revertida se a caixa, irmãos diretos ou tamanho do pai mudarem além da tolerância geométrica de 2 CSS px.

O espaço faz parte do produto resultante: fica no editável e no Clean Build; no final, remover apenas a identificação editorial do spacer. Na edição, permitir visualizar e selecionar a caixa vazia. Não prometer reconstrução responsiva das regras do elemento removido. Bloquear contextos sem caixa substituível ou não seguros.

## Compactação e wrapper vazio

São ações separadas, opcionais, explícitas e desfazíveis. Compactar apenas altura/min-height escrita pelo editor nesta sessão, com baseline conhecida, em container simples. Não remover um tamanho inline original explícito nem escrever nas regras CSS do host. Se o CSS original continuar mantendo o espaço, preservá-lo.

Excluir container vazio somente sem conteúdo, filhos, scripts, pseudo-elementos, decoração ou proteção relevante. Não apagar ancestrais em cascata. Na dúvida, não oferecer a ação.

## Proteções e comentários

Proteger html/head/body, runtime/UI e marcações protegidas. Proteger raízes explícitas e ancestrais que contenham elementos protegidos. Não bloquear indiscriminadamente todos os filhos de uma raiz de aplicação.

Comentários dos alvos e descendentes removidos saem do documento. Ficam apenas nos nós retidos pelo Undo. Desfazer recupera metadados e anchors sem mudar IDs ou status. O registro agregado salvo não pode manter tarefas sem alvo. Tarefas LLM abertas exigem confirmação; notas e tarefas já resolvidas não criam uma confirmação comum de exclusão.

## Persistência, ajuda e regressão

Salvar editável deve reabrir no estado excluído, sem persistir nós retirados ou histórico. Clean Build deve retirar todos os controles, menu, feedback e dados editoriais, conservando caixas de espaço e o authored necessário aos efeitos.

Ajuda local deve explicar exclusão, teclado, espaço, Undo, compactação, comentários e limites. Preservar motores de geometria, texto/Range, Box Model, visual, mídia, efeitos e contratos da versão anterior. Ajustar apenas conexões necessárias de histórico, teclado, overlay e serializer.

## Fora do escopo

Backend, API, GPT customizado, CLI nova, engine de auto-layout, reescrita global de CSS, IA, edição por breakpoint, undo/redo paralelo, colaboração, migração de armazenamento ou novo licenciamento.

## Aceite e entregáveis

Regressão integral da 1.6.0 (baseline esperada: 210 casos + mobilidade); novos testes de exclusão/teclado/Range, proteções, comentários, multisseleção, todos os tipos de layout, spacer, Undo/Redo, compactação, mobile e persistência. Declarar os navegadores e a origem das fixtures realmente testadas.

Entregar INLINE_EDITOR_PACK_v1.6.1.zip, HTML demonstrativo, RELEASE_REPORT_v1.6.1.md, fontes, testes, evidências e SHA256SUMS.txt verificado. Manter o integrador e a estrutura atual do pacote.
