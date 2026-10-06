# Folha e gestos nas galerias laterais

Issue #25; branch fix/25-horizontal-leaf; base 45ebfbbba3dd99fa64d62e6b5047901535568ef7.

A folha percorre a faixa central útil (41,5–54,5%), com balanço horizontal de um ciclo por galeria (8% mobile/11% desktop), giro completo de 360° progressivo e virada em profundidade até 105°. A saída mantém a volta completa visualmente equivalente a zero, sem desfazer o giro depressa. Aproximação/saída contínuas em 55% da altura útil antes/depois do pin.

Percurso de scroll aumentado 50% (unidades 1,02 mobile/1,20 desktop). Dentro das galerias, wheel vertical tem ganho 0,45 e toque vertical 0,55. Toque/trackpad horizontal converte deslocamento em scroll documental com ganho 0,55 da distância dos cards, respeitando o sentido da galeria e seus limites. Sem alvo acumulado nem animação após soltar o gesto. Fora das galerias, rolagem nativa; controles e multitouch não são interceptados. Leitura/reduced motion desativam os efeitos e a conversão.

Gestos de toque tratados no documento para incluir a folha sobreposta ao mockup. Touch-action permite pan vertical e pinch; controles continuam clicáveis. Gesto vertical pode sair da dobra.

Glow alinhado à distância vertical entre textos/legendas e folha; sem penalidade pela posição horizontal dos cards, respeitando cards ocultos. Base limpa tem renderLateralHighlights; rascunho integrado mantém renderHighlights da issue12 com o mesmo critério lateral. Outros drafts não incluídos.

Validação: teste dedicado de trajeto na prévia Wi-Fi em 320×640/390×844/1366×900, centro/glow/amplitude/percurso/continuidade em x/y/reversão/idle/leitura/reduced motion passaram. Novo teste de input na branch e na prévia: wheel real 200px → 90px nas galerias, wheel nativo fora, giro >250°, touch CDP horizontal nos dois sentidos em ambas galerias e toque vertical desacelerado passaram. Controles por tap e saída vertical no Wi-Fi passaram. Sintaxe/diff passaram. Sem novas dependências; build/auditoria completa não repetidos.

Sem backend/migração, merge, release/tag, deploy ou VPS/mirror. Reversão pelo commit anterior. Produção v0.1.3 preservada.
