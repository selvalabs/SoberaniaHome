# Revisão integral da experiência — #87

Issue: https://github.com/selvalabs/SoberaniaHome/issues/87

Branch: `feat/87-complete-experience-review`.

Base autorizada pelo usuário: `bd8661efc81f88af9c0556287e03eca945218b5e`, da versão minimalista na porta 4205. A comparação do PR deve usar `study/85-animation-led-narrative`. Main e produção ficam fora desta revisão.

## Resultado da revisão por dobra

| Dobra | Avaliação e ação |
| --- | --- |
| 01 · Hero | Preservar composição, reveal, ações e folha. Validar viewport, teclado e destino de Conversar. |
| 02 · Trabalho e tempo | Preservar a gravura e a leitura por etapas. Otimizar seu arquivo sem mudar os pixels. |
| 03 · Meios digitais | Manter diagnóstico e resposta, com as duas gravuras completas e reversíveis. Otimizar ambos os arquivos. |
| 04 · Trabalhos | Corrigir identificação do editor sem atribuir a versão atual às capturas antigas. Manter quatro produtos e todas as views. |
| 05 · Saberes em comum | Preservar a animação e a fonte no Caderno; otimizar a gravura. |
| 06 · Processo | Preservar seis peças, explicações e saídas em linha própria. Conferir montagem, seleção e pin no mobile. |
| 07 · Laboratório | Remover a etiqueta interna “ELARA primeiro”; manter ELARA na primeira posição, cinco projetos e os scrolls independentes. |
| 08 · Organização coletiva | Preservar demonstração, estados e seu retorno pelo Caderno. |
| 09 · Entrega | Preservar gravura e documentos inspecionáveis; otimizar a imagem. |
| 10 · Soberania | Preservar as três rotas e explicações progressivas. Conferir teclado e leitura sem JavaScript. |
| 11 · Nada existe isolado | Preservar órbita, nove elementos, VIDA e integração da folha. |
| 12 · Sobre | Distinguir dos passos do Processo: território, cooperação e acesso, com narração curta. |
| 13 · Manifesto | Preservar bússola, dez princípios, teclado e leitura completa em impressão. |
| 14 · Referências | Corrigir grade ao mudar de desktop para celular, preservando descobertas e rodada. Mostrar curadoria completa sem JavaScript e na impressão. |
| 15 · Caderno | Cada um dos 19 artigos ganha retorno à cena que desenvolve, além de voltar ao Caderno. Conferir prefixo do GitHub Pages. |
| 16 · Mesa de possibilidades | Preservar quatro exemplos locais, passos, exportação e explicação sobre IA. Conferir comportamento sem backend. |
| 17 · Contato | Substituir o percurso circular por formulário local de preparação. Canal de envio será implementado depois, conforme orientação do usuário. |

## Critérios de implementação

- Sem remoção de dobras, artigos, gravuras, projetos ou fontes.
- Gravuras: PNGs originais e traçados preservados. Cinco WebPs lossless com RGBA decodificado idêntico aos PNGs: 11.230.462 → 5.681.942 bytes, redução de 49,4% nos arquivos usados pelas cenas.
- O formulário não envia nem armazena dados. Copia a mensagem; sem Clipboard API (comum no HTTP do Wi-Fi), baixa um TXT. Mostra essa limitação antes dos campos e mantém os valores para edição.
- A grade do caça-palavras guarda seus layouts por rodada, preserva as descobertas e adapta 32/14 colunas ao breakpoint, inclusive durante a tinta.
- Revisão por capturas de todas as 17 dobras em 1440×900 e 390×844, complementada por testes dos estados finais, leitura, impressão e interações.

## Entrega e reversão

Prévia local isolada; sem merge, release, publicação ou alteração em VPS/mirror. Reversão: a branch-base e o commit `bd8661e` continuam disponíveis. O formulário fica pronto para uma futura integração de envio, que exige definir o canal e o tratamento das mensagens.

Resultados dos checks e identificação final da branch serão registrados no PR.
