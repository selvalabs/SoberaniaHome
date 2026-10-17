# Edição experimental — issue 34

## Identidade e isolamento

- Issue: https://github.com/selvalabs/SoberaniaHome/issues/34
- PR de revisão: https://github.com/selvalabs/SoberaniaHome/pull/35, aberto em draft.
- Branch: `feat/34-immersive-edition`.
- Base remota inicial: `main`, `45ebfbbba3dd99fa64d62e6b5047901535568ef7`.
- Continuação preservada: `feat/astro-gsap`, `32a3456f741c309f6b1bb46f0ab18fde6cdf2ed1`, incorporada por fast-forward na branch experimental depois de sua criação remota.
- Checkout de trabalho: `immersive-34`, separado de `source`.
- `main` local e remota confirmadas no mesmo SHA acima; nenhuma atualização necessária e nenhum commit direto nelas.
- O SHA final é identificado pelo head do PR desta issue. Não foi criada tag de release nem feito merge.

## Auditoria e decisões

A edição anterior combinava regras CSS acumuladas, pinning GSAP e sticky nativo, mantendo renderização contínua mesmo sem interação. Havia imagens grandes carregadas cedo, páginas de celular com dezenas de milhares de pixels numa única imagem, textos do Caderno incompletos e metadados insuficientes para uma edição pública completa.

A revisão mantém papel, carvão, verde, cobre e ilustração botânica. A abertura acrescenta circuitos e coordenadas, enquanto as interações explicam decisões reais: processo de construção, transferência de conhecimento, infraestrutura, relações entre tecnologia e território e hipóteses de projeto.

O motor agora usa a posição nativa do documento, cenas sticky e atualização sob demanda. Somente quatro cenas têm extensão de rolagem: trabalho, processo, laboratório e conexões. Leitura reduzida, telas baixas e JavaScript ausente mantêm o conteúdo acessível no fluxo. A folha mantém o movimento central nas galerias e recua na leitura, ficando oculta no caça-palavras.

## Conteúdo entregue

- Quinze capítulos completos, mais a mesa de possibilidades entre autonomia e laboratório.
- Screenshots iniciais de login do Analytics/Círculo e interfaces reais do UVE/Local RAG; rótulos distinguem dados demonstrativos, protótipos e produtos em desenvolvimento.
- Oito landing pages na ordem solicitada, começando pela Soberania e pelo Desafio da Empreendedora. Imagens com rolagem interna são capturas, não aplicações interativas ao vivo.
- Seis notas originais de laboratório; dez princípios do manifesto com implicações concretas.
- Curadoria de 110 nomes, descoberta por mouse/toque ou botões de teclado e rodada reproduzível com cobertura de tinta de cinco segundos.
- Mesa local com quatro cenários preparados, exportação de esboço e contrato opcional de IA. Não usa inferência no modo local.
- FAQ, JSON-LD factual, metadados sociais, favicon, sitemap, robots e llms.txt. Prévia não indexável e demos com diretiva própria.

## Desempenho e ativos

Foram preservados os originais e adicionados 55 WebP, 98 trechos de oito páginas de celular e uma imagem social de 1200×630. O conjunto selecionado caiu de **41.208.222 para 8.679.260 bytes (78,94%)**, sem contar a nova imagem social. A largura e a soma das alturas dos trechos reproduzem as capturas originais.

Medição local em Chromium, contexto novo, viewport 1440×960, evento load +1 segundo, sem rolar:

| Medida | Build anterior | Edição experimental |
| --- | ---: | ---: |
| Recursos transferidos | 20.220.158 bytes | 2.397.920 bytes |
| Requisições de recursos | 40 | 35 |
| Altura do documento | 43.319px | 27.324px |

É uma comparação de laboratório em HTTP local, não uma medição de Core Web Vitals em produção. A página final carrega mais imagens conforme a exploração. As animações param de renderizar quando não há entrada.

## Validação executada

- Astro **7.4.0**, Node 24.13.0, TypeScript 5.9.3: build estática e `tsc --noEmit` passaram.
- **32 testes Node**: contrato/limites/erros do Worker, origem, timeout, resposta malformada, política de publicação e noindex dos demos.
- `npm audit`: zero vulnerabilidades; `pip-audit -r requirements-pages.txt`: nenhuma vulnerabilidade conhecida.
- Verificador de build: metadados, JSON-LD, páginas/arquivos locais, imagens e sitemap da prévia.
- Navegadores: 390×844 e 1440×900 para cenas, seis notas, nós, controles, modal, persistência, movimento reduzido dinâmico e ausência de renderização ociosa.
- 320×680, 390×844, 768×1024: ausência de overflow, referências completas e interação local. HTML sem JavaScript: conteúdo legível e formulário incapaz de transmitir contexto.
- Gestos: rolagem vertical/horizontal, arrasto e swipe; celular interno rola sem mover o documento; teclado percorre a galeria.
- IA simulada no navegador: botão explícito, bloqueio durante espera, resposta/contexto associados, exportação local e mensagem correta após falha.
- Revisão visual de todas as dobras; colagens móveis separadas dos parágrafos; nenhum recurso quebrado ou erro de execução nas verificações finais.

A primeira execução da CI identificou duas entradas opcionais ausentes no lockfile, aceito pelo npm 11.6.2 local e recusado pelo npm 11.19.0 do runner. O lock foi completado pelo npm 11.19.0 em um diretório novo, sem alterar versões existentes. O resultado da validação Linux acompanha o SHA final nos checks do PR.

## Ambiente e entrega

Prévia local completa disponível no Wi-Fi em porta própria. A build servida fica em `.edition-builds/preview-20261017-02`; é uma avaliação local, não uma release de produção. O processo da prévia final é um servidor Python limitado a essa pasta de arquivos públicos. O endereço do Wi-Fi pode mudar quando a rede atribuir outro IPv4.

Não houve alteração de firewall, VPS, banco, segredos, DNS, serviço do Agentic MailBox ou publicação existente. Foram lidos apenas nomes de variáveis no projeto de correio para identificar possibilidade de integração; não há credencial confirmada de Workers nem segredo incorporado à branch.

## Limites e próxima publicação

O Worker está implementado, testado com bindings simulados e desligado por padrão. Inferência real, custo, conta, domínio, namespace de quota e deploy ainda precisam de configuração e validação no destino aprovado. O limite de requisições da Cloudflare é por localidade e não é um teto global de faturamento.

O site não tem canal comercial inventado: o contato leva ao GitHub confirmado ou ao esboço local. Links externos e telas de terceiros mantêm seu contexto de demonstração; não se afirma disponibilidade comercial de todos os projetos.

Publicação requer revisão/homologação, merge pelo GitHub, tag anotada, SHA aprovado e preflight. O workflow legado de Pages publica a edição antiga; não foi acionado. Esta versão pressupõe uma origem na raiz do domínio, não o subdiretório atual do Pages.

Rollback da avaliação: continuar usando a versão anterior de `source`; o experimento está isolado. Rollback de produção não se aplica, pois nenhuma release foi feita. Mirror da VPS: não aplicável, sem acesso ou sincronização de VPS nesta tarefa.
