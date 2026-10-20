# Issue #51 — faixa de Trabalho acima do portfólio

Issue: https://github.com/selvalabs/SoberaniaHome/issues/51
Branch: feat/51-work-marquee
Base: 77cbc76c632c95281d7cc2cc2e65af4f5362c061
Dependência/rollback anterior: e43b273 (#49 / PR #50, incluindo #47 e #45).

A abertura da terceira dobra tornou-se uma faixa tipográfica compacta, acima da galeria, com o título original Do conhecimento à construção. Texto introdutório, quatro projetos, mockups e navegação preservados. Tipografia de 32–72 px, menos espaço vertical e repetição sem grandes lacunas. Quatro grupos idênticos, um único título semântico e três cópias aria-hidden; o loop de 14 s avança exatamente um grupo.

Hover acelera para 2,4 vezes o ritmo e a saída retorna ao normal, com interpolação de 180 ms via Web Animations API sem reiniciar a posição. A interpolação usa RAF somente durante essa transição; o loop é CSS e pausa fora da tela. Há botão de pausa/retomada e pausa ao focar o controle. Movimento reduzido, leitura, print e no-JS exibem a frase inteira estática e escondem repetições/controle.

Validação: typecheck, 38 testes Node, build, verificador estático e npm audit aprovados (zero vulnerabilidades reportadas). Chromium em desktop, mobile e paisagem: largura dos grupos e continuidade, movimento, hover/retorno, pausa, texto/ordem, navegação da galeria, redução de movimento/leitura/no-JS e ausência de overflow. Screenshot mobile inspecionado. Safari/iOS físico pendente de homologação.

Prévia no servidor existente 0.0.0.0:4198, PID 12972. Nenhum processo interrompido; porta 4197 independente. Main preservada; sem merge, release/tag, deploy de produção, migração ou operação/sincronização VPS. PR rascunho coordenado com as dependências, reversão por commit revisado.
