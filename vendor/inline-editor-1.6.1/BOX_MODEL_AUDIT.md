# Auditoria executada — Box Model 1.5.2

## Base e limite da rodada

Entrada: pacote e landing v1.5.1. Sem redesign da página nem reescrita do GeometryController. A integração substitui os blocos canônicos do editor e mantém o HTML do host, salvo separadores de linha acrescentados pelo integrador.

## Correções e evidência

| Problema | Solução | Evidência |
|---|---|---|
| !important automático congela espaçamento | Escrita sem prioridade, rollback da tentativa bloqueada, confirmação de força global | Gates 14/15/36 |
| AUTO aparece como pixels | Leitura da declaração, sem utilizar margem usada como intenção original | Gates 6/7/28 |
| Unidades fluidas achatadas | Modelo length/auto/expression/mixed com raw/unidade/origem | Gates 8–13/32 |
| Incremento misto vira 1px para todos | Operação relativa por elemento/lado quando a unidade é comum | Gates 23–26 |
| Margem ineficaz em inline/tabela | Bloqueio contextual, explicação e atalho de Tabela | Gates 16/17 |
| Vínculo vaza para outra seleção | OFF ao mudar conjunto/contexto | Gate 20 |
| Limites existem só no input | Validação no controlador; rejeição/feedback; stepper limitado | Gates 21/22 |
| Falta gap | Geral/row-gap/column-gap em flex/grid; não remove margens | Gates 18/19/29 |
| Reset apaga outras decisões | Restauração da família a partir da baseline, com histórico | Gates 27–30 |

## Casos encontrados durante a implementação

**Shorthand var() no CSSOM.** O navegador pode enumerar padding-top/right/bottom/left com strings vazias, embora o CSS serializado mantenha `padding: var(--sp)`. O parser agora lê o shorthand quando necessário, preservando-o também em reset. Há testes separados para origem em stylesheet e inline.

**Transição não é bloqueio de CSS.** Uma regra `transition: padding-top .25s` faz a medida calculada levar tempo para atingir o destino. A verificação distingue transição em andamento de uma regra que realmente venceu o valor solicitado. A landing possui CTA com transição: os testes medem após estabilização.

**Leitura sem varredura de Base64.** A primeira versão de desenvolvimento percorria CSS serializado de regras irrelevantes, incluindo imagens incorporadas. A versão final filtra seletores/propriedades e usa CSSOM direto, serializando apenas shorthands pendentes quando necessário. Benchmark exploratório da mesma seleção em Chromium: média de sync de ~171 ms para ~9 ms em 8 amostras. Isso não mede FPS do usuário e não é comparação contra a v1.5.1.

## Decisões que não foram alteradas automaticamente

Estilos inline comuns podem vencer media queries comuns; remover !important não cria isolamento por breakpoint. Por isso a UI avisa que a edição vale para o elemento em todas as telas. “Forçar regra” é global e pede confirmação. O pacote não anuncia um modo “Forçar neste breakpoint” inexistente.

Margin não é deslocamento X/Y, margens verticais podem colapsar, e gap não é necessariamente a distância final entre caixas. O editor informa, mas não reestrutura o layout para esconder esses comportamentos.

## Limites explícitos do resolver

Folhas legíveis com seletores usuais, @media, @supports e declarações físicas/lógicas têm cobertura. CSS externo inacessível, camadas ou escopos/nesting cuja cascata não possa ser resolvida com confiança usam **Calculado**. Não se inventa a unidade original nesses casos.

Conversões percentuais de gap em dimensões indefinidas/cíclicas e contextos de escrita não suportados não são presumidas; é exigido valor explícito. Fórmulas existentes são protegidas, não ganham editor de CSS livre nesta rodada.

## Referências de engenharia

A implementação utiliza CSSOM e verifica comportamento em Chromium; o escopo funcional é o documento fornecido no pacote. Para a distinção de medidas resolvidas e semântica de gap, foram consultadas as especificações W3C CSSOM e CSS Box Alignment Module Level 3. O pacote não utiliza bibliotecas externas para ler CSS ou editar o DOM.

- CSSOM, seção Resolved Values: https://www.w3.org/TR/cssom-1/#resolved-values
- CSS Box Alignment, seção Gaps Between Boxes: https://www.w3.org/TR/css-align-3/#gaps

Resultados completos, não inferidos apenas da presença de controles: `qa/evidence/box-model.json`, `box-edges.json`, `gates.json`, `landing.json`.
