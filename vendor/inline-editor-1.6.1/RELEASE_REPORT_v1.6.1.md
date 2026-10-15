# INLINE_EDITOR_PACK v1.6.1 — Delete & Smart Reflow

**Status: PASS — LOCAL**  
**Data:** 2026-09-13  
**Base:** INLINE_EDITOR_PACK v1.6.0  
**Entrega:** mesma arquitetura de fragmentos + runtime local; feature incremental de exclusão.

## 1. Resultado da entrega

O editor agora permite excluir elementos pela lixeira ao lado de Mover ou pela tecla Del. A setinha abre Excluir / Excluir preservando espaço. O mesmo menu está em Mais → Elemento → Excluir elemento…. Se o movimento não é permitido no alvo, a lixeira continua disponível sem liberar movimento que antes era bloqueado.

A exclusão normal remove apenas as raízes selecionadas e deixa o CSS existente recompor o fluxo. Não reescreve alturas, templates de grid, coordenadas de irmãos ou CSS original. Em composições fora do fluxo, os demais objetos não recebem reposicionamento manual. Layout livre com deslocamento relativo mantém a semântica original de participação no fluxo.

A exclusão é integrada ao histórico existente: Desfazer no aviso ou Ctrl/Cmd+Z; Refazer pelos controles já existentes. A multisseleção é uma transação e pais/filhos redundantes são normalizados. Nós originais, listeners, posição e comentários são preservados para restauração durante a sessão.

## 2. Comportamentos publicados

| Ação/contexto | Contrato |
|---|---|
| Excluir / Del | Remove o alvo; recomposição natural do navegador. Não há compactação estrutural automática. |
| Flex / Grid automático | O CSS redistribui os itens sem novas regras nos irmãos. |
| Grid explícito / absolute / fixed / cena | Não reescreve áreas, posições ou alturas deliberadas. |
| Excluir preservando espaço | Cria caixa neutra persistente, sem conteúdo ou semântica do alvo. Valida caixa, irmãos e tamanho do pai no viewport atual; diferença além de 2 CSS px cancela/restaura a operação. |
| Compactar container | Sugestão apenas para altura/min-height autoral conhecida da sessão, num pai simples com espaço livre. Restaura a baseline da propriedade; não apaga o CSS original. Ação separada e desfazível. |
| Excluir container vazio | Sugestão conservadora para um wrapper simples; não percorre nem apaga ancestrais automaticamente. |
| Comentários | Saem do documento ativo com o subtree e retornam com Undo. Tarefas LLM abertas pedem confirmação; notas não bloqueiam. |
| Salvar editável | Conserva o DOM atual, os spacers e os registros de alvos remanescentes. Não embute a pilha de Undo. |
| Exportar final | Remove UI, comentários e marcas editoriais; mantém a função espacial dos spacers e authored necessário. Sem watermark. |

## 3. Proteções e decisões

Del não é interceptado durante edição de texto, inputs, textareas, selects, Range, composição IME ou foco em componentes web identificáveis. Componentes com Shadow DOM aberto e elementos customizados focados preservam seus atalhos de texto. Isso não amplia o editor para editar o interior desses componentes. Backspace não é atalho estrutural.

Elementos de sistema, html/head/body, elementos marcados como protegidos e raízes convencionais de aplicação são bloqueados. Seleção mista protegida não produz exclusão parcial. Após a confirmação de tarefas, pai/seleção são revalidados para não atingir um alvo diferente.

O Undo usa o HistoryManager que já existia; não há pilha paralela. Um aviso antigo não pode desfazer por cima de edições mais recentes. Conflitos com remoção/movimentação externa do pai preservam a entrada e informam o impedimento. O histórico tem limite herdado de 100 operações e existe apenas durante a sessão; salvar/reabrir não permite recuperar o que já foi excluído. Reset de estilos não substitui Undo de exclusão.

O spacer guarda a caixa do viewport atual. Trechos inline sem caixa própria, estruturas de tabela, floats, sticky, perspectiva e certos estados animados não recebem substituição automática. Não foi criada uma engine responsiva nova. Revise outras larguras após usar preservar espaço.

## 4. Implementação e arquivos

**Novo código de produção:** `src/27-delete.js`.

**Pontos modificados:** `src/10-history.js` (custom Undo/Redo pode falhar sem consumir entrada), `src/55-bindings.js` (ações/teclado/overlay), `src/60-save.js` (limpeza de marca do spacer), `src/99-boot.js` (registro do controlador), `src/ui.html`, `src/runtime.css` e artefatos compilados correspondentes.

**Novos testes e demonstração:** `tests/test_delete_reflow.py`, `tests/fixtures/delete-layouts-host.html`, `INLINE_EDITOR_DELETE_DEMO.html`.

O runner inclui a nova suíte e checa que fontes não mudaram no meio da execução. Os testes herdados que fixavam literalmente 1.6.0/1.5.x passaram a comparar com VERSION.json; suas demais expectativas e contagens foram mantidas. O teste do acesso pelo painel usa cliques reais em Mais → Elemento, sem forçar clique em conteúdo oculto.

**Documentos:** README, CHANGELOG, SKILL, VERSION, COPYRIGHT (apenas versão da distribuição), LLM_COMMENT_PROTOCOL, escopo, auditoria Delete/Reflow, matriz, relatório de validação e este relatório.

**Treze arquivos de fonte preservados byte a byte:**

- `src/00-start.js`
- `src/20-selection-text.js`
- `src/22-text-range.js`
- `src/25-elements-comments.js`
- `src/30-geometry.js`
- `src/35-table.js`
- `src/40-visual.js`
- `src/45-box-model.js`
- `src/50-ui.js`
- `src/52-product-ui.js`
- `src/authored.css`
- `src/authored.js`
- `src/ui-schema.json`

`tools/integrate.mjs`, `tools/build.mjs` e dependências de QA também permanecem iguais à base. Nenhum backend/API/CLI novo, reestruturação de pastas ou dependência de runtime foi adicionado.

## 5. Validação executada

A baseline foi executada novamente: **210/210 PASS + mobilidade PASS**. A release final teve **318/318 PASS + mobilidade PASS** — **210 herdados + 108 novos**.

| Suíte | Casos | Resultado |
|---|---:|---|
| `test_template.py` | 25 | PASS |
| `test_extra.py` | 8 | PASS |
| `test_box_model.py` | 36 | PASS |
| `test_box_edges.py` | 15 | PASS |
| `test_text_range.py` | 43 | PASS |
| `test_text_edges.py` | 20 | PASS |
| `test_comments_duplicate.py` | 15 | PASS |
| `test_landing.py` | 8 | PASS |
| `test_product_ui.py` | 40 | PASS |
| `test_delete_reflow.py` | 108 | PASS |
| `test_mobility.py` | Ensaio adicional | PASS |

A cobertura nova inclui fluxo normal, flex, grid automático/explícito, absolute/fixed, altura/min-height, scrollytelling, preservação de espaço e rollback, listas e escala, identidade/listeners/estado dos nós, tarefas/anchors/Range, conflitos de histórico, compactação, wrapper, menu/teclado/mobile, downloads e a landing recuperada.

Durante o desenvolvimento foram encontrados e corrigidos: base flex do spacer que redistribuía o slot, posicionamento de controles atrás da toolbox em tela estreita, limpeza de seleção após confirmação tornada obsoleta por mutação externa, expansão desnecessária do reset CSS em centenas de longhands e interceptação de Del em input retargeteado de componente web. Os casos correspondentes passaram na execução final. Não há testes FAIL ou NOT_RUN aceitos como aprovação.

O QA de produto herdado verifica oito viewports: 320×568, 375×667, 390×844, 768×1024, 1366×768, 1440×900, 1920×1080 e 844×390. A lixeira tem teste adicional de hit-test/tamanho nas telas pequenas, e os novos casos de landing usam 1440×900 e 390×844.

## 6. Evidência, ambiente e limites

- `qa/run-summary.json`, `qa/release-run.log`, `qa/logs/` e JSON de cada suíte.
- `qa/tested-build-sha256.json`: fontes exatas testadas; runner rejeita alterações durante o ensaio.
- `qa/v161/`: capturas de exclusão/ajuda/sobre, ambiente, auditoria estática e comparação de fontes.
- `qa/evidence/baseline-v160/`: baseline executada e separada da release.

Ambiente: **Chromium 144.0.7559.96 / Linux**, Node 22.16.0, Python 3.13.5, Playwright. Os testes usam `set_content`, viewport emulado e downloads reais. O seletor nativo de gravação do sistema operacional não foi ensaiado; seus caminhos são simulados na suíte herdada.

A tentativa de abertura direta por `file://` foi bloqueada por `net::ERR_BLOCKED_BY_ADMINISTRATOR` neste navegador. Está registrada como **BLOCKED**, não PASS, em `qa/v161/environment.json`. Não se declarou homologação de abertura pelo sistema de arquivos, Firefox, WebKit/Safari ou aparelhos físicos.

A landing é a fixture recuperada da evidência v1.5.4, já incluída na base v1.6.0; não é a fonte oficial do produto. Esta execução não constitui homologação dos HTMLs milho, mandioca, feijão ou abóbora, nem de todo HTML arbitrário.

Excluir um elemento não atualiza automaticamente scripts, componentes, âncoras ou animações que dependam dele. O Undo do nó não reverte efeitos externos iniciados pelo hospedeiro. O comportamento deve ser verificado no HTML real antes de publicação.

## 7. Utilização e reprodução

Para experimentar, abra `INLINE_EDITOR_DELETE_DEMO.html`, ative Editar página, selecione o Bloco B ou um card e use a lixeira. A setinha oferece a preservação de espaço. Para aplicar ao produto, mantenha o fluxo anterior com uma entrada limpa:

```powershell
node .\tools\integrate.mjs ".\produto-original.html" ".\produto-editavel.html"
```

Não aplique o pacote por cima de uma instalação anterior: o integrador a recusa. Guarde o editável anterior com comentários. Um Clean Build usado como base remove as anotações editoriais por definição; não é uma migração que as preserve.

Para repetir a regressão:

```powershell
python -X utf8 .\tests\run_all.py `
  --landing-original ".\tests\fixtures\recovered-landing-host.html" `
  --landing-editable ".\qa\recovered-landing-editable.html"
```

## 8. Integridade e entrega

ZIP de entrada v1.6.0, SHA-256: `49ee43cf33f59c1d653819d71b2bb6db0be7fee246743f0c5f379ada6c733623`.

O manifesto `SHA256SUMS.txt` cobre os arquivos finais do pacote, exceto o próprio manifesto. Os hashes e os bytes dentro do ZIP foram comparados depois do empacotamento. O checksum do ZIP é fornecido também no arquivo externo `.zip.sha256`; não é inserido no próprio ZIP, evitando referência circular.

Entregáveis: `INLINE_EDITOR_PACK_v1.6.1.zip`, `INLINE_EDITOR_DEMO_v1.6.1.html` e `RELEASE_REPORT_v1.6.1.md`.

O aviso ©/Sobre da 1.6 permanece. O titular jurídico continua não informado; a release não atribui propriedade por inferência nem introduz marca obrigatória no HTML final.

**Conclusão: release 1.6.1 aprovada no ambiente e na matriz documentados.**
