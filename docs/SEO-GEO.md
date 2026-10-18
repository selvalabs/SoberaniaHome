# SEO, leitura por assistentes e política de publicação

Esta edição é uma experiência de avaliação em uma branch. Por padrão, a build e o servidor de desenvolvimento emitem `noindex,follow`. Ela não troca a edição aprovada em `site/` nem altera a publicação existente.

## O que está implementado

- HTML estático em português, com título, descrição, Open Graph, Twitter Card, favicon e dados estruturados `Organization`, `WebSite` e `WebPage`.
- Identidade factual: Soberania Labs, laboratório independente em Florianópolis, Santa Catarina, Brasil. Não foram presumidos endereço de rua, telefone, email, CNPJ, preço, fundação, depoimentos, resultados comerciais ou perfis sociais.
- `/perguntas/`: respostas disponíveis no HTML, sem depender de animações, JavaScript ou modais. Não usa marcação de artigo publicado nem anuncia disponibilidade de todos os produtos.
- O experimento de possibilidades distingue composição determinística local de integração externa opcional. O texto não descreve o modo local como inferência por IA; o processamento externo depende de configuração e ação explícita.
- `/llms.txt`: índice documental complementar, com projetos, limites de demonstração e links. Não é um mecanismo de ranking, nem uma instrução para assistentes recomendarem a organização.
- `/robots.txt`: permite o rastreamento do HTML, inclusive `/demos/`, para que o `noindex` seja lido. Cada HTML demonstrativo declara `noindex,follow` mesmo em uma futura build indexável. O arquivo `_headers` também define `X-Robots-Tag: noindex, follow` em `/demos/*` nos hosts que interpretam esse arquivo, como Cloudflare Static Assets. Esses sinais não são controle de acesso e não tornam arquivos privados.
- `/sitemap.xml`: vazio na prévia. Em uma build explicitamente indexável, contém apenas a página inicial e `/perguntas/`, sem fragmentos nem datas de atualização inventadas.
- Metadados sociais usam `/assets/social/edition-og.png`, com 1200 × 630 pixels. A imagem de compartilhamento é uma composição editorial, não a marcação de um logotipo oficial.

## Habilitar indexação em uma futura publicação aprovada

As duas configurações devem ser fornecidas no ambiente de build:

```text
PUBLIC_SITE_URL=https://dominio-publico-confirmado.example/
PUBLIC_INDEXABLE=true
```

O domínio acima é ilustrativo e não deve ser usado em uma publicação real. O valor correto precisa ser o endereço de produção confirmado para esta edição.

`PUBLIC_INDEXABLE` aceita apenas `true`, `false` ou ausência. Habilitá-lo sem URL válida interrompe a configuração. A URL deve ser uma origem pública HTTPS, sem credenciais, porta, query, fragmento ou subdiretório. Localhost, IPs e nomes locais não são aceitos. O servidor de desenvolvimento permanece `noindex` mesmo com configuração de produção presente.

O projeto atual usa muitos caminhos absolutos iniciados por `/`. Publicar esta edição sob um subdiretório, como um caminho do GitHub Pages, exige uma tarefa específica de adaptação de `base`, imagens, scripts, links e URLs. Não presumir compatibilidade simplesmente trocando o canônico. O README registra uma edição pública separada em `site/`; a existência da branch não autoriza sua substituição.

Artefatos de build usam `BUILD_DIR` quando fornecido, ou `.edition-builds/latest/` como destino padrão. A limpeza automática do Vite está desabilitada. Para cada verificação, usar uma pasta nova identificada por data/hora dentro de `.edition-builds/`; não reciclar o diretório de uma build anterior nem usar o `dist/` herdado como alvo de limpeza.

Só builds de produção com as duas configurações emitem canônico e `og:url`. As URLs canônicas excluem parâmetros de preview e fragmentos. Quando não há origem confirmada, o JSON-LD usa identificadores relativos e não publica um hostname inventado.

## Dados estruturados e conteúdo

O JSON-LD descreve a organização e a página. Não promete avaliações, preço, condição comercial, certificação ou disponibilidade dos produtos. Screenshots com dados demonstrativos continuam descritos como demonstrações. O Caderno reúne seis notas editoriais originais sobre princípios de trabalho, disponíveis no HTML; elas não são apresentadas como resultados de pesquisa científica nem recebem datas ou credenciais inventadas. Referências de leitura não implicam endosso das pessoas citadas.

A página de perguntas e o índice documental precisam acompanhar mudanças reais de escopo. Novas páginas só entram em `publicPages`, em `src/lib/seo.ts`, depois de existirem e terem conteúdo pronto. Não usar `lastmod` como a data de toda build: ele só deve ser acrescentado quando houver uma data editorial real de alteração substantiva.

## Busca por IA e treinamento são escolhas diferentes

O Google informa que suas experiências de IA usam os fundamentos normais de SEO: texto útil, links internos, acesso para rastreamento e dados estruturados correspondentes ao conteúdo. Não exige arquivos de IA ou schema especial. Indexação e exibição não são garantidas.

A OpenAI documenta `OAI-SearchBot` para busca e `GPTBot` para conteúdo que pode ser usado em treinamento. Este trabalho não adiciona uma política específica de treinamento nem confunde consentimento de treinamento com presença em busca. Uma futura decisão sobre agentes deve ser explícita, consistente com a política de conteúdo e revisada no ambiente publicado.

## Validação antes de uma publicação

1. Build de prévia: conferir `noindex,follow`, ausência de canônico público, sitemap vazio e ausência de anúncios de publicação nos metadados.
2. Build de produção com a origem homologada: conferir canônico sem query/hash, metadados sociais absolutos, sitemap com apenas páginas reais e JSON-LD coerente.
3. Verificar todas as páginas sem JavaScript, com teclado, movimento reduzido e viewport estreito. Nenhuma informação essencial deve exigir o jogo ou uma animação.
4. Verificar que a imagem social tem dimensões corretas, responde sem autenticação e não contém informações privadas.
5. Após uma publicação autorizada, usar inspeção de URL no Search Console e teste de resultados avançados para o endereço real. Uma validação local não comprova indexação pública.

## Fontes primárias consultadas em 17 de outubro de 2026

- [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google Search Central: Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google Search Central: robots meta tags and noindex](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [OpenAI: Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots)

Essas fontes sustentam a implementação técnica, não uma promessa de posição, tráfego ou menção por modelos.
