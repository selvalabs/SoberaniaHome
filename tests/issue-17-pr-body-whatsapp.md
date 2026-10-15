A vista Avisos apresenta uma conversa de WhatsApp dentro de um mockup de celular, com o texto gerado pelo renderer em produção do Monitor Comunitário/Civic. O dispatcher envia o título e corpo sem reescrever. Somente nome, endereço e dados da ocorrência são fictícios.

Closes #17.

Implementação: documento estático editável em demos/monitor-whatsapp, texto em message.txt, formatação de negrito do WhatsApp, captura de alta resolução em assets/portfolio-monitor-whatsapp-v3.png e provenance.json com hashes das funções consultadas. O módulo monitor-preview.js permite abrir diretamente a vista Avisos por parâmetros explícitos. A home local alterna as três vistas e oferece Ver conversa para leitura ampliada.

Fontes: renderer na imagem de produção 82dc06d14e18be3e3fb357e35169d1e3cba4cc4b e dispatcher ativo da VPS; caminhos/hashes e leitura auditada registrados em docs/monitor-phone-mockup.md. Consulta somente leitura pelo alias soberania-vps. Nenhuma conversa de morador, registro pessoal, credencial ou banco foi consultado; nenhum envio de WhatsApp ou mudança de serviços.

Validação: texto exibido comparado ao renderer (apenas marcadores de negrito transformados em formatação); conteúdo integral sem corte; entrada direta e cliques reais nas três vistas em oito viewports (320–1440px); ausência de overflow, erros JS ou recursos faltantes; inspeção visual mobile/desktop; node --check e git diff --check. Sem novas dependências. Build/lint/typecheck não configurados para estes arquivos estáticos.

Escopo: o PR contém os assets, demo, módulo e documentação desta issue. A integração da home é demonstrada localmente sobre rascunhos ainda não publicados das issues 12–15, sem incorporá-los neste PR. Não representa um print de uma entrega real a morador; reproduz o texto de produção com variáveis fictícias.

Base 45ebfbbba3dd99fa64d62e6b5047901535568ef7; commit 0bca1bc2afad487c28e821e3e7c583db973ac543; branch feat/17-monitor-phone-alert.

Ambiente: prévia local Wi-Fi, porta 4181. Nenhum deploy, migração, tag de release ou sincronização de mirror da VPS. Homologação/merge pendentes. Produção da home permanece em v0.1.3/base SHA. Rollback local por arquivos dos rascunhos anteriores; VPS não foi alterada.
