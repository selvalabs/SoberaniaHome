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

### Refinamento da experiência no celular

A revisão após a primeira avaliação corrigiu a folha oculta em telas com menos de 700 px úteis. O movimento decorativo agora é independente das cenas fixas: telas curtas usam fluxo natural e continuam com folha/glow, respeitando modo de leitura e redução de movimento. O limite visual considera a folha rotacionada, mantendo-a dentro da tela. Sua camada não intercepta toques nem a rolagem dos mockups.

As barras do navegador não alternam o layout da página ao variar a altura disponível; largura/orientação ainda recalculam a composição. Temporizadores de resize e medição de conteúdo foram separados. Redimensionamento de janela desktop continua adaptativo.

No fluxo compacto ou de leitura, os mockups mantêm altura limitada e rolagem interna, em vez de crescerem até milhares de pixels. A legenda de pesquisa ganhou espaço próprio, os controles principais têm área de toque maior, os campos usam texto de 16 px e as dicas da galeria distinguem toque de mouse. Na dobra do processo, telas mais baixas reservam menos altura à ilustração e preservam as seis explicações sem reduzir a fonte.

Regressões incluem limites visuais e glow da folha, barra móvel em quatro tamanhos, leitura/redução de movimento, altura dos mockups e gestos de toque reais via CDP em ambos os eixos. A prévia desta passada usa `.edition-builds/mobile-review-20261017-03`, preservando a primeira entrega para comparação.

Prévia local completa disponível no Wi-Fi em porta própria. A primeira entrega fica em `.edition-builds/preview-20261017-02`, porta 4184; a passada mobile usa a build indicada acima, porta 4187. São avaliações locais, não releases de produção. Cada servidor Python fica limitado à sua pasta de arquivos públicos. O endereço do Wi-Fi pode mudar quando a rede atribuir outro IPv4.

Não houve alteração de firewall, VPS, banco, segredos, DNS, serviço do Agentic MailBox ou publicação existente. Foram lidos apenas nomes de variáveis no projeto de correio para identificar possibilidade de integração; não há credencial confirmada de Workers nem segredo incorporado à branch.

### Composição mobile e continuidade do movimento

A segunda passada visual identificou um salto horizontal real na saída da abertura, a folha estacionada na margem, falta de gutter na segunda dobra, árvore apagada atrás do título e seis etapas comprimidas. A correção substitui o ramo abrupto da trajetória por uma curva contínua, com balanço e rotação ligados à distância percorrida. Telas de produtos e controles são superfícies de primeiro plano: a folha desaparece suavemente atrás delas, mantendo seu percurso e sem bloquear o toque.

A abertura mobile passa a ter título, ilustração e introdução em uma sequência explícita. A segunda dobra recupera margens laterais e respiro vertical. No processo mobile, a montagem acompanha a leitura vertical de seis explicações de 16 px; o desktop mantém a cena com as seis notas simultâneas. A ilustração segue o scroll sem comprimir os parágrafos nem cortar as peças.

Regressões verificam continuidade e deslocamento da folha após a abertura, proteção das interfaces, gutter editorial, quadro e etapa ativa visíveis no celular, resize, modo leitura e movimento reduzido. Foram revisadas capturas de 320, 360, 390 e 1440 px; tipos, build, 32 testes Node, auditoria npm, suites de navegação/toque e contrato de IA simulado passaram. Uma falha local esporádica de inicialização foi investigada sem erro de execução reproduzível; a execução final completa passou, e o resultado Linux fica registrado nos checks do PR.

A prévia atual desta composição usa `.edition-builds/mobile-composition-20261017-02`, servida na porta 4190 com logs locais em arquivo, preservando a avaliação anterior na porta 4187. A pasta servida contém somente arquivos públicos. Base desta passada: `b9082fde0b8da9dcb3896e3e481091eec31b002d`; o resultado imutável é o head do PR #35. Main, release/tag, produção e VPS continuam sem alteração.

### Restauração da hero a partir da main

A comparação com `origin/main` (`45ebfbbba3dd99fa64d62e6b5047901535568ef7`) confirmou que a edição experimental havia resumido indevidamente a abertura. Foram recuperados integralmente os três blocos: apresentação da Soberania Labs e sociedade mais justa; ferramentas/conhecimento, exploração, decisão sobre o futuro e prosperidade por gerações; software, processos inteligentes, infraestrutura e construção com quem conhece os desafios.

Também voltaram a tarja escura de Tecnologia, o papel e sublinhado de “da humanidade”, os destaques de Soberania Labs e sociedade mais justa, a composição da árvore junto ao título e a assinatura de rede aberta para o mundo. A identidade Sistemas brasileiros continua como solicitado; os dois acessos levam aos trabalhos e ao manifesto da versão completa.

O texto dos três parágrafos foi comparado com a main renderizada e coincide após normalização de espaços. Capturas em 320, 390, 768 e 1440 px foram revisadas; tipos, build, 32 testes Node, auditoria npm, navegação, leitura sem JavaScript, movimento da folha e gestos dos mockups passaram. O teste de conteúdo protege os argumentos centrais contra nova supressão.

Prévia da restauração: `.edition-builds/hero-restored-20261017-01`, porta 4192. Base desta passada: `1406439d02af003efcb92ad260f8b38fe83160db`. A comparação da main foi somente de leitura; nenhuma atualização ou publicação da main foi realizada. A prévia anterior permanece na porta 4190 para comparação e retorno. Release/tag, produção, VPS e mirror não se aplicam a esta avaliação local.

### Correção das duas galerias de projetos

A investigação reproduziu três falhas: um evento móvel de resize sem mudança de tamanho interrompia a navegação entre cards; o carregamento lazy podia deixar interfaces vazias dentro da faixa transformada; cabeçalho/rodapé tinham linhas de grid menores que suas alturas mínimas, cortando controles. A navegação agora ignora resize redundante, conserva o destino solicitado durante mudanças reais de altura e não concorre com a ancoragem automática do navegador dentro das cenas.

Arrastos e swipes horizontais encaixam no card mais próximo ao terminar. A rolagem vertical continua nativa e os gestos dentro dos celulares permanecem independentes. As oito interfaces iniciais WebP somam 441.132 bytes e carregam antecipadamente com prioridade baixa; a hero mantém prioridade alta, e as demais telas continuam sob demanda. As linhas de cabeçalho/rodapé respeitam o tamanho real dos controles.

O novo teste `test_project_galleries.py` falhou na prévia anterior ao reproduzir a parada entre cards. Na versão corrigida passou em 360×740, 390×844 e 1440×900, verificando centro físico e progresso final de cada card, resize durante a transição, todas as abas e imagens decodificadas, textos completos, controles dentro da tela, swipe real CDP e arrasto em ambos os sentidos. Também passaram tipos, build, 32 testes Node, auditorias npm/Python, recursos estáticos e as suites completas de movimento, site, toque interno e IA simulada. A interação com o índice no teste de movimento espera a navbar terminar de aparecer antes do clique, sem auto-scroll artificial do botão sticky.

Prévia desta correção: `.edition-builds/projects-fixed-20261017-04`, porta 4197, IPv4 Wi-Fi verificado `192.168.1.4`. Base da passada: `ce7a35dbbfbf01e8264a2939008856458744f55b`; resultado identificado pelo head do PR #35. A prévia anterior da hero permanece na porta 4192 para comparação/retorno. Main preservada em `45ebfbbba3dd99fa64d62e6b5047901535568ef7`; sem merge, tag, release, deploy, migração ou sincronização de mirror VPS. As medições de transferência na tabela anterior pertencem à primeira revisão, antes deste carregamento antecipado das interfaces.

## Limites e próxima publicação

O Worker está implementado, testado com bindings simulados e desligado por padrão. Inferência real, custo, conta, domínio, namespace de quota e deploy ainda precisam de configuração e validação no destino aprovado. O limite de requisições da Cloudflare é por localidade e não é um teto global de faturamento.

O site não tem canal comercial inventado: o contato leva ao GitHub confirmado ou ao esboço local. Links externos e telas de terceiros mantêm seu contexto de demonstração; não se afirma disponibilidade comercial de todos os projetos.

Publicação requer revisão/homologação, merge pelo GitHub, tag anotada, SHA aprovado e preflight. O workflow legado de Pages publica a edição antiga; não foi acionado. Esta versão pressupõe uma origem na raiz do domínio, não o subdiretório atual do Pages.

Rollback da avaliação: continuar usando a versão anterior de `source`; o experimento está isolado. Rollback de produção não se aplica, pois nenhuma release foi feita. Mirror da VPS: não aplicável, sem acesso ou sincronização de VPS nesta tarefa.
### Fluxo cromático, scrub mobile e queda da folha

Passada vinculada à issue #34 e ao PR #35, a partir de `021ce6f19f9ebffb4842eca2b68db3a6768bd828`, na mesma branch `feat/34-immersive-edition`. O fetch confirmou a branch remota alinhada; a main permanece em `45ebfbbba3dd99fa64d62e6b5047901535568ef7`.

O limite de 700 px desativava as cenas em celulares com barras do navegador visíveis. As galerias agora aproveitam a altura inteira da tela mobile, com cabeçalho de 60 px reservando espaço para a navbar quando retorna. O scrub permanece ativo a partir de 620 px no celular; alturas menores e desktop abaixo de 540 px mantêm leitura linear para evitar cortes. A expansão/retração da barra não troca o modo durante a navegação. Gesto vertical acompanha continuamente a posição horizontal; swipe e arrasto continuam disponíveis, e os mockups preservam os próprios gestos.

A folha passa a oscilar perto de 90 graus, em vez de 176 graus, com inclinação e balanço menores. O fluxo de cor usa a altura real da folha e matiz ligado ao scroll. A tinta recebe uma faixa cromática sem substituir fundos e tarjas editoriais. O efeito alcança os textos visíveis e continua ao lado das interfaces mesmo quando a folha passa atrás delas. Sem loop de animação em repouso; modo leitura e preferência de movimento reduzido continuam soberanos.

Regressões: `test_leaf_flow.py` usa toque vertical real em 360×640 e 390×690, roda do mouse em 1440×900, ambos os sentidos das galerias, saída no limite, gradiente de tinta, postura horizontal, repouso e modo leitura. `test_project_galleries.py` inclui 360×640 e 390×640, além das dimensões anteriores, verificando todas as imagens/abas e controles sem cortes. O teste novo integra a CI.

Prévia: `.edition-builds/flow-fixed-20261017-06`, porta 4204 no Wi-Fi. O servidor local tem fila de 128 conexões; a fila padrão de cinco recusou recursos em testes concorrentes, sem erro de execução do site. Retorno da avaliação: snapshot e commit anterior `021ce6f`, porta 4197. Sem merge, tag/release, produção, migração ou mudança em VPS; mirror VPS não aplicável. O resultado imutável desta passada é registrado no commit e no PR.

Validação local final: tipos, build e verificação estática, 32 testes Node, todas as seis suites de navegador (movimento, fluxo, galerias, navegação, toque e IA simulada), `git diff --check`, npm audit e pip-audit passaram. HTTP 200 confirmado no IP Wi-Fi `192.168.1.4:4204`. Capturas de 360×640 e 390×844 revisadas; CI Linux é registrada no PR para o SHA publicado.

A CI inicial desta passada revelou dois limites adicionais: o teste aceitava a centralização horizontal antes de a cena chegar ao viewport, e as métricas de fonte do Linux deixavam o preview do Monitor 5 px abaixo do mínimo verificado. A espera agora verifica o destino do scroll e o quadro inteiro; espaçamentos dos cards em telas baixas foram ajustados sem reduzir o texto.
### Queda pendular com inércia e vento

Refinamento da issue #34 / PR #35, base `313fc0ec1e34621db992b87e59a98697044ad58b`, na branch `feat/34-immersive-edition`. Fetch confirmou alinhamento com a branch remota; main permanece em `45ebfbbba3dd99fa64d62e6b5047901535568ef7`.

A trajetória anterior era uma soma de senos independentes para posição e rotação; as galerias ainda substituíam essa trajetória por outro ciclo. `src/scripts/leaf-physics.ts` passa a integrar um modelo reduzido de flutter: oscilação angular autoexcitada com amplitude limitada, sustentação dependente da inclinação, arrasto quadrático relativo ao vento, velocidade de queda variável e torção amortecida com atraso. Rajadas coerentes em três escalas de tempo tornam as planadas assimétricas sem ruído aleatório por frame. Integração de ponto médio em passos de 1/120 permite consultar a mesma trajetória para frente e para trás, independentemente da taxa de quadros.

A referência física é Andersen, Pesavento e Wang, *Unsteady aerodynamics of fluttering and tumbling plates* (2005), DOI [10.1017/S002211200500594X](https://dragonfly.tam.cornell.edu/publications/S002211200500594Xa.pdf), e a [síntese experimental de Cornell](https://dragonfly.tam.cornell.edu/falling_paper.html). O modelo é uma aproximação visual em unidades adimensionais, não uma reprodução das equações completas do artigo nem uma simulação CFD calibrada de uma espécie de folha. O oscilador angular representa a instabilidade de flutter; o enquadramento converte energia cinética em pequenos arcos ascendentes nos retornos e acompanha a queda média para manter a folha no centro da leitura.

O pivô migra do talo para o corpo durante o desprendimento. A projeção conserva a folha deitada, com rotação em três eixos, mudança discreta de escala e luz conforme a atitude. A trajetória não reinicia entre dobras. A cor dos textos continua na posição pintada da folha, e interfaces continuam em primeiro plano. Scroll controla o tempo do modelo; ao parar, a cena permanece parada, sem loop ocioso. Leitura e movimento reduzido preservados.

Testes novos verificam reversibilidade, independência da amostragem, convergência ao dobrar a precisão, estabilidade durante 180 unidades de tempo, velocidade de queda limitada e inclinação antecipando a inversão lateral. A regressão visual no navegador também verifica postura horizontal, amplitude da torção, retornos ascendentes, centro do viewport e continuidade. Capturas mobile e desktop revisadas.

Prévia local: `.edition-builds/leaf-physics-20261017-02`, porta 4205, servidor restrito aos arquivos públicos. Retorno disponível na porta 4204, commit `313fc0e`. Sem merge, tag/release, deploy em produção, banco ou alteração em VPS; mirror VPS não aplicável. O SHA resultante e a CI são registrados no PR.

Validação local desta passada: tipos, build estática, recursos/links/JSON-LD, 35 testes Node (incluindo três regressões do modelo), suites de fluxo cromático e movimento mobile/desktop, auditoria npm e pip-audit passaram. Capturas e amostras da trajetória em 390×844 e 1440×900 revisadas. HTTP 200 confirmado em `192.168.1.4:4205`. Galerias em cinco dimensões e gestos reais de toque também passaram; CI completa vinculada ao SHA no PR.
