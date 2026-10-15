# Matriz de QA — INLINE_EDITOR_PACK v1.6.1

**318/318 casos PASS + ensaio de mobilidade PASS.** Execução completa local em 2026-09-13; 210 casos herdados e 108 de Delete & Smart Reflow. A baseline v1.6.0 também foi executada novamente: 210/210 e mobilidade PASS.

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

## Cobertura nova

Os 108 casos de `test_delete_reflow.py` verificam botão e teclado, Range/inputs/IME, foco em componentes com Shadow DOM, bloqueio durante gestos/modais, proteções de raízes, multisseleção e ancestral/descendente, identidade dos nós e listeners, estado de input, comentários e confirmação de tarefas LLM, registry após reabertura, fluxo/flex/grid/absolute/fixed, preservação de alturas e cenas, spacer e rollback, compactação conservadora, remoção explícita de wrapper, conflitos de Undo/Redo, exportação e downloads reais. Dois casos aplicam exclusão/restauração à landing completa recuperada, em desktop e mobile.

A suite herdada de produto mantém oito viewports: 320×568, 375×667, 390×844, 768×1024, 1366×768, 1440×900, 1920×1080 e 844×390. Help, Sobre e confirmação de exportação são avaliados nesses tamanhos. O controle novo tem verificação específica de visibilidade, hit-test e tamanho de toque em 320×568, 390×844 e 844×390. Isso é emulação de viewport, não teste em dispositivos físicos.

O ensaio de mobilidade verifica acesso à alça, uma entrada por arraste e coalescência de 500 pointermoves. As auditorias estáticas/integridade ficam separadas e não são somadas aos 318 casos.

## Artefatos de evidência

`qa/run-summary.json`, `qa/release-run.log`, `qa/logs/`, JSONs de cada suíte e `qa/tested-build-sha256.json`. Casos e capturas novos em `qa/v161/`; baseline em `qa/evidence/baseline-v160/`.

Os snapshots são do demonstrador local e da landing recuperada. Não são homologação dos HTMLs milho, mandioca, feijão ou abóbora.

## Limites

Chromium 144/Linux. Firefox, WebKit/Safari, aparelhos físicos e seletor nativo de arquivo do sistema operacional não foram homologados. A tentativa de abertura direta por `file://` foi bloqueada por política administrativa do navegador, e não contada como PASS. Consulte `VALIDATION_REPORT.md` e `RELEASE_REPORT_v1.6.1.md`.
