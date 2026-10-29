# Revisão integral — issue #85

Goal: revisar todas as 17 dobras, preservando animações e reduzindo prosa obrigatória.
Branch: study/85-animation-led-narrative. Baseline da expansão: a1e3487.
Comparação anterior: 892fc94. Main: 80d2140 / v0.3.0, preservada.
Cada ajuste é commitado separadamente. O PR #86 reúne a revisão para homologação.

## Registro dos ajustes

- Manifesto: bússola restaurada como instrumento de seleção dos dez princípios.
  A agulha gira ao mudar o princípio; um enunciado curto aparece por vez.
  Conteúdo completo e consequências continuam no artigo original do Caderno.
  Teclado usa o mesmo controle de tabs das ferramentas; sem JS todos os enunciados permanecem disponíveis.

## Critérios de conclusão

Todas as 17 âncoras preservadas e avaliadas. Manter cinco gravuras, folha, giros,
duas galerias, quebra-cabeça, espiral, bússola, caça-palavras, previews e Mesa.
Conteúdo longo preservado no Caderno; instruções e limites funcionais visíveis.
Validar leitura/reduced-motion/no-JS, teclado, contraste, desktop/mobile/landscape,
conteúdo completo, SEO, Pages e servidor Wi-Fi. Sem merge, release, VPS ou mirror.

- Saberes: gravura original centralizada, três falas ligadas à pesquisa/ofício/participação; argumentos e citação de Freire preservados em /caderno/saberes-em-comum/.

- Processo: seis peças, encaixes e seleção preservados; seis verbos/saídas curtos, com narração apenas na peça em foco. Método integral em /caderno/antes-do-codigo/.

- Trabalho: quatro interfaces, seletores e estados preservados; resumo de uma frase e tags por produto. Recursos MCP, proteção de dados, personalização e condições do programa de parceiros continuam identificáveis. Descrições completas em /caderno/ferramentas-em-uso/.

- Laboratório: cinco cards e todas as telas/landings preservados, ELARA continua primeiro; resumos de uma frase, recursos e estágio visíveis. Phones mantêm scroll independente e proporção; explicação completa em /caderno/outras-ferramentas/.

- Tecnologia: colagem e interface cooperativa preservadas no centro; tarefa em foco acompanha três falas curtas no scroll nativo, sem nova duração pinned. Contexto integral em /caderno/tecnologia-no-trabalho/.

- Entrega: gravura central com três falas; documentos e tabs preservados num inspetor nativo sob escolha. Argumentos originais em /caderno/capacidade-de-continuar/. As cinco gravuras agora mantêm reveal também em viewports baixos.

- Soberania: diagrama animado e três rotas/tabs preservados; caminhos e resultados curtos assumem a explicação. Contexto técnico, formação e infraestrutura brasileira preservados em /caderno/construir-no-brasil/.

- Espiral: órbitas, nove palavras, vida no centro e trajeto da folha preservados. Conexões narradas por frases curtas; textos longos de cada palavra em /caderno/nada-existe-isolado/.

- Sobre: identidade factual e Brasil permanecem explícitos; escutar/construir/compartilhar ganham um percurso visual conduzido pelo scroll. Apresentação original em /caderno/laboratorio-com-os-pes-no-mundo/.

- Referências: caça-palavras, 110 nomes, lista acessível, mapa, brilho e tinta/embaralhamento de cinco segundos preservados. Instrução reduzida a uma ação; o aviso de não endosso continua visível.

- Caderno: três chamadas curtas e biblioteca em três grupos sob escolha, com todas as leituras preservadas. O índice não vira uma nova parede de parágrafos; cada artigo mantém rota, fontes e metadados próprios.

- Mesa: ferramenta funcional preservada, sem alterar os quatro roteiros ou o contrato da IA. Passos viram etapas expansíveis de uma sequência; explicações, dados/decisões e próximo teste ficam sob escolha. Privacidade, origem e estados continuam visíveis; exportação preserva o resultado completo.

- Contato e rodapé: pergunta direta, três campos de oferta e duas ações. Localização, navegação, modo de leitura e a chegada da folha ao monte final preservados; apresentação original arquivada junto do texto Sobre.

- Conferência visual: bússola explicitamente visível no celular, ponteiro no anel externo e link de aprofundamento com contraste no fundo escuro.

- Caderno mobile: chamadas reduzidas a três temas clicáveis, sem sinopses ou links duplicados. Os títulos completos permanecem nos artigos, na biblioteca e no nome acessível de cada chamada.

- Revisão editorial do arquivo: espaçamento de pontuação normalizado nos textos transferidos, mantendo palavras, fontes e conteúdo.

- Preview mobile conferido por captura: largura dos celulares passa a derivar da altura real do contêiner, reservando espaço para título, sombra e instrução. Corrige corte da moldura sem alongar o aparelho ou alterar seu scroll interno.

## Cobertura final das 17 dobras

| Dobra | Comunicação e instrumento preservado |
| --- | --- |
| 01 Hero | Oferta de sites, software e automações; árvore, folha, reveal e duas ações. |
| 02 Tempo | Gravura sobre produtividade com três falas; argumentos e Lenin no Caderno. |
| 03 Meios digitais | As duas gravuras: captura e construção de meios próprios; três falas e fontes. |
| 04 Trabalho | Quatro produtos com interfaces, tabs, estágio e recursos curtos. |
| 05 Saberes | Gravura central; pesquisa, ofício e participação narram a construção. |
| 06 Processo | Seis peças; verbos e saídas, com explicação na etapa em foco. |
| 07 Laboratório | Cinco cards, todas as landings, ELARA primeiro, UVE e RAG reais. |
| 08 Tecnologia | Colagem cooperativa e tarefa em foco no scroll nativo. |
| 09 Entrega | Gravura e três falas; documentos completos sob escolha. |
| 10 Soberania | Três rotas animadas, caminhos e resultados curtos. |
| 11 Conexões | Nove palavras, VIDA e folha em órbita; legendas curtas. |
| 12 Sobre | Origem factual e Brasil; percurso escutar/construir/compartilhar. |
| 13 Manifesto | Bússola, dez princípios, teclado e aprofundamento individual. |
| 14 Referências | Caça-palavras, 110 nomes, tinta, mapa e lista acessível. |
| 15 Caderno | Três chamadas; 19 leituras em três grupos voluntários. |
| 16 Mesa | Quatro roteiros, etapas expansíveis, privacidade e exportação completa. |
| 17 Contato | Oferta e duas ações; navegação, localização e pouso da folha preservados. |

## Medição de prosa

Comparação reproduzível: texto dos elementos `p` dentro de cada uma das 17 seções,
entre o HTML da comparação `892fc94` e a revisão integral. Inclui parágrafos
recolhidos e os nomes do caça-palavras; exclui títulos, links isolados, labels e
conteúdo dos artigos. De 2.932 para 941 palavras nessa definição: cerca de 68% de
redução. Não é uma medição de conversão, compreensão ou de todas as palavras da
página. Os 110 nomes e a informação funcional/privacidade da Mesa são preservados.

Os argumentos completos estão em 19 artigos com rotas próprias, fontes, metadados
Article e entradas em sitemap/llms. Foram comparados os parágrafos migrados com os
originais, normalizando apenas marcação e espaços de pontuação.

## Validação local

- TypeScript, 65 testes Node, build Astro (23 páginas), check-static e diff-check.
- Cinco gravuras: sete viewports de 320×480 a 1440×900 e landscape, ordem,
  reversibilidade, impressão/restauração, repouso e modos de leitura/reduced-motion.
- Todas as 17 dobras: oito viewports de 320×480 a 844×390; hero, fim dos capítulos,
  resize da toolbar e teclado nos documentos. Conferência visual de celular/desktop.
- Duas galerias: scrub, gestos, controles, reversão e saída em dez viewports;
  leitura interna, seleção de telas e decodificação dos previews. Molduras de
  celulares verificadas dentro do rail, com instrução única fora dele.
- Contraste em ambos os temas; área segura; campos em foco; nenhuma nova animação
  permanente em repouso. Bússola visível no celular e links com contraste mínimo 4,5:1.
- Mesa local e contrato edge simulado: erros, timeout, recuperação, privacidade,
  zero envio indevido e exportação completa. Testes não ativam IA em produção.
- HTML sem JS: narração e documentos acessíveis, 19 leituras, formulário sem envio.
- npm audit: zero vulnerabilidades. requirements-pages.txt fixado: sem
  vulnerabilidades conhecidas em consulta sem resolução de dependências transitivas.
  requirements.txt é uma especificação por intervalos, não um lockfile auditado.

Navegadores emulados, sem alegar homologação em aparelhos físicos. Publicação,
merge e aprovação editorial continuam fora desta execução.

- Impressão: paleta da bússola explicitamente adaptada ao papel; os dez princípios e seus links permanecem legíveis, sem depender da seleção em tela.

## Pages, prévia e entrega para revisão

- Fixture final do produto: `b136fadb3179e48fdd3b2ba023ddddd5501a77f3`,
  385 arquivos, 95.694.841 bytes e 307 referências locais verificadas.
  `v0.0.0` é apenas a identidade da fixture local; nenhuma tag foi criada.
- Testes Pages passaram: edição pública mobile/desktop/sem JS, as 17 dobras,
  impressão dos dez princípios, sete viewports dos reveals e todas as 19 leituras.
  A checagem completa dos reveals/rotas foi feita no artefato `a4a507a`; a fixture
  final acrescenta somente o contraste do manifesto para impressão, validado
  novamente pelo teste completo de instrumentos em quatro viewports e sem JS.
- Prévia reutilizada: http://192.168.1.4:4205/ (HTTP 200, 17 dobras), processo
  existente 24712, bind 0.0.0.0. Artigo Saberes também responde HTTP 200.
- Comparação #83 preservada em http://192.168.1.4:4204/ (HTTP 200), processo 27224.
- Base remota confirmada por fetch: `892fc94309d9a3132e5e8472f1d43f1e5e92e382`.
  Main permanece `80d2140ce6f4270e7b434852198047417b188117` / v0.3.0.
- Issue #85 e PR #86 em rascunho; branch `study/85-animation-led-narrative`.
  O PR tem base #83 por autorização explícita: não deve ser tratado como uma
  release independente antes de resolver a dependência. Os workflows atuais
  filtram PRs para main; esta base de estudo não recebe jobs automáticos.
- Rollback da experiência: piloto `a1e3487`, ou comparação `892fc94`.
  Sem migrações, novos assets, dependências ou alterações no contrato de backend.
- Sem merge, release de produção, deploy, Worker, VPS ou sincronização de mirror.
  A homologação editorial permanece no PR; a goal cobre implementação e validação.
