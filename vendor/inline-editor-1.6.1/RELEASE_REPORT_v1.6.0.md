# Relatório de release — INLINE_EDITOR_PACK v1.6.0

**Resultado: PASS — homologação local.**  
**Data:** 2026-09-13. **Base:** 1.5.4. **Uso:** interno.

## Resumo da entrega

A arquitetura e o fluxo operacional permanecem: HTML original → integração canônica → edição local → cópia editável ou final. Esta rodada não cria backend, API, GPT customizado, novos comandos de produção, Core headless, migração de localStorage, temas, compressão de mídia, Smart Clean Build, DRM ou watermark.

Foram entregues o botão © e Sobre, a Central de Ajuda com oito guias e busca local, o contexto de seleção, a revisão de nomenclaturas e a exposição do Clean Build existente como Exportar final. Os modais possuem navegação por teclado, Escape, retorno de foco e scroll interno.

## Contrato das ações

| Ação | Comportamento validado |
|---|---|
| Fechar edição / × | Fecha ferramentas, com confirmação se houver trabalho pendente. Não salva ou exporta. |
| Salvar editável / Ctrl+S | Guarda editor, alterações, comentários e tarefas; reabre com UI fechada. |
| Exportar final | Pede confirmação e usa o serializer existente com clean:true; remove UI e dados editoriais, preservando resultado e suporte authored. |

Exportar final não marca o editável como salvo, pois comentários e tarefas não fazem parte da versão final. Cancelar a confirmação ou o seletor preserva o trabalho. Não foi adicionado branding visual ao HTML publicado.

## Baseline e regressão

A baseline 1.5.4 foi reconstruída e executada antes das mudanças: **170/170 casos PASS**, mais ensaio de mobilidade PASS. Sua evidência está separada em `qa/evidence/baseline-v154/`.

Na release, o runner unificado executou **210/210 casos PASS**: 170 herdados e 40 novos. O ensaio de mobilidade também passou, sem ser contado artificialmente como um caso da soma.

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
| `test_mobility.py` | Ensaio adicional | PASS |

Os testes existentes mantêm seus casos e critérios; somente as expectativas explícitas de versão foram atualizadas. Nenhum caso foi desabilitado para atingir a contagem. O runner exige quantidade correta e status PASS nos JSONs, além de exit code zero.

## Novos testes

Cobertura de identificação e cabeçalho; Ajuda e Sobre; busca com acentos/maiúsculas e resultados vazios; busca não interpretada como HTML; seleção simples/múltipla e Range; ausência de alterações em histórico/dirty state; minimizar; fechamento com confirmação; salvar/reabrir; reset do estado transitório dos modais; exportação e manutenção de comentários no documento vivo; Ctrl+S; simulação do seletor; fallback; prevenção de downloads duplicados; foco/teclado; execução offline; preservação byte a byte do host pelo integrador; e limites dos modais em oito viewports.

Na primeira execução do novo harness, três verificações precisaram ser corrigidas: uma contava exatamente dois nós authored, ignorando o stylesheet derivado de selos que o motor já gera; duas simulações de picker retornavam a função atribuída para o avaliador Playwright, que a executava imediatamente. O teste passou a verificar explicitamente os IDs do runtime authored e a instalar os mocks dentro de funções. Essas correções não afrouxaram a preservação exigida nem alteraram o motor. A execução integral foi repetida após as correções.

## Preservação dos motores

Os **12 arquivos** abaixo são byte a byte idênticos à baseline, conforme `qa/v160/unchanged-engine-sources.json`:

- `src/10-history.js`
- `src/20-selection-text.js`
- `src/22-text-range.js`
- `src/25-elements-comments.js`
- `src/30-geometry.js`
- `src/35-table.js`
- `src/40-visual.js`
- `src/45-box-model.js`
- `src/99-boot.js`
- `src/authored.js`
- `src/authored.css`
- `src/ui-schema.json`

O integrador mantém o algoritmo e suas proteções; sua alteração é a leitura da versão para a mensagem de identificação. O serializer não foi reimplementado: recebeu a ocultação do novo modal ao salvar e uma opção clean no mesmo caminho de gravação, com nome final e tratamento correto do estado pendente.

## Responsividade e inspeção visual

Os testes dos novos modais cobrem **320×568, 375×667, 390×844, 768×1024, 1366×768, 1440×900, 1920×1080 e 844×390**. Ajuda, Sobre e confirmação de exportação permanecem dentro do viewport. A ajuda tem scroll interno e o fechamento continua acessível em artigos longos.

Foi executado também um smoke de Ajuda/Sobre na landing recuperada em 1440×900, 390×844 e 320×568, sem pageerrors. As capturas de desktop e mobile foram inspecionadas. Evidências em `qa/v160/`; a regressão de composição visual original/integrada permanece em `qa/landing-results.json`.

## Integridade e reprodução

ZIP base recebido, idêntico nas duas cópias anexadas:

```text
1d40fbdf58988ddb2280ae4d9417a2338868be3aa59ef52d99160e73e00a126e
```

SHA-256 do runtime compilado testado:

```text
c8667de9e19fa99ab782c72996d759f809c05d5009a776c5ac765df47e125a33
```

`qa/tested-build-sha256.json` vincula o resultado aos arquivos-fonte testados. `qa/v160/static-audit.json` registra sintaxe, IDs únicos, versão compilada, build repetível em bytes e manutenção dos mesmos dois tools de produção. `SHA256SUMS.txt` cobre todos os arquivos finais, exceto o próprio manifesto.

O comando reproduzível, a instalação das dependências de QA e o uso do integrador permanecem no README. A suíte nova está em `tests/test_product_ui.py` e foi adicionada ao runner existente, sem novo CLI de produção.

## Limites e pontos de governança

A execução foi feita em **Chromium 144.0.7559.96, Linux**, com viewports emulados. Não foram homologados Firefox, WebKit/Safari, aparelhos físicos nem o seletor nativo do sistema operacional. Os caminhos de sucesso, cancelamento e falha do File System Access foram simulados; os testes de fallback fizeram downloads reais pelo Chromium. A tentativa adicional de carregar diretamente o arquivo via `file://` foi bloqueada por política administrativa do navegador (`net::ERR_BLOCKED_BY_ADMINISTRATOR`). A execução dos HTMLs no harness usa `set_content`; a abertura direta pelo sistema de arquivos não foi homologada neste ambiente. Esse bloqueio está registrado em `qa/v160/file-protocol-smoke.json` e não foi contado como PASS.

A página completa usada nas regressões é `tests/fixtures/recovered-landing-host.html`, recuperada de `qa/landing-edited-reopen.html` do ZIP 1.5.4. **Não é o arquivo original oficial da landing.** A recuperação utilizou o serializer 1.5.4 e removeu os blocos authored para evitar duplicar sua instalação. Preserva o estado que constava da evidência salva, incluindo edições anteriores; nenhuma equivalência com a fonte oficial não fornecida é alegada. A mesma fixture foi usada na baseline e na 1.6.0 e está incluída para reprodução.

Os testes cobrem o demonstrador e essa landing de QA. Não representam homologação de todos os HTMLs possíveis, nem dos produtos milho, mandioca, feijão ou abóbora. O integrador continua exigindo uma entrada limpa; não foi criado upgrade automático de HTML já integrado.

O titular jurídico não foi informado. O aviso identifica apenas o produto Inline Editor e reserva direitos aos respectivos titulares. A identificação jurídica e os termos de distribuição externa permanecem a definir antes da fase pública.

## Conclusão

Escopo incremental 1.6.0 executado, regressão local aprovada e artefatos preparados para o mesmo fluxo interno da 1.5.4. Não há pendência técnica conhecida nos casos testados; isso não constitui garantia de edição universal ou homologação de navegadores não ensaiados.
