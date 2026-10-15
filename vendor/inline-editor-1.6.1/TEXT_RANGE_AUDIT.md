# Auditoria — edição textual 1.5.3

## Base efetivamente utilizada

`INLINE_EDITOR_PACK_v1.5.2.zip`, extraído em área de trabalho separada. O pacote anterior e a landing anterior não foram sobrescritos. A integração final usa o HTML oficial limpo da Rotina, não um template de demonstração ou um editor antigo com outro runtime acoplado.

## Problemas da baseline verificados no código

O primeiro gesto de edição era habilitado no click, tarde para a seleção nativa do pointerdown. O botão Editar texto fazia focus e select-all para contornar isso. `TextEditor.apply` embrulhava o fragmento inteiro de extractContents em um span; operações repetidas podiam acumular wrappers e ranges de células podiam carregar blocos para dentro deles. A captura de seleção só armazenava Range não colapsado; não havia estado separado para caret/bloco ou navegação entre roots por Tab. A cor era aplicada apenas no change.

## Implementação

A ativação foi antecipada para pointerdown, sem cancelar o comportamento nativo de seleção. O click posterior não reseleciona o root nem apaga o range quando o gesto já o ativou. O TextRangeController preserva bookmarks e direção dentro de um root. A seleção da página fica congelada durante o uso da toolbox, inclusive nas transições blur/change em que activeElement é momentaneamente body.

O formatter coleta nós textuais intersectados, divide as fronteiras da seleção e aplica apenas a propriedade escolhida nos runs. Não embrulha parágrafos ou containers em spans. Um run que cobre um fragmento reaproveitável recebe as próximas propriedades; um run parcialmente selecionado é dividido em segmentos equivalentes antes do ajuste. Semântica e href do host ficam preservados. Normalização só simplifica spans marcados pelo editor e sem atributos estranhos à autoria.

Tab usa roots textuais visíveis pela ordem do DOM. Textos auxiliares da toolbar e spans de formatação não são passos extras. Células permanecem unidades de edição; seus textos podem conter mais de um bloco. A navegação commita a digitação pendente, mas não cria por si só uma entrada de histórico.

Cor/marca-texto mantêm uma transação entre input e change/saída; cada sessão pode ser desfeita inteira. Formatação parcial registra snapshot profundo do root. Digitação e composição usam agrupamento temporal existente, sem quebrar a transação no meio da composição.

## Correções adicionais necessárias para cumprir o escopo

**Foco:** restaurar a seleção nativa durante blur de campo numérico podia deslocar o foco da toolbox para a página. Corrigido mantendo intenção de foco explícita, sem impedir o uso nativo de inputs/selects.

**Quebras:** o Chromium pode criar DIV dentro de P após Enter num contenteditable. A entrada continua nativa, mas os containers de linha recém-criados e inválidos são normalizados para BR, com marcador transitório de caret removido imediatamente. Isso evita alteração de estrutura ao reabrir o HTML salvo. As células com blocos válidos não são convertidas.

**Movimento reduzido:** a opção auto do scroll ainda podia herdar smooth da página. O ajuste transitório dos scrollers evita animação nesse caso e é restaurado antes de salvar.

## Limites explícitos

- Não é um rich-text completo nem cria estado de formatação para texto futuro com caret colapsado. Sem range, a tipografia atua no bloco.
- Seleção cruzando roots independentes é recusada, não convertida em formatação global. Multiseleção aplica aos blocos completos.
- Cores aplicadas ao bloco não reescrevem silenciosamente cores explícitas de todos os descendentes do host. Para sobrescrever um trecho desses descendentes, selecione o trecho.
- Line-height de um fragmento pode aumentar a linha onde ele aparece; somente a propriedade do trecho é escrita, mas a disposição visual responde ao CSS normal.
- A remoção de sublinhado herdado de U preserva o nó U usando isolamento inline-block no trecho. Em seleções longas esse isolamento pode alterar a quebra visual; revisar o resultado. O toggle simples de sublinhado em runs não precisa desse isolamento.
- Testes de composição exercitam eventos de composition/insertText; não representam teclado IME físico de todos os sistemas. Mobile exercita toque/caret em Chromium emulado, não as alças nativas de seleção de todos os Androids/iOS.
- Sem nova geração de assets, mudança de copy, redesenho de hero, dependência remota ou publicação automática.

## Evidência

Consulte `qa/text-range-results.json`, `qa/text-edges.json`, `qa/run-summary.json` e `qa/tested-build-sha256.json`. Os resultados finais e limites de ambiente estão em `VALIDATION_REPORT.md`. O gate de cor faz três previews antes do commit; o teste de repetição aplica 80 alterações e verifica que permanece um único run, sem aninhamento redundante.
