# Monitor Comunitário — mockup de alerta no celular

Issue: https://github.com/selvalabs/SoberaniaHome/issues/17
Branch: feat/17-monitor-phone-alert
Base: 45ebfbbba3dd99fa64d62e6b5047901535568ef7

Novo asset vetorial autocontido: assets/portfolio-monitor-phone-v2.svg. Celular na tela de bloqueio com uma notificação de desligamento programado. Endereço e horário fictícios; identificação de prévia no SVG e texto alternativo. Sem entrega de push, WhatsApp, app nativo, contas ou coleta de dados. Sem scripts ou fontes/links externos. Não foi usado imagegen; o mockup é desenhado em SVG.

Integração local, sobre os rascunhos não publicados das issues 12–15: apenas a terceira vista da galeria monitor em portfolio.js usa o novo SVG. A legenda é “O aviso chega perto de quem precisa. Prévia de notificação.” O contêiner recebe a classe phone-mockup nessa vista e a perde ao voltar às outras. Essa classe remove a borda e a sombra do mockup de monitor, preservando as outras duas vistas. O rascunho anterior permanece em local-development-15.

A integração não é incluída neste commit porque portfolio.js e seus demais assets pertencem a rascunhos anteriores ainda não homologados. Este PR disponibiliza apenas o novo SVG e esta documentação para revisão.

Validação: parse do SVG, nenhuma tag script ou referência externa; node --check do script local; cliques reais nas três vistas em oito viewports, imagem carregada, texto alternativo demonstrativo, scroll estável e ausência de overflow/erros. Inspeção visual mobile e desktop. Não há build, typecheck, lint ou dependências novas para este asset.

Ambiente: prévia local no Wi-Fi, porta 4181. Nenhuma publicação, migração ou operação de VPS. Merge, homologação e release pendentes. Produção permanece em v0.1.3/base SHA; rollback local consiste em servir novamente os arquivos da prévia anterior.

## Correção de carregamento da prévia

Foi corrigido o cache da galeria e do CSS na integração local, usando URLs versionadas com monitor-phone-17-3. A pasta pública agora inclui os três scripts referenciados no HTML que faltavam: config.js, content.js e app.js. O construtor local da prévia foi ajustado para incluí-los.

O módulo monitor-preview.js abre explicitamente a galeria na vista Avisos somente com os parâmetros ?projeto=monitor&vista=avisos. Deve ser incluído após os scripts da galeria e da navegação quando esses rascunhos forem integrados. Funciona em modo animado e leitura; não altera a entrada normal.

Verificação pelo IP Wi-Fi: entrada direta e reload em 390 e 1366px, incluindo reduced motion. Mockup correto e Avisos selecionado; nenhum erro de JavaScript ou recurso script/stylesheet/image faltante. Apenas prévia local; produção permanece sem mudanças.
