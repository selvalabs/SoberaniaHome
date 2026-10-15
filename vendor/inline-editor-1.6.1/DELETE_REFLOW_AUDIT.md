# Delete & Smart Reflow — decisões técnicas da 1.6.1

## Onde está a implementação

`src/27-delete.js` contém o controlador da feature. O build concatena esse módulo ao runtime como os demais. `src/55-bindings.js` conecta teclado, ações e overlay; `src/10-history.js` preserva a entrada de custom undo/redo quando uma operação retorna `false`; `src/60-save.js` remove apenas a marca editorial do spacer no Clean Build. Não há engine headless, nova API de rede ou dependência de runtime.

O código dos motores de geometria, Box Model, texto/Range, duplicação/comentários, visual e authored não foi reescrito. Consulte a comparação SHA-256 em `qa/v161/unchanged-sources.json` para a lista exata.

## Excluir não escreve estilos nos irmãos

A operação normal faz `removeChild` nas raízes da seleção, sem alterar `display`, `height`, `min-height`, gap, grid-template, coordenadas ou regras CSS do hospedeiro. Reflow normal vem do navegador. CSS dependente da existência do nó — por exemplo `:has`, `:empty`, `:nth-child` e contadores — continua reagindo de acordo com o host.

Cenas de rolagem com altura deliberada não são encurtadas automaticamente. Elementos com posição absoluta podem desaparecer sem mudar a posição de outros elementos. Um deslocamento relativo/livre continua participando do fluxo quando já participava antes; não é convertido em absoluto.

## Histórico único, transação em lote

As raízes são ordenadas no DOM e descendentes redundantes são eliminados. Guardam-se referências ao nó real, pai, próximo/anterior irmão e índice. A restauração em ordem inversa recupera corretamente irmãos adjacentes. Não são criados comentários-âncora temporários no HTML para manter posições e não é substituído o `body.innerHTML`.

Os nós reais conservam listeners e propriedades locais; o QA testa identidade, listener do host e valor não serializado de um input. Isso não é uma garantia de reversão de efeitos externos: callbacks de componentes customizados, recursos remotos ou código que depende de elementos removidos podem exigir adaptação manual. A lógica JavaScript do host não é reescrita pelo editor.

O histórico já possuía Undo/Redo e limite de 100 entradas. A exclusão usa `pushCustom`, não outra pilha. Ctrl/Cmd+Z respeita a ordem de edições. Se surgir uma edição mais recente, o Undo do aviso fica indisponível para não saltar por cima dela. Se o pai foi retirado externamente, o Undo informa o impedimento e mantém a entrada.

Salvar/reabrir inicia uma sessão nova: nós excluídos, referências e histórico de Undo não são embutidos no arquivo. Use uma cópia anterior para recuperar exclusões depois de fechar a sessão.

## Teclado e interface

Del sem modificadores atua em seleção estrutural. Inputs, textareas, selects, campos com papel textual, contenteditable, Range, composição IME, modais, repetição e gesto de ponteiro em andamento são protegidos. Eventos retargeteados de Shadow DOM aberto e elementos customizados focados não capturam Del nem Undo do componente. Isso não habilita edição de Shadow DOM. Backspace não é atalho estrutural. Ctrl/Cmd+Z em campos comuns continua pertencendo ao campo; o editor mantém seu histórico textual onde já era responsável pela edição.

O botão está ao lado de Mover quando o movimento é permitido. Seções inteiras, que a versão anterior não movimentava, continuam sem Mover, mas podem ser excluídas. O grupo de ações usa a região livre da tela quando a toolbox obstrui a seleção. No mobile os novos alvos de toque medem pelo menos 44 CSS px.

## Regras do spacer

A caixa usa um elemento neutro, `aria-hidden`, sem conteúdo, IDs, classes, links ou comentários do alvo. Listas usam `li`/`dt`/`dd` quando necessário. Width/height são dimensões border-box não transformadas; transformações são aplicadas uma única vez. Margens, ordem e linhas/colunas explícitas relevantes são preservadas na caixa. No flex, a base do espaço é congelada na dimensão ocupada no eixo principal, evitando redistribuição causada pela remoção de padding e conteúdo intrínseco.

O spacer é uma fotografia espacial do viewport atual, **não um substituto das media queries e do conteúdo responsivo original**. A interface e a Ajuda instruem revisar outras larguras. A validação mede a caixa, irmãos diretos e dimensões do pai antes/depois (tolerância: 2 CSS px). Se não houver equivalência, o DOM é restaurado, não há entrada de exclusão nem dirty novo.

Não há substituição automática de inline sem caixa própria, `display:contents`, tabelas/células, floats, sticky, perspectiva e certos estados animados. Animações em curso devem ser pausadas ou o usuário deve escolher o container adequado. A exclusão normal continua disponível nos contextos que não sejam protegidos.

Durante edição, o contorno e a legenda da caixa vêm exclusivamente do CSS do runtime. O usuário pode selecioná-la e excluí-la. Salvar editável conserva `data-ie-spacer`. Clean Build remove esse atributo e o runtime, mas conserva as dimensões e a invisibilidade da caixa. Não deve remover o elemento vazio por considerá-lo "lixo editorial".

## Compactação limitada, nunca em cascata

A sugestão de compactação exige um único pai simples, ausência de cena/posicionamentos fora do fluxo/pseudo-elementos, baseline da sessão, propriedade `height` ou `min-height` marcada como escrita pelo editor e pelo menos 48 CSS px de espaço livre identificado.

O baseline da propriedade precisa ser vazio/auto/zero. Um tamanho inline original explícito não é removido. Ao restaurar a propriedade à baseline, o CSS original volta a decidir; pode restar uma altura original, que não é apagada. Se não houver redução real, a tentativa é revertida. A ação é separada no histórico.

A sugestão de excluir wrapper exige que ele esteja vazio, sem filhos relevantes, decoração, código, proteção, referência acessível/navegacional detectada ou tamanho deliberado significativo. É uma conveniência conservadora, não uma promessa de detectar todo espaço sobrando. Nada percorre ancestrais apagando automaticamente.

## Comentários e LLM

A fonte de verdade permanece em `data-ie-comments` / `data-ie-comment-anchor`. Excluir o subtree retira esses registros da página; as informações ficam nos nós mantidos pelo Undo. Não foi criado status novo como `dismissed`, preservando o protocolo existente.

Tarefas `llm_task` abertas no alvo ou em descendentes exigem confirmação; cancelar não muda DOM nem histórico. Seleção/pai são revalidados após a confirmação. O registro agregado `#ie-comments-data`, quando já presente em um editável reaberto, também é atualizado. Na serialização, o registro é materializado apenas a partir dos alvos existentes. Desfazer restaura texto, status, datas, anchors e metadados de Range.

## Limites e fontes técnicas

HTMLs com scripts próprios precisam de teste no produto real; a exclusão não corrige referências quebradas em scripts, âncoras e lógicas de animação. Raízes convencionais `#app`, `#root`, `#__next`, `#__nuxt`, `[data-reactroot]` e `[data-ie-root]` são protegidas conservadoramente. `[data-ie-protected]` protege explicitamente um subtree. Não se trata de detecção universal de frameworks.

Referências técnicas consultadas na implementação (não são dependências):

- MDN, Node.removeChild — retenção do nó e de seus EventListeners: https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
- MDN, In flow and out of flow — fluxo normal e posicionamentos fora do fluxo: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/In_flow_and_out_of_flow

A evidência desta release é o código e o QA do pacote. Não extrapolar a homologação para navegadores ou produtos não ensaiados.
