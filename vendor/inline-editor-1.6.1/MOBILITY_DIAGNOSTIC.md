> Documento histórico da v1.5.1, preservado para referência. A regressão desta entrega está em VALIDATION_REPORT.md e qa/evidence/mobility-152.json.

# Diagnóstico de mobilidade — Inline Editor 1.5.1

## Sintoma reportado

Alguns assets pareciam travar ou engasgar ao serem arrastados, apesar de o restante do editor continuar funcionando.

## Causa 1 — grab coberto pela toolbox

A toolbox tinha `z-index` superior ao overlay de seleção. Em certos assets, especialmente quando a seleção ficava próxima à toolbox, o botão visual `⠿ Mover` aparecia na região coberta pela toolbox. O hit-test real do navegador atingia a toolbox e não o grab.

O caso reproduzido com `.device-tablet` retornava, na v1.5.0, um elemento interno da toolbox no `document.elementFromPoint(...)`. Na v1.5.1 o mesmo teste retorna `#ie-move-handle`.

### Solução

O overlay calcula posições candidatas para o grab (topo, base e laterais), verifica colisão com a toolbox/viewport e escolhe uma posição acessível.

## Causa 2 — excesso de trabalho por `pointermove`

A v1.5.0 executava o pipeline inteiro em cada evento de mouse:

1. leitura do ponteiro;
2. cálculo de snapping;
3. leitura de `getBoundingClientRect`/estilos;
4. escrita de estilos;
5. atualização completa do overlay.

Mouses modernos podem enviar centenas de eventos por segundo. Isso pode saturar o main thread mesmo quando cada callback isolado parece curto.

### Solução

A v1.5.1 coalesce eventos com `requestAnimationFrame`. Vários eventos entre dois frames se tornam uma única atualização visual, usando sempre a posição mais recente.

As linhas de snap também são capturadas no início do gesto, reduzindo leituras repetidas.

## Causa 3 — layout e animações concorrentes

Alguns assets estão dentro de blocos com animações/transições de reveal. Se um ancestral ainda se move durante o drag, o referencial visual do asset também muda. Elementos `absolute/fixed` ainda provocavam layout ao alterar `left/top` continuamente.

### Solução

Durante o gesto:

- o editor pausa temporariamente animações/transições relevantes do elemento/ancestrais;
- usa `translate` temporário no compositor para o preview;
- consolida a geometria autoral somente no release;
- restaura as animações após o gesto.

## Benchmark de regressão

Arquivo: `qa/evidence/mobility-comparison.json`.

| Métrica | v1.5.0 | v1.5.1 |
|---|---:|---:|
| média handler | 2,152 ms | 0,141 ms |
| p95 | 4,1 ms | 0,3 ms |
| máximo | 5,9 ms | 0,4 ms |
| hit-test do grab do tablet | toolbox | `#ie-move-handle` |

Teste adicional da v1.5.1 (`mobility-151.json`): burst de 500 `pointermove` foi condensado para 1 frame processado na execução registrada e o drag criou uma única entrada de histórico.

## Limite conhecido da landing

Algumas seções do host usam `overflow:hidden`. Se um elemento for movido para fora desses containers, ele pode ser **recortado** pelo layout. Isso não é travamento do motor de drag. A v1.5.1 não muda automaticamente o `overflow` do site porque isso poderia alterar a composição responsiva. Caso seja necessário, pode ser criada depois uma opção autoral explícita de “permitir transbordar”.

## Ambiente

Diagnóstico/benchmark executado em Chromium/Linux. O problema de alta frequência de eventos é especialmente relevante para mouses Windows de polling alto, mas esta entrega não foi ensaiada fisicamente no Chrome/Windows do usuário.
