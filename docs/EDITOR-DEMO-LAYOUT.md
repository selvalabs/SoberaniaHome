# Demonstração do editor — issue 75

Issue: <https://github.com/selvalabs/SoberaniaHome/issues/75>. Branch: `fix/75-editor-demo-layout`.

O botão de edição fica entre o texto e a folha. A demonstração inicia com o painel expandido em uma coluna própria, sem cobrir o conteúdo. Em telas estreitas, a composição empilha; telas baixas deixam o painel crescer no fluxo para manter os controles alcançáveis. Fechar/reabrir expande novamente, minimizar continua sendo uma ação explícita e arrastar pode desencaixar o painel.

## Integração e arquivos salvos

Um adaptador exclusivo da demonstração usa a API existente do editor. Os motores do pacote não foram reescritos. A instalação ocorre depois do boot, preservando a captura inicial da UI. Ao salvar uma cópia editável, os controles retornam ao body antes do script do runtime e o início permanece fechado, como no contrato do pacote. A exportação final remove o painel, o botão, o adaptador e seus estilos. A imagem embutida e as edições permanecem autocontidas. Sem JavaScript, o conteúdo segue legível e o botão inoperante fica oculto.

## Versão solicitada

O pacote efetivamente presente ainda é **1.6.1**. Não foi alterado apenas o rótulo para simular uma atualização.

Em 27/10/2026 foram conferidos:

- `selvalabs/inline-editor`, main `9799d4ddb7e528fe30ace3289ea5382406358aba`: `VERSION.json` e `package.json` identificam 1.6.1. Sem tags ou releases publicadas na consulta. A outra branch remota também identifica 1.6.1.
- Repositório local `C:/Users/carlo/projects/websites/yogaearteShala/inline-editor`, main `9799d4d`, sem outra worktree ou branch 1.7: o mesmo manifest 1.6.1.
- `C:/Users/carlo/Downloads/INLINE_EDITOR_PACK_v1.6.1.zip`: pacote local encontrado em Downloads.
- Integração local SHALA em `galerias-selecao-issue-217/src/editor/inline-editor-1.6.1/VERSION.json`: 1.6.1. A [PR #225](https://github.com/selvalabs/shala-wix-headless/pull/225) também declara a baseline 1.6.1.
- [Issue #2](https://github.com/selvalabs/inline-editor/issues/2) e `specs/2-integracao-reutilizavel.json`: a 1.7.0 é uma versão alvo planejada, não um pacote implementado encontrado.

A atualização para 1.7 fica pendente de localizar o pacote/commit correspondente. A issue #75 permanece aberta; o ajuste visual pode ser homologado independentemente.

## Validação — 27/10/2026

- Typecheck, 58 testes Node, `git diff --check`: passaram. Não há script de lint dedicado no repositório.
- Auditorias npm e pip dos requisitos de publicação: nenhuma vulnerabilidade conhecida.
- Builds root e Pages e verificadores `check-static.mjs` e `check-pages.mjs`: passaram.
- `test_editor_demo_layout.py` passou no root e no pacote com prefixo `/SoberaniaHome/`: oito viewports de 320 × 568 a 1920 × 1080, incluindo 844 × 390. Verifica preferências locais antigas, painel expandido, botão único, minimizar, fechar/reabrir, arrasto, edição real, undo/redo, cópias editável/final, reabertura e alternativa sem JavaScript.
- `test_pages_edition.py`: passou em desktop, celular e sem JavaScript. O novo teste foi incluído nas suítes root e Pages para o CI.
- Capturas desktop/mobile e exportação final foram inspecionadas.
- SHA-256 do HTML da demonstração, idêntico na fonte, build root e build Pages: `3855b0af4c0c74465883a4d2dba611bd81cd0cd8449471e0fe1f4f6b01f47c01`.

O empacotamento inicial falhou com ENOSPC (C: com 0 bytes livres). Não houve exclusão de arquivos. A tentativa de compressão NTFS do HTML temporário `.edition-builds/editor-75-root-final/index.html` não liberou espaço; ficou marcado o atributo Compressed, com conteúdo idêntico ao outro build root, hash `d9cbc69497a7f9932bbd076246d1f7ed1d5f1cac13cca979c985791b69ee7235`. Após o espaço voltar a ficar disponível, o pacote foi gerado em um novo diretório e todas as verificações acima passaram. O diretório parcial foi preservado. `v0.0.0` é somente uma fixture de QA; não se criou tag ou release.

## Histórico, prévia e reversão

A branch nasceu no GitHub de main `057cf68630c899401cad6284833eb53b67b86a82`. Recebeu explicitamente por fast-forward a prévia `1575d493688f7ccfdac6180ffbb33c92737de3e7` (#74) antes da alteração. Essa é também a referência de rollback deste ajuste. Nenhuma história foi reescrita.

Prévia local reutiliza a porta 4198 no Wi-Fi. Sem merge, release, publicação, banco, migração ou VPS. Main e espelho VPS preservados. O CI do novo PR e a homologação permanecem verificações separadas.

## Integração da candidata 1.7.0 — 2026-10-28

A prévia passou a usar o commit b97229234e5263142860fb15b36385722ab295f8 do repositório canônico (PR #4, issue #2), com os fragmentos exatos e identificação em public/demos/editor-version.json. A configuração declarativa mapeia a folha da intro como camada. Preserva o painel expandido e o botão junto à folha. Nenhuma dependência do SHALA foi copiada.

A candidata inclui controles contextuais, fotos em camadas, cores independentes e fontes sob demanda. Salvar HTML continua sem alterar fontes do framework. Merge, tag e publicação aguardam revisão/homologação. O estado anterior do demo permanece em b166215ee6450a7925a00c03dafad0ec5f376ada para rollback. O levantamento anterior acima registra o estado antes da implementação efetiva.

Validação desta atualização: typecheck e 58 testes Node passaram; build em .edition-builds/editor17-candidate-20261028 e check-static passaram; demo idêntico entre fonte/build. Teste Chromium em 8 viewports, edição/undo/redo, serialização/reabertura e sem JavaScript passou. A auditoria npm não concluiu por falha DNS ENOTFOUND no sandbox; sem dependências novas. Prévia do demo em http://192.168.1.4:4199/demos/editor-editavel.html. A 4198 segue ocupada pelo Astro sem resposta; o processo foi preservado.
