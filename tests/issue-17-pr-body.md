A vista Avisos do Monitor Comunitário passa a comunicar o recebimento de um alerta no celular por meio de um mockup vetorial de tela de bloqueio e notificação. Endereço e horário são ilustrativos, sem representar entrega real de push ou WhatsApp.

Closes #17.

Novo SVG autocontido, sem scripts, fontes ou links externos. Documentação registra a integração local: terceira vista da galeria, legenda demonstrativa e remoção da moldura de monitor apenas nessa vista. O PR contém somente o SVG e a documentação; a integração local depende dos rascunhos não publicados das issues 12–15 e não os incorpora.

Validação: parse e inspeção do SVG, node --check no script local; três vistas com cliques reais em oito tamanhos; suíte existente do portfólio em oito tamanhos, teclado/troca rápida/falha de imagem e modos leitura/reduced motion/sem JS; inspeção visual mobile/desktop; moldura restaurada ao voltar às demais vistas; git diff --check. Sem novas dependências. Build/lint/typecheck não configurados para o asset.

Base: 45ebfbbba3dd99fa64d62e6b5047901535568ef7. Commit: 3f4dd9a38f6d1a2852206439bbd6c64db2dc322d. Branch: feat/17-monitor-phone-alert.

Apenas prévia local Wi-Fi na porta 4181; nenhum deploy, migração ou operação de VPS. Merge/homologação pendentes. Produção permanece em v0.1.3/base SHA. Rollback local: voltar aos arquivos preservados em local-development-15; futuro rollback versionado por revert deste commit.
