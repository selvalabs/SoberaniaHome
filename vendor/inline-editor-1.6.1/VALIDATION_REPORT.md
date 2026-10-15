# Relatório de validação — INLINE_EDITOR_PACK v1.6.1

**PASS — LOCAL.** Data: 2026-09-13.

Baseline executada: **v1.6.0 — 210/210 + mobilidade PASS**. Release executada: **v1.6.1 — 318/318 + mobilidade PASS**. Nenhuma suíte herdada foi retirada e os 108 novos casos participaram da execução completa, sem filtros.

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

## Integridade da execução

O runner reconstrói os fragmentos/template, valida sintaxe, integra a landing e exige contagens/status dos JSONs além de exit code zero. Filtros de execução parcial são removidos. Os hashes de `src/` são comparados antes/depois da execução; qualquer mudança impede homologação. `qa/tested-build-sha256.json` registra o build testado.

Treze arquivos de fonte permanecem byte a byte iguais à v1.6.0, incluindo os motores de geometria, Box Model, texto/Range, comentários/duplicação e authored. A lista completa está em `qa/v161/unchanged-sources.json`. HistoryManager, bindings, UI, serialização e boot receberam os pontos mínimos de integração; `27-delete.js` é o módulo novo.

`qa/v161/static-audit.json` verifica build compilado, sintaxe, integrador inalterado, instalação única, rejeição de entrada já integrada e preservação exata do host fora dos blocos inseridos. O manifesto final está em `SHA256SUMS.txt`; sua própria entrada não é incluída.

## Ambiente e limites

Chromium **144.0.7559.96**, Linux; Node **v22.16.0**, Python **3.13.5** e Playwright. As páginas são executadas por `set_content`; os testes de fallback realizam downloads reais do navegador e reabrem o conteúdo. O seletor nativo do File System Access não foi ensaiado: seus caminhos de sucesso, cancelamento e erro são simulados na suíte herdada.

A abertura direta do demo por `file://` foi tentada e bloqueada com `net::ERR_BLOCKED_BY_ADMINISTRATOR`, conforme `qa/v161/environment.json`. Não é um teste aprovado desse modo de abertura e não se trata de uma alegação de compatibilidade com Safari/Firefox/aparelhos físicos.

A landing completa de QA é `tests/fixtures/recovered-landing-host.html`, recuperada da evidência salva da v1.5.4 e incluída na v1.6.0. Não é a fonte oficial da landing. A mesma entrada é usada na baseline e nesta release; nenhuma equivalência com um original não fornecido é alegada. O demonstrador específico é `tests/fixtures/delete-layouts-host.html`.

Preservar espaço valida a geometria no viewport atual, não todas as media queries. Scripts próprios que dependem do nó removido precisam de validação no produto real. Desfazer mantém referências só na sessão, limitado ao histórico herdado; não recupera exclusões depois de reabrir um arquivo salvo.

O fluxo de distribuição continua local. O integrador exige uma entrada limpa e não faz atualização automática de um HTML já integrado. Não foram implementados backend, nova CLI, API, SaaS ou dependência remota.

Consulte `RELEASE_REPORT_v1.6.1.md` para alterações e decisões, e `DELETE_REFLOW_AUDIT.md` para os limites precisos de cada operação.
