# Soberania Labs — relatório V8.3

## Entrega

Reconstrução mobile-first sobre o conteúdo e os assets da V8.1. Mantidas as quinze dobras, a paleta editorial, a árvore, a folha e o percurso entre tecnologia e território.

O pacote estático e o HTML autocontido foram gerados. Não houve publicação em servidor, alteração de DNS nem alteração em repositório remoto.

## Mudanças visíveis

**Mobile.** Trabalho e Laboratório voltaram ao horizontal comandado pela rolagem vertical. As partes conceituais usam uma máquina tipográfica e um campo de palavras, não uma miniatura de um desktop nem uma longa área imóvel. Texto do Processo fica isolado no centro; o Editor tem documento e controles próprios; a Espiral reserva áreas distintas para imagem e leitura.

**Editor.** A edição só começa ao apertar “Abrir o editor”. Os dois blocos de texto podem ser alterados e formatados; a imagem é movida por um handle, redimensionada e girada; “Salvar HTML” exporta um documento independente. A animação não sobrescreve essas mudanças. Trata-se de uma demonstração local, não do produto online completo.

**Árvore e folha.** A origem acompanha a árvore. A folha permanece no galho antes do desprendimento, entra no mesmo giro da Espiral e termina num apoio calculado sobre o monte. O rodapé tem espaço reservado para a pilha, separado do texto.

**Leitura.** Caderno em folha contínua no celular, sem segunda rolagem obrigatória; moldura com papel em movimento no desktop. Referências agrupadas sem colisões e mapa filtrável em modal. Índice das quinze dobras, contador atual, modo de leitura e modais com histórico/foco.

## Verificações executadas

Ambiente: Chromium 144.0.7559.96, headless, via Playwright. HTML/JS/CSS e imagens locais incorporados em memória para renderização; nenhuma dependência de um site publicado.

Foram inspecionadas **231 posições de cena**: 33 posições em cada uma das sete viewports. Foram verificadas largura global, centralização dos cards, caixas e conteúdo textual dos painéis ativos. Capturas visuais foram feitas adicionalmente em 390 × 844 e 1440 × 900.

| Viewport | Posições verificadas | Erros JS | Ocorrências de layout verificadas | Pouso final |
|---|---:|---:|---:|---|
| 360 × 800 | 33 | 0 | 0 | repouso |
| 390 × 844 | 33 | 0 | 0 | repouso |
| 412 × 915 | 33 | 0 | 0 | repouso |
| 430 × 932 | 33 | 0 | 0 | repouso |
| 1024 × 768 | 33 | 0 | 0 | repouso |
| 1280 × 800 | 33 | 0 | 0 | repouso |
| 1440 × 900 | 33 | 0 | 0 | repouso |

Foram concluídos **44 testes funcionais adicionais, todos aprovados**. Resultados completos nos JSONs desta pasta.

Cobertura: quinze destinos do índice; sentidos e limites dos dois trilhos; rolagem vertical e toque nativo emulado; scroll forte; RAF parado em repouso; cache geométrico durante scroll; retorno reversível da folha; posição física de pouso; edição/formatação/movimento/rotação/exportação; histórico de artigos e índice; foco contido e devolvido ao abridor; URL direta de artigo; filtros do mapa; modo de leitura; movimento reduzido; paisagem; restauração do projeto ao redimensionar; conteúdo e navegação sem JavaScript.

A integração por tempo foi simulada a 60, 90, 120 e 144 Hz. Essa verificação é matemática, **não um teste em quatro monitores físicos**.

## Correções encontradas durante a rodada

1. Um tamanho mínimo implícito do grid expandia o frame até a largura do trilho. Foi substituído por coluna com `minmax(0, 1fr)` e limites explícitos.
2. Duas legendas da Espiral faziam crossfade e se sobrepunham. Agora somente uma legenda permanece legível.
3. A origem de transformação da folha duplicava o deslocamento da rotação. Foi corrigida para o ponto de referência do elemento.
4. Uma mudança de largura podia preservar a geometria, mas saltar para o último projeto. O estado estável da cena agora é carregado para o novo layout; o teste de regressão passou.

## Limites e pendências deliberadas

- A validação cobre emulação no Chromium, **não Android/iPhone físicos ou Safari/WebKit**. Barras do navegador, teclado e desempenho em aparelho real ainda requerem homologação nesses ambientes.
- O scroll permanece nativo. Saltos muito grandes sincronizam a cena atual; não se promete impedir o usuário de ultrapassar uma sequência inteira.
- Os seis artigos do Caderno ainda não têm corpo integral fornecido. Seus modais exibem título, apresentação e aviso de preparação.
- Fichas de projetos usam a apresentação fornecida, sem métricas fictícias ou screenshots inventados.
- Os canais de contato, GitHub e Instagram aguardam URLs confirmadas em `config.js`.
- O pacote permanece com `noindex,nofollow` enquanto for protótipo.

## Arquivos de evidência

- `layout-results.json`: geometria, larguras, console e repouso por viewport.
- `functional-results.json`: 36 verificações de comportamento.
- `additional-results.json`: 8 verificações de navegação, toque, cache, reversibilidade e resize.
- `SOURCE.json`: identificação e hash da base V8.1 usada.

## Avaliação visual

A validação automatizada não substitui a decisão estética. Esta versão deve ser avaliada sobretudo pelo ritmo de Trabalho → Processo → Editor → Laboratório → Espiral e pelo fechamento no rodapé. A implementação está entregue para essa validação, com as limitações acima explicitadas.
