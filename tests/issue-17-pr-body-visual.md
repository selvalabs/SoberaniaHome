A vista Avisos apresenta uma conversa de WhatsApp com o texto gerado pelo renderer em produção do Monitor Comunitário/Civic, usando nome, endereço e ocorrência fictícios. Closes #17.

A apresentação segue o print de Android fornecido pelo usuário, adaptado ao tema claro solicitado: fundo bege, balão verde-claro à direita, texto corrido de peso normal e cabeçalho simples. Roboto local em 16px/20px, emojis coloridos Noto e logo real do Civic no perfil. Não incorporamos o print nem seus dados pessoais. Trata-se de reconstrução, não de captura de entrega real; emojis Noto não são desenhos proprietários do WhatsApp. Fonte editável em demos/monitor-whatsapp e captura em assets/portfolio-monitor-whatsapp-v10.png. Texto e marcadores originais preservados em message.txt; negritos têm peso normal nesta apresentação. Licenças e origem dos assets incluídas.

O módulo monitor-preview.js permite abrir a vista Avisos por parâmetros explícitos. Integração da home demonstrada localmente sobre rascunhos das issues 12–15, sem incorporá-los neste PR.

Fonte: funções de renderização auditadas em leitura na imagem de produção 82dc06d14e18be3e3fb357e35169d1e3cba4cc4b e dispatcher ativo da VPS. Caminhos e hashes em docs/monitor-phone-mockup.md. Não foram consultados conversas, registros pessoais, credenciais ou bancos; nenhum WhatsApp enviado ou serviço alterado.

Validação desta revisão: 320,390,768,1366px; igualdade exata do texto incluindo emojis e quebras, fonte 16px, tema claro, assets carregados, entrada direta na galeria v7, sem overflow horizontal ou erros JS; captura inspecionada e git diff --check. Build e testes públicos/fallback e pip-audit passaram na revisão anterior; nenhuma dependência mudou nesta revisão.

Branch feat/17-monitor-phone-alert; base 45ebfbbba3dd99fa64d62e6b5047901535568ef7; resultado 5c4cba46a568b16c81eafd4348bbe662359ef932. Prévia local Wi-Fi na porta 4181. PR draft, homologação e merge pendentes. Sem tag/release/deploy/migração ou sincronização de mirror. Produção continua v0.1.3/base SHA. Rollback local por rascunhos e assets anteriores preservados.

Aparelho refinado: moldura grafite com reflexo metálico, botões com relevo e sombra em camadas. Tela aprovada preservada; comparação de pixels do interior sem diferenças, excluídos cantos periféricos que expõem a moldura. Prévia e demo verificadas em 320/1366px sem erros, overflow ou assets faltantes.

Asset final aprovado: PNG transparente 2184×4000px com tela voltada para cima e lateral direita visível, copiado byte a byte da proposta aprovada pelo usuário. Galeria local atualizada, mantendo leitura frontal no link Ver conversa. Testado em 320/390/768/1366px: alpha confirmado, nova imagem carregada, sem overflow horizontal ou erros JS. Integração da home continua local sobre rascunhos anteriores.

Perspectiva final suavizada conforme pedido: X 16°, Y -18°, Z -4°, mantendo lateral direita, tela voltada para cima e alpha. PNG 2184×4000px. Galeria local verificada em 390/1366px; sem erros JS/overflow, asset correto; diff check passou.
