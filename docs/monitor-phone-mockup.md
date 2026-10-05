# Monitor Comunitário — conversa de WhatsApp

Issue: https://github.com/selvalabs/SoberaniaHome/issues/17
Branch: feat/17-monitor-phone-alert
Base: 45ebfbbba3dd99fa64d62e6b5047901535568ef7

## Resultado

A interface usa a apresentação clássica de conversa do WhatsApp para Android: cabeçalho verde, ícones de chamada, avatar, papel de parede com desenhos, balão recebido com horário e compositor com emoji/anexo/câmera/microfone. O texto de produção foi mantido integralmente. A apresentação preserva exatamente as quebras e os dois negritos do envio, sem acrescentar destaque aos rótulos. Roboto local em 16px/21px mantém a escala em celulares; emojis coloridos Noto em assets locais substituem o fallback do Windows. O avatar usa a logo real do produto, encontrada em src/monitor_comunitario/web/static/favicon.png do civic-utility-monitor-public. Os emojis Noto são abertos e não são os desenhos proprietários do WhatsApp; permanece uma reconstrução. Licenças e fontes em demos/monitor-whatsapp/assets.

Mockup de conversa no WhatsApp, com a mensagem construída pelo renderer em produção. O asset atual é assets/portfolio-monitor-whatsapp-v7.png; a fonte editável está em demos/monitor-whatsapp. O SVG anterior permanece preservado, mas não é a vista usada na prévia local.

O texto foi gerado com as funções build_notification_message, resident_notification_details, registered_address e safe_notice_cause extraídas em leitura do container em produção. O dispatcher envia exatamente título + duas quebras de linha + corpo, sem reescrever. A marca Civic, as orientações da Celesc, a redação, os emojis e os marcadores de negrito foram preservados. Nome, endereço, município, data, horário e motivo são fixtures fictícias. Não foi lida uma conversa real de morador nem enviado WhatsApp.

Texto preservado em demos/monitor-whatsapp/message.txt; fonte e hashes em provenance.json. A imagem é uma reconstrução da conversa para apresentação, não um print de uma entrega a morador. Sem imagegen, conta de WhatsApp, conexão externa ou coleta de dados.

## Evidência de produção — somente leitura

SSH exclusivamente pelo alias soberania-vps. Host confirmado srv1502293, usuário root, porta 22. /opt/hermes resolvido em /dev/sda1 (ext4); diretório inicial /root. APIs do Monitor saudáveis; dispatcher ativo. Imagem de runtime do Monitor: 82dc06d14e18be3e3fb357e35169d1e3cba4cc4b.

Dispatcher: /opt/hermes/monitor-comunitario/data/scripts/monitor_registration_dispatcher.py, SHA256 a6682f51c45ebc0065fef6aa20652f295cf74897ed6e9cb44a6cf1bfbd948176.
Renderer no container da API: /app/src/monitor_comunitario/services/matching.py, SHA256 a6651c46eb2abc646896b5d8f7abf91b7a3399c71e6e0376e9e7e4297b0bfd32.

Foram usados hostname/id/pwd/realpath/df, docker ps e inspect de serviços do Monitor, busca direcionada por nomes de scripts e extração AST de funções puras de renderização. Nenhum banco, registro pessoal, conversa, credencial ou variável de ambiente foi consultado. Nenhuma escrita, envio, reinício, deploy, migração ou outra mudança na VPS.

## Integração e prévia

A integração local permanece sobre os rascunhos não publicados das issues 12–15. Só a vista Avisos da galeria monitor muda para o PNG de WhatsApp, com moldura de telefone e legenda indicando texto de produção e dados ilustrativos. O link Ver conversa abre o documento completo. URLs do script/CSS são versionadas em monitor-whatsapp-17-8. Config/content/app estão presentes na pasta pública.

O módulo monitor-preview.js abre Avisos somente com ?projeto=monitor&vista=avisos. Este PR contém a imagem, a demonstração editável, o módulo e esta documentação; não incorpora os outros rascunhos da home.

## Validação e release

O conteúdo visível foi comparado ao texto produzido pelo renderer, removendo apenas os marcadores de negrito de WhatsApp para a exibição. Sem corte de conteúdo, overflow, erros JS ou recursos faltantes. Entrada direta e troca das três vistas verificadas em 320×568, 360×640, 390×724, 390×844, 412×915, 768×1024, 1366×768 e 1440×900. Inspeção visual desktop/mobile, node --check e git diff --check. Sem novas dependências; build/lint/typecheck não configurados para estes arquivos estáticos.

Ambiente: prévia local Wi-Fi, porta 4181. PR de rascunho, homologação/merge/release pendentes. Nenhum deploy ou tag de release. Produção da home permanece na base/v0.1.3. Rollback local: arquivos preservados dos rascunhos anteriores; VPS não foi modificada e mirror não foi sincronizado.

## Referência visual fornecida pelo usuário

Revisão baseada no print fornecido em 05/10/2026: texto corrido sem destaques editoriais, cabeçalho com nome em peso normal, proporções de Android, balão à direita e espaçamento de linhas/parágrafos. Conforme orientação posterior, o tema é claro (fundo bege, texto escuro, balão verde-claro). Emojis e logo do Civic mantidos. Os marcadores originais permanecem em message.txt; o peso visual dos strong é normal nesta apresentação. Não incorporamos o print nem seus dados pessoais ao site/repositório.

Validação da revisão: 320,390,768,1366px; texto exato após retirar marcadores, imagens carregadas, Roboto 16px em todos os tamanhos, tema claro, entrada direta na imagem v7, sem overflow horizontal ou erros JS. Inspeção visual da captura.
