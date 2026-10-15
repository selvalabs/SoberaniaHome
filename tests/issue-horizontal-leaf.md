Problema: nas galerias laterais a folha passa junto à borda inferior, distante dos textos.
Escopo: centralizar a trajetória vertical durante cenas horizontais e alinhar glow dos textos à altura real da folha; entrada/saída contínuas, reversão e posição parada determinísticas. Preservar queda inicial, imagens e layout.
Aceite: folha na faixa central do viewport útil em Trabalho/Laboratório; glow segue o alinhamento vertical mesmo com deslocamento horizontal dos cards; sem efeitos em leitura/reduced motion.
Risco: descontinuidade na passagem entre capítulos, glow em cards ocultos. Validar centro, limites, reversão, idle e leitura em mobile/desktop; sintaxe/diff checks. Sem dependências/backend/deploy.

Refinamento solicitado: balanço pendular mais perceptível e deslocamento mais lento. Percurso de scroll das galerias aumentado 50%; um ciclo amplo de balanço com inclinação suave por galeria. Verificar amplitude/percurso e continuidade em x/y.

Correção solicitada: giro da folha como impulso de vento lateral; lentidão perceptível no próprio gesto; gesto horizontal mobile deve mover a galeria, além da rolagem vertical. Preservar controles, multitouch/pinch, leitura/reduced motion e saída da dobra. Testar wheel real e touch via CDP.

Complemento: liberar arrasto lateral de mouse desktop nas duas galerias, com captura do ponteiro, ambos sentidos, limites e preservação de controles/cliques/arrasto próprio da folha.

Aceite: ao exceder o último quadro, gesto segue para baixo; além do primeiro, segue para cima e devolve próximos movimentos ao fluxo vertical. Wheel, trackpad, mouse e touch tratados.
