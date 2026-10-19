# Issue 36 — narrativa das dobras e Mesa de possibilidades

Issue: https://github.com/selvalabs/SoberaniaHome/issues/36  
Branch: `feat/36-editorial-atelier`  
Base verificada após fetch: `6cfe8869993a4e786f3ab47cb7461f0acaa1e2cd`  
Data: 18 de outubro de 2026.

## Objetivo e limite

Apresentar uma proposta editorial implementada, com função clara para cada dobra e uma experiência de esboço que explique o que faz. Homologação pela prévia Wi-Fi; esta tarefa não inclui merge, publicação, ativação de IA, credenciais ou mudanças na VPS.

A hero completa, o argumento social, os projetos existentes, a folha, o glow, o scroll lateral e as interfaces internas são parte da experiência aprovada. A revisão trabalha sobre essa base. A avaliação abaixo é uma análise editorial e técnica; não equivale a pesquisa com visitantes nem comprova melhora de conversão.

## Pesquisa e decisões

- [NN/g — Applying Writing Guidelines to Web Pages](https://www.nngroup.com/articles/applying-writing-guidelines-web-pages/): usar abertura clara, informação escaneável e linguagem objetiva. Aplicação: explicar primeiro a situação de uso nos projetos; retirar repetição de “processos”; dar saídas concretas às etapas. O estudo de 1998 não prevê um percentual de melhoria para este site.
- [GOV.UK — Error message](https://design-system.service.gov.uk/components/error-message/): distinguir erro de preenchimento de indisponibilidade de serviço; orientar a correção junto ao campo. Aplicação: descrição curta recebe erro associado e foco; falhas de rede/serviço recebem uma mensagem de estado, mantendo o esboço anterior.
- [Cloudflare — JSON Mode](https://developers.cloudflare.com/workers-ai/features/json-mode/): a API admite saída estruturada. Aplicação: conferir o contrato já usado pelo Worker e validar o resultado também na interface, inclusive listas, limites e texto simples. O formato solicitado não elimina a necessidade de verificar a resposta.

Não houve necessidade de novos assets: a questão identificada era de conteúdo, orientação e estado da interface. A criação de outra animação acrescentaria movimento sem resolver esses pontos.

## Auditoria e proposta por dobra

| Dobra | Papel e diagnóstico | Resultado nesta proposta |
| --- | --- | --- |
| 01 / Hero | Apresentar posição, capacidade técnica e compromisso social. A versão completa já foi aprovada. | Mantidos título, três parágrafos, árvore, composição e ações. Ajuste pontual de “simplificar processos” para “organizar rotinas”, evitando repetição. |
| 02 / Trabalho humano | Fazer a pergunta política sobre os ganhos da tecnologia. Repetia a promessa da hero. | A abertura agora pergunta quem recebe o tempo poupado e o que pode fazer com ele. Citação e conclusão preservadas. |
| 03 / Tecnologia | Dar concretude à tese. Texto anterior voltava a uma formulação geral. | A legenda da produção compartilhada explica tarefas, registros e decisões que o sistema ajuda a organizar. |
| 04 / Conhecimento | Explicar a relação entre técnica e experiência. Texto já tem identidade e foi refinado com o autor. | Preservados texto, colagem e citação de Freire. |
| 05 / Trabalhos | Evidenciar capacidades e estágio dos produtos. Introdução genérica e siglas concentradas. | Introdução por quatro situações reais; Analytics explica tracking em português; Círculo explicita personalização e condição dos parceiros; editor descreve ajuste, salvamento e publicação. Monitor preservado por já explicar o problema do morador. |
| 06 / Processo | Mostrar como a equipe transforma uma necessidade em sistema. Etapas tinham verbos, mas poucas saídas observáveis. | Cada etapa diz o que deixa: problema delimitado, hipóteses, protótipo, versão utilizável, evidências e operação documentada. Tabuleiro e sequência mantidos. |
| 07 / Entrega | Explicar o que permite continuar depois do projeto. | Abertura aborda quem opera amanhã e o que precisa ser combinado desde o início. Documentos interativos mantidos. |
| Mesa / Possibilidades | Permitir experimentar o método. Local fixo podia parecer geração personalizada; integração desativada desaparecia. | Caminho de três passos, exemplos opcionais, distinção local/IA, anotação visível, rascunho pendente, exportação fiel, disponibilidade e recuperação explícitas. |
| 08 / Laboratório | Ampliar repertório sem repetir a primeira galeria. | Título orientado às ações “Publicar. Encontrar. Criar.”; landing pages descrevem finalidade e instrução de uso. UVE/RAG e ordem dos oito celulares preservados. |
| 09 / Conexões | Relacionar software a condições materiais. Alguns nós eram abstratos. | Energia traz decisões de processamento; território pergunta sobre conexão, celular compartilhado e uso fora da mesa. Mesma cena e coreografia. |
| 10 / Soberania | Explorar alternativas de hospedagem, dados e integração. A abertura repetia a dobra 07. | Perguntas de mudança concretas introduzem as três rotas. Diagramas e detalhes mantidos. |
| 11 / Referências | Tornar visível o repertório intelectual e cultural. | Curadoria, 110 nomes, biblioteca legível e caça-palavras preservados. Novas biografias não foram inventadas. |
| 12 / Sobre | Localizar o laboratório e ajudar o visitante a escolher um caminho. | Texto de continuidade mais direto e três entradas: conhecer produtos, esboçar uma situação ou entender parceiros. |
| 13 / Manifesto | Transformar valores em escolhas que o visitante consegue examinar. | Introdução convida a abrir princípios. Quatro princípios apontam para entrega, Mesa, arquitetura e laboratório. Dez princípios preservados. |
| 14 / Caderno | Aprofundar argumentos sem carregar a leitura inicial. | Seis notas e leitura progressiva preservadas; já cumprem a função editorial. |
| 15 / Contato | Transformar interesse em uma ação possível. “Algo que não existe” era amplo. | Pergunta sobre a rotina e convite para organizar a situação na Mesa; GitHub preservado como canal disponível, sem inventar contato comercial. |

## Contrato da Mesa

### Modo local

Quatro roteiros preparados em `src/data/atelier.ts`, compartilhados pelo HTML inicial e pelo controlador. A troca de campo escolhe outro roteiro. A anotação é incluída no resultado e no arquivo, mas não é interpretada nem altera o roteiro. A página não chama `/api/atelier` quando a flag de build está desligada. Exemplos entram apenas por clique explícito; o botão informa quando vai substituir uma anotação.

O resultado guarda proposta, origem, campo e contexto como um conjunto. Digitar depois disso mostra um aviso de alteração pendente. O download preserva o último conjunto, inclusive após erro da IA. O contexto usa `textContent` e quebra de linha; não há interpolação de HTML nem persistência no navegador.

### Integração opcional

`PUBLIC_EDGE_AI=true` permite consultar a disponibilidade, mas só mostra geração após confirmação do endpoint. A API exige `ENABLE_AI`, binding de inferência e limitador. Sem configuração, o estado é “Não conectada”; indisponibilidade da consulta permite tentar novamente. Consultas de disponibilidade são GET sem contexto. A geração só acontece por clique explícito.

O texto deve ter pelo menos 20 caracteres para solicitar IA. Durante o envio, campos e exportação ficam bloqueados. Sucesso substitui o resultado inteiro; erro preserva o último. Falhas de rede, timeout, limite de uso, resposta ilegível e estrutura inválida têm mensagens em português, sem divulgar mensagens internas do provedor. A interface confere os limites do contrato do Worker antes de exibir a proposta.

Esta branch **não conecta nem executa inferência real**. A prévia Wi-Fi usa os cenários locais. Testes do Worker usam bindings simulados; testes de navegador interceptam a API. Uma futura ativação exige ambiente, bindings, limites operacionais e validação real próprios. O timeout do cliente ou do Worker não comprova cancelamento de processamento no provedor.

### Acessibilidade e continuidade

Rótulos explícitos, erro associado por `aria-describedby`, `aria-invalid`, estado anunciado, botões de 44px e campo legível no celular. A atualização local por submit leva foco ao título do resultado; mudar o seletor não toma o foco. As animações da resposta respeitam movimento reduzido e modo de leitura. Sem JavaScript, o roteiro inicial continua legível e o formulário fica desativado.

## Critérios e validação

1. Tipos TypeScript, testes unitários/Worker e `git diff --check`.
2. Auditorias npm e Python; build estática noindex e verificação de metadados, links locais e assets.
3. `test_atelier_edge_ui.py`: local em 320, 390, 768 e 1440px; exemplos; contexto pendente; snapshot exportado; foco; nenhuma transmissão local; inferência mockada; entrada curta; bloqueio pendente; sucesso; 503/429/504; JSON e estruturas inválidas; rede; timeout; retorno local; descoberta e retry em celular.
4. Regressões completas de site, folha, movimento, matriz de viewports, galerias e toque em celulares internos.
5. Inspeção visual de Mesa, processo, manifesto e caminhos editoriais em celular e desktop. Disponibilidade Wi-Fi verificada via HTTP.

## Handoff

Resultado, SHA, PR, verificações e endereço da prévia serão registrados no PR. Main permanece na base; não há merge ou release nesta tarefa. A prévia estática não representa publicação nem serviço de inferência. Rollback da proposta: retornar à versão da base preservada; após eventual merge, usar revert por PR. Nenhuma migração, ação na VPS ou sincronização de mirror.

## Continuação: reorganização conservadora — 19/10/2026

O mantenedor aprovou reorganizar as dobras sem retirar conteúdo, fundir seções ou reescrever os textos. Base desta continuação: `7912cf8ec0c289bd1368a101fdc8ba47bf206e66`, que já inclui a paráfrase de Lenin aprovada. A main continua em `6cfe886`; a branch da issue 38 não é parte deste trabalho.

| Número | Dobra | Posição anterior |
| --- | --- | --- |
| 01 | Abertura | 01 |
| 02 | Escolhas / trabalho humano | 02 |
| 03 | Trabalho | 05 |
| 04 | Inteligências | 04 |
| 05 | Processo | 06 |
| 06 | Laboratório | 08 |
| 07 | Alta tecnologia | 03 |
| 08 | Autonomia / entrega | 07 |
| 09 | Soberania | 10 |
| 10 | Conexões / espiral | 09 |
| 11 | Sobre | 12 |
| 12 | Manifesto | 13 |
| 13 | Referências | 11 |
| 14 | Caderno | 14 |
| 15 | Mesa de possibilidades | Entre 07 e 08, sem número |
| 16 | Contato | 15 |

A Mesa recebe um número próprio: são as mesmas 16 dobras, agora todas identificadas no índice e no contador. Foram atualizados `data-number`, rótulos globais e cabeçalhos de cena; as contagens internas de projetos, etapas e vistas permanecem iguais. Menu principal e rodapé seguem a nova ordem dos seus links existentes. IDs, destinos e textos dos links são preservados.

### Preservação verificada

Comparei os dois builds com DOMParser, seção por seção, descontando apenas a numeração global e a ordem dos links do rodapé. As 16 seções produziram HTML interno idêntico. A figura independente com a citação de Freire e as 15 imagens iniciais do HTML também coincidem. Não houve alteração em CSS, scripts de interação, física, assets, produtos, versos/citações, manifesto ou notas do Caderno.

Em 390×844, a abertura de Trabalho passa de aproximadamente 3.736 para 1.708px de distância do topo: cerca de 4,4 para 2 alturas de tela. Em 1440×960, passa de 3.512 para 1.861px. São medidas de layout, sem inferência sobre retenção ou conversão. As duas galerias continuam separadas por Inteligências e Processo; a Mesa passa a anteceder Contato.

### Verificação desta continuação

O teste de movimento agora percorre os 16 links reais do índice e confere ordem, hash, capítulo ativo e contador, incluindo Mesa 15 e Contato 16. A regressão do site exige as 16 seções numeradas. Validação existente de movimento, leitura, redução de movimento, folha/glow, controles, galerias, resize/orientação, celulares internos, exportação e API simulada permanece aplicável. Build candidato: `.edition-builds/order-36-01`.

A prévia de homologação permanece na porta 4193; a porta 4190 continua servindo main. Nenhum merge, release, alteração de credenciais ou operação em VPS/mirror faz parte desta continuação. Retorno da reorganização: commit anterior `7912cf8`, por revisão/revert se necessário.

As sete suites de navegador passaram localmente no build candidato, assim como tipos, 36 testes Node/Worker, build/check estático, diff check, npm audit e pip-audit. As capturas do índice, das galerias e da Mesa foram revisadas em 390px e 1440px.

Limitação anterior identificada na exploração: selecionar Abertura pelo índice, rolar até um projeto e abrir/fechar o índice pode devolver a página ao topo. Reproduzi tanto no build `7912cf8` quanto no reorganizado: a posição passou respectivamente de 4.547/2.519px para zero. O cenário de histórico é independente da ordem; `public/scripts/app.js` e o runtime de movimento permanecem intactos nesta proposta conservadora. Correção desse comportamento requer uma mudança funcional separada. Os testes de navegação sequencial e os cenários de modal são isolados para não compartilhar histórico entre casos.
