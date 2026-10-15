# Inline Editor Pack 1.6.1

Camada temporária de autoria visual aplicada diretamente a um HTML existente. O editor não reconstrói a página, não converte o conteúdo para um schema próprio e não exige backend, login ou conexão à internet para suas funções locais.

**Base: 1.6.0. Uso inicial: interno.** Esta versão mantém o integrador, os fragmentos canônicos, os motores de edição e o contrato de comentários. Não inclui API, GPT customizado, CLI nova, Core headless ou migração de armazenamento.

## O que mudou na 1.6.1

**Delete & Smart Reflow:** lixeira ao lado de Mover, atalho Del fora da edição textual, multisseleção, proteção de raízes e Undo/Redo integrado ao histórico existente. O conteúdo se reorganiza somente quando isso já decorre do CSS do host; nenhuma altura, coordenada ou regra de grid é reescrita automaticamente.

A setinha da lixeira oferece **Excluir preservando espaço**. A operação cria uma caixa vazia medida na largura de tela atual e verifica se ela mantém a geometria da composição. Quando não consegue, cancela em vez de deslocar os vizinhos. O espaço sobrevive ao Clean Build, mas sua marca editorial não. Revise as outras larguras de tela: essa opção não reproduz a responsividade do conteúdo removido.

Após exclusões elegíveis, podem aparecer **Compactar container** (somente altura escrita pelo editor nesta sessão, com baseline conhecida) ou **Excluir container vazio** (somente wrappers simples). São ações explícitas e independentes no histórico, nunca uma cascata de ajustes.

Comentários acompanham os alvos removidos e voltam com Undo. Tarefas LLM abertas pedem confirmação antes da exclusão. O HTML salvo não mantém tarefas cujo alvo deixou de existir.

Continuam presentes as entregas da 1.6.0: cabeçalho `? © − ×`, Ajuda com oito guias e busca local, Sobre, Fechar edição, Salvar editável e Exportar final. A nova seção **Excluir elementos** está em **? → Layout e movimento**; a busca por “lixeira” também a encontra.

## Abrir o demonstrador

Abra `INLINE_EDITOR_TEMPLATE.html` no navegador e clique em **Editar página**. Esse arquivo é um demonstrador com casos de homologação, não o HTML do seu produto. `INLINE_EDITOR_DELETE_DEMO.html` oferece exemplos dedicados a fluxo normal, flex, grid e cenas de rolagem. Os botões `?` e `©` permitem conferir as novas interfaces.

No desktop, arraste o cabeçalho da toolbox para reposicioná-la. No celular, ela fica na parte inferior e pode ser minimizada. Cores e fontes continuam seguindo os tokens que o editor já utiliza; não foi criado um novo sistema de temas.

## Integrar no HTML de um produto

O comando permanece o mesmo. Node.js é necessário apenas para build/integração, não para editar o HTML no navegador.

```powershell
node .\tools\integrate.mjs .\produto-original.html .\produto-editavel.html
```

A entrada deve ser um HTML completo **sem outra instalação do editor**. O integrador preserva o original, injeta os fragmentos canônicos antes de `</head>` e `</body>` e recusa uma instalação existente. Nunca copia o demonstrador para dentro do produto.

Uma entrada autocontida continua autocontida. Recursos externos já presentes permanecem externos: o integrador não baixa imagens, fontes ou scripts. Abra somente HTMLs de origem confiável; o editor não sanitiza os scripts do hospedeiro.

## Salvar, exportar e fechar

| Ação | Resultado |
|---|---|
| **Salvar editável** ou **Ctrl/Cmd + S** | HTML com alterações, editor, comentários e tarefas; pode ser reaberto para continuar editando. |
| **Exportar final** | Confirmação seguida de Clean Build; a cópia não contém UI, comentários ou metadados temporários, mas preserva o resultado visual e o suporte authored necessário. |
| **Fechar edição** ou **×** | Fecha somente as ferramentas. Não salva, exporta ou desfaz o trabalho. Alterações pendentes exigem confirmação. |

A cópia editável reabre com o editor fechado: clique em Editar página para continuar. O arquivo final usa `_FINAL_` no nome; o editável mantém o padrão `_EDITADO_` da versão anterior.

**Exportar final não substitui Salvar editável.** O final não guarda comentários nem o editor. Assim, a exportação final não marca o rascunho editável como salvo e não fecha a página em que você está trabalhando. Salve também o editável antes de descartar a sessão.

Quando o navegador permite gravação direta, aparece o seletor de arquivo. Caso contrário, é iniciado um download. No fallback, a confirmação significa **download iniciado**, não verificação de escrita no disco; confira a pasta Downloads. Cancelar o seletor não perde as alterações. Não há autosave remoto.

O serviço existente continua disponível:

```javascript
const editable = InlineEditor.serialize();
const final = InlineEditor.serialize({ clean: true });
```

O Clean Build não adiciona watermark, “Powered by” ou copyright visual à página publicada. A interface Sobre, o botão © e toda a Central de Ajuda pertencem à camada editorial removível.

## Excluir e desfazer

Selecione o elemento e use a lixeira ou Del. A setinha e **Mais → Elemento → Excluir elemento…** abrem o mesmo menu. O botão de mover mantém suas restrições anteriores: seções inteiras não viram objetos arrastáveis por causa desta feature.

Delete em input, textarea ou contenteditable continua apagando texto, não elementos. Com Range textual ativo a exclusão estrutural fica bloqueada. Não existe atalho global por Backspace.

Depois da exclusão, use **Desfazer** no aviso ou **Ctrl/Cmd+Z**. O histórico também permite Refazer. Uma multisseleção corresponde a uma operação; não se apaga um filho duas vezes quando seu pai também está selecionado. Nós originais e seus comentários são restaurados na posição anterior.

**O Undo é da sessão, não do arquivo.** Salvar e reabrir conserva o estado atual sem os nós excluídos e sem histórico anterior. O histórico herdado tem limite de 100 operações. Mantenha uma cópia do produto antes de alterações estruturais. Reset de estilos não substitui o Desfazer de exclusão.

Exclusão não reescreve scripts que dependam de IDs/elementos removidos. Em produtos com lógica dinâmica ou scrollytelling, teste também a execução fora do modo de edição. Consulte `DELETE_REFLOW_AUDIT.md` para os critérios de spacer, proteções, comentários e compactação.

## Edição e comentários preservados

Clique diretamente no texto para digitar. Selecione palavras para formatar apenas um TRECHO; sem seleção de trecho, a tipografia vale para o BLOCO. Tab/Shift + Tab percorre os textos visíveis na ordem do HTML. Dentro da toolbox ou de um modal, percorre os controles. Ctrl/Cmd + clique ou Selecionar vários permite ajustes em lote.

Conteúdo reúne texto, tipografia, links e mídia; Layout reúne tamanho, movimento, espaçamento, tabelas e grupos; Visual reúne fundo, bordas, sombras, filtros e opacidade; Efeitos mantém as classes de efeitos; Mais inclui selos, elemento/duplicação, comentários e histórico.

**Mais → Comentários** distingue Nota de Ajuste para LLM. Nota é contexto; não solicita mudança automaticamente. Ajuste para LLM cria `llm_task`. O HTML editável salvo materializa `#ie-comments-data` e ancora o alvo por `data-ie-comment-anchor`. O editor não envia esses registros a uma IA: o usuário entrega o HTML ao agente. Somente tarefas `llm_task` abertas devem ser executadas; notas e tarefas resolvidas não devem ser convertidas em novas alterações. A exportação final remove esses registros. O protocolo está em `LLM_COMMENT_PROTOCOL.md` e `SKILL.md`.

Duplicação, texto/Range, geometria, Box Model, mídia, efeitos, histórico e authored runtime não foram redesenhados. Os contratos detalhados permanecem no `SKILL.md` e nos documentos históricos de escopo/auditoria.

## Sobre e copyright

O modal Sobre informa versão, uso interno, execução local e o comportamento do Clean Build. A versão é lida do `VERSION.json` pelo build existente; a UI compilada e o runtime recebem a mesma identificação.

`COPYRIGHT.md` contém o aviso interno. O produto é identificado como Inline Editor; **o titular jurídico não foi fornecido e não foi atribuído a uma pessoa ou empresa por inferência**. Essa identificação deve ser definida antes de uma distribuição externa. Não foi criado DRM, licença online ou validação remota.

## Build

```powershell
node .\tools\build.mjs
node --check .\src\runtime.js
node --check .\src\authored.js
```

A estrutura continua em `src/`: módulos concatenados, CSS, UI e fragmentos. `52-product-ui.js` mantém Ajuda/Sobre e exportação. `27-delete.js` acrescenta a exclusão ao mesmo runtime e histórico. Não é um Core paralelo.

`__IE_VERSION__` é um token de fonte resolvido pelo build. Integre os **fragmentos compilados**, não os arquivos de fonte da UI. Não edite o template compilado para alterar o produto de forma permanente: altere as fontes e execute o build.

## QA reproduzível

Python/Playwright são ferramentas de desenvolvimento, não dependências do HTML distribuído.

```powershell
python -m pip install -r .\tests\requirements.txt
python -m playwright install chromium
python -X utf8 .\tests\run_all.py `
  --landing-original ".\tests\fixtures\recovered-landing-host.html" `
  --landing-editable ".\qa\recovered-landing-editable.html"
```

A fixture acima foi recuperada do HTML salvo na evidência da 1.5.4. **Não é o arquivo original oficial da landing.** Foi incluída para permitir repetir a regressão de uma página completa com mídia, SVG, CTAs e selos. Para validar um produto específico, use também seu HTML original limpo e um caminho de saída separado. Os casos da suíte de landing esperam a estrutura da Rotina da Empreendedora Selvagem e não são um validador universal de qualquer página.

A suíte nova pode ser executada isoladamente:

```powershell
python -X utf8 .\tests\test_delete_reflow.py
```

O runner exige os números esperados de casos e os status dos relatórios JSON; exit code zero não basta. Não use filtros `GATES`, `BOX_GATES`, `TEXT_GATES`, `ONLY` ou `DELETE_ONLY` para declarar homologação completa. Novas execuções escrevem em `qa/`; a baseline executada está separada em `qa/evidence/baseline-v160/`.

`VALIDATION_REPORT.md`, `QA_MATRIX.md` e `RELEASE_REPORT_v1.6.1.md` registram a evidência real e seus limites. `SHA256SUMS.txt` cobre o pacote congelado, exceto a própria lista de hashes. Após recompilar ou reexecutar testes, os arquivos alterados deixam de corresponder ao manifesto da entrega.

## Limites da entrega

A homologação usa Chromium/Linux e viewports emulados. Os testes de conteúdo usam `set_content` e downloads reais. A abertura direta por `file://` depende da política do navegador; o resultado do ensaio desta execução está no relatório e em `qa/v161/environment.json`. Não equivale a Safari, Firefox, aparelho físico ou seletor nativo do sistema operacional. Os caminhos de sucesso/cancelamento/falha da API de gravação são simulados nos testes; o fallback usa downloads reais do navegador.

Movimento não reorganiza automaticamente o fluxo da página; pode provocar sobreposição. Não há edição independente por breakpoint. Reveja outros tamanhos de tela após alterações. O JavaScript e as integrações externas da página continuam sendo responsabilidade do hospedeiro.

Esta release não constrói o próximo estágio GPT/backend. O fluxo continua sendo **HTML original → pacote acoplado → edição → cópia editável ou final**.
