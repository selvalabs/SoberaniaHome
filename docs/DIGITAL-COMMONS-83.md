# Meios digitais e poder popular — issue #83

Issue: https://github.com/selvalabs/SoberaniaHome/issues/83
Branch: `feat/83-digital-common-network`.
Base remota: `80d2140ce6f4270e7b434852198047417b188117` (`main`, v0.3.0).
Dependência de prévia: PR #82, head `3c0ebc9f96a735fbf2f3cd30f8c6a3a419d3afb9`,
incorporada sem reescrita de histórico em `e28004e3e3efb407a22d56010398f1a64a826e0a`.
Não houve merge na main nem publicação de release.

## O que a dobra comunica

A comunicação, o trabalho e a cultura produzidos pelo campo popular também
alimentam ambientes digitais controlados por interesses comerciais e financeiros.
Disputar as redes e desenvolver meios próprios amplia a capacidade de organização.
A primeira gravura expõe a captura; a segunda apresenta uma resposta construída
pelo mesmo coletivo, com comunicação, dados e ferramentas próprios. O desfecho
não sugere independência instantânea de toda infraestrutura.

A seção entra entre automação e portfólio, como seção 03. As 16 seções anteriores
permanecem; índice, etiquetas, contador e manifesto de empacotamento passam a 17.
Os IDs, URLs e âncoras das seções anteriores continuam iguais.

## Arte e movimento

A primeira proposta, centrada em hardware, foi descartada após avaliação do usuário.
A direção escolhida foi gravura política e popular, com pessoas, trabalho,
comunicação e captura de dados explícita. Fonte, prompt completo e hash estão em
[art/NETWORK-83-PROMPT.md](art/NETWORK-83-PROMPT.md). A gravura-resposta tem
seu próprio [prompt e hash](art/NETWORK-83-SOLUTION.md).

O mesmo motor de máscara, lápis e luz revela a nova gravura raster em percursos
contínuos. O scroll controla quatro atos: produção, captura, disputa e uma
resposta em construção. A segunda gravura começa depois da conclusão da primeira
e de uma pausa; o fim mantém a resposta e os glows visíveis para leitura. Os cabos acrescentam tensão com resposta amortecida e pontas fixas;
partículas seguem as curvas e diminuem junto às extremidades. Conexões coletivas
ganham luz na gravura-resposta; os fluxos de captura pertencem apenas à primeira
imagem. As duas imagens usam namespaces SVG separados e nunca sobrescrevem a fonte.

O motor de reveal ganhou opções de rodapé reservado e isolamento de blocos,
ativadas apenas nesta cena. Um ato ocupa a janela de leitura por vez; telas
curtas percorrem suas linhas sem perder a headline e a composição. As demais
dobras mantêm os valores padrão. O tempo desta cena usa multiplicador 1.8,
com avanço linear de tinta e pausa entre as imagens. O parágrafo concluído fica
visível até o início do próximo reveal, evitando uma janela vazia na troca.
A duração nova entra no relógio da folha,
preservando a queda mais lenta durante o pin. Não há RAF, timer ou interceptação
de scroll adicionais.

A seção adicional muda a fase da queda na chegada às galerias. A regressão
mediu um caso em que o deslocamento da queda compensava parte da espiral. A
projeção horizontal da hélice em telas estreitas passou de 12% para 15% da
largura, com o mesmo teto de 104 px; queda pendular, rotação e eixo vertical
permanecem. O teste percorre 101 pontos sincronizados de cada galeria para
avaliar todos os giros, preservando a exigência de deslocamento superior a 100 px.

## Leitura, fontes e operação

Sem JavaScript, com movimento reduzido ou em modo de leitura, o conteúdo completo
fica no fluxo nativo e as duas ilustrações permanecem visíveis, uma abaixo da outra. Os links de referência são
acessíveis por teclado. A impressão usa o estado completo e restaura o estado
anterior da animação ao retornar.

Referências: FTC, *A Look Behind the Screens* (2024), sobre coleta e monetização
de dados, e *Bringing Dark Patterns to Light* (2022), sobre interfaces
manipulativas. A gravura e o posicionamento político são editoriais; a cena não
é uma medição nem um diagrama literal de uma empresa específica.

Prévia local: porta 4204, no Wi-Fi. A porta 4203 não foi reaproveitada ou encerrada.
Rollback da experiência: usar a revisão de copy `3c0ebc9` ou a release pública
`v0.3.0` (`80d2140`). Sem migração de dados, mudança de Worker, VPS ou sincronização
de mirror. Dependências não foram alteradas; a instalação existente do workspace
é compartilhada por junction local ignorada pelo Git.

## Validação local

- Tipos, 64 testes Node, build estática e check-static passaram; npm audit não
  encontrou vulnerabilidades, assim como a consulta das dependências Python
  fixadas com `--no-deps --disable-pip` (sem resolução de transitivas).
- Nova cena: 1440×900, 1280×680, 1024×768, 390×844, 360×640, 320×480 e 844×390.
  Todas as linhas foram alcançadas durante o reveal; headline, arte e rodapé
  permaneceram dentro do viewport. Reversão, impressão/restauração, repouso,
  modo leitura, movimento reduzido e versão sem JavaScript passaram.
- As cinco gravuras passaram nas regressões de máscaras, lápis, luz e fallback
  sem Canvas; navegação/índice, controles, galerias, folha e privacidade passaram.
- A amostragem final de 101 posições mediu deslocamento horizontal de 115 px
  na galeria Trabalho e 180 px no Laboratório. Os limites de continuidade,
  rotação, reversibilidade e enquadramento dos testes foram mantidos.
- O pacote local no prefixo `/SoberaniaHome/` passou na verificação de referências locais,
  17 seções, metadados e política de IA externa desativada. Nova cena no prefixo
  real passou nos sete viewports; a edição pública local passou em 390×844,
  1440×900 e sem JavaScript. Artefato de teste v0.0.0, sem tag ou publicação.
- Prévia Wi-Fi respondeu HTTP 200 na porta 4204 com a copy final. Os resultados
  e capturas detalhados ficam em `.playwright/` local; o CI completo da PR
  continua sendo uma verificação separada antes de homologação e merge.

## Revisão do desfecho visual

O quarto ato apresenta publicação própria, informações organizadas/exportáveis e
pessoas capazes de operar, adaptar e manter os meios. O desenho da resposta
parte da mesa de publicação, cresce para os espaços de comércio/aprendizagem e
termina no território agroecológico. Seu traçado tem 2282 guias, além dos 1576 da
primeira gravura. O arquivo novo acrescenta 3.08 MB e mantém o original intacto.

A timeline da primeira imagem chega ao fim até p=0.42. Os três primeiros textos
terminam até p=0.51; a transição ocorre entre p=0.54 e p=0.65. O desenho da
resposta começa em p=0.56 e termina até p=0.95,
reservando o trecho final para leitura e iluminação. Todos os valores vêm do
scroll, com reversão determinística e sem relógio de animação independente.
A impressão mostra as duas gravuras em sequência e todos os quatro textos.
