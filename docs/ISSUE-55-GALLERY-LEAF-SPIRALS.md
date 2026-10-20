# Issue #55 — rodopios nas galerias horizontais

Issue: https://github.com/selvalabs/SoberaniaHome/issues/55
Branch: feat/55-gallery-leaf-spirals
Base remota: 77cbc76c632c95281d7cc2cc2e65af4f5362c061
Dependência/rollback: fix/53-leaf-reveal-origin até 6c8ef8c, PR #54 e anteriores.

Uma rajada helicoidal local se sobrepõe à queda aprovada durante Trabalho e Laboratório. O número de voltas acompanha as transições dos cards (mínimo três, máximo cinco): três voltas axiais adicionais na primeira galeria e quatro na segunda. O deslocamento elíptico cresce e se fecha, com inclinação, rotação lateral e pequena variação de escala para profundidade. As direções são opostas nas duas galerias.

A entrada e a saída têm deslocamento e velocidade locais nulos. Voltas axiais completas permanecem acumuladas ao sair: não há reinício nem giro inverso para voltar ao ângulo inicial. Fora das galerias, os offsets espaciais são zero e as voltas completas são visualmente equivalentes à orientação original. A física pendular, origem natural, clock lento dos reveals, rajadas anteriores, órbita VIDA e grab/retorno permanecem intactos. O trajeto é recentrado gradualmente para abrir espaço às espirais, mantendo o controle final de limites e a passagem de gestos nas interfaces.

Validação: TypeScript, 42 testes Node, build, verificador estático e npm audit aprovados (zero vulnerabilidades reportadas). Nova suíte Chromium: ambas as galerias em 390x844, 1440x900 e 844x390, múltiplas voltas, amplitude helicoidal, limites, opacidade, reversão exata e entrada/saída sem saltos ou desfazer giros; leitura e reduced motion. Adicionada ao CI. Testes matemáticos cobrem suavidade, limites e reversibilidade. Screenshots mobile/desktop inspecionados; Safari/iOS físico pendente.

A suíte de movimento geral verifica a postura horizontal na queda livre e aceita maior deslocamento por passo dentro das galerias, onde os novos rodopios são intencionais. A suíte dedicada verifica a continuidade rigorosa nas bordas das duas cenas.

Servidor existente reutilizado: 0.0.0.0:4198, PID 12080, checkout sticky-45 nesta branch. Nenhum processo interrompido; porta 4197 independente. Sem merge/main, release/tag, publicação em produção, migração ou operação/sincronização VPS. PR rascunho para homologação, reversão por commit revisado.

Regressões finais sobre a build estática aprovadas: suíte contínua de movimento/galerias/glow/leitura, origem e desaceleração dos reveals, grab/retorno e tema/órbita VIDA. O servidor temporário de teste em loopback foi encerrado ao concluir.
