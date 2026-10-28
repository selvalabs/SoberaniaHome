# Revisão mobile do processo e mockups — issue #77

Base main aeeec22ffa79886c77c2de6bda071243e0504f38. Branch fix/77-mobile-process-mockups. Rollback: essa base.

Headline e contador passam a acompanhar o quadro sticky no mobile. As alturas medidas da intro/contador entram no cálculo de foco, progresso e saltos para etapas. Quadro usa altura adaptativa para deixar leitura abaixo mesmo em telas curtas. Peças começam mais afastadas e rotacionadas; final e desktop preservam o encaixe original.

Telefones usam aspect-ratio 0.49, com altura independente do espaço restante do frame. Um único figcaption permanece no frame, fora do rail horizontal. Conteúdo de cada tela continua rolável verticalmente e o rail nos dois sentidos.

ELARA adicionada como primeira, seguida da Soberania e das demais páginas na ordem anterior. Fonte: build local de produção v1.0.9 (8341b083794c155f00b6db62e6d0aba234755571), em _staging/elara-lp-release-v1.0.9/dist/production-1793134886604. Captura em 390px, reduced motion, após carregar os recursos; envios não GET bloqueados durante a captura. 25 tiles WebP de até 1200px. Os tiles são capturas da página real, sem recriação. Não se alterou o repositório ELARA. Porta 8188 indisponível; build servido em loopback 4202 para captura. Os links em data.js identificam o domínio oficial; o mockup mostra uma captura, sem checkout interativo.

Validação: typecheck e 58 testes Node passaram; build e check-static passaram. Chromium: 320x568,390x844,430x932; headline e board visíveis no início/meio/fim, instrução única fixa, proporção de telefone, ELARA carregada e tela com overflow. Teste real de toque passou: dois sentidos horizontais, heading, rolagem interna e página externa. Capturas inspecionadas em .playwright. Teste incluído nas suítes root/Pages. Sem release, merge, publicação, migração ou VPS.

Prévia da revisão: http://192.168.1.4:4201/. Main para comparação: porta 4200. Servidor static separado; nenhum serviço anterior foi encerrado.

Complemento: galerias de projetos passaram em 390x844,360x740,390x640,360x640 e 1440x900. Navegação horizontal passou em 240x320,320x480,360x568,390x600 e 667x375; o primeiro lote teve timeout de inicialização antes do caso 844x390. Os casos restantes foram retomados em execução isolada no build estável; consultar o resultado final na PR. A ordem final autorizada é ELARA, Soberania, Desafio da Empreendedora, Entretrama e demais páginas preservadas.

Os casos isolados 844x390,760x540,1024x600,1280x480 e 1440x900 passaram após a retomada.

As barras vertical dos telefones e horizontal da galeria foram ocultadas, mantendo overflow e interação nativos. Build/check-static e teste real de toque passaram. O preview usa capturas em tiles, não iframe: formulários e botões dentro das imagens não são interativos, e não há carregamento do site original ao rolar. Data.js organiza a coleção, gallery.js monta as telas e o manifesto define os tiles.
