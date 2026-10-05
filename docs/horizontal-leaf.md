# Folha nas cenas laterais
Issue #25, branch fix/25-horizontal-leaf, base 45ebfbbba3dd99fa64d62e6b5047901535568ef7.
Trajeto vertical na faixa central do viewport útil (41,5–54,5%), com blend de 55% da altura útil antes/depois do pin. Função de scroll determinística, sem animação de tempo nem alteração de layout.
Glow reage à distância vertical entre texto e folha, sem penalidade pelo deslocamento horizontal do card. Cards ocultos/inertes não recebem glow. Leitura/reduced motion desativam o efeito.
PR aplica o trajeto e glow lateral à base limpa; rascunho integrado usa o renderHighlights pré-existente da issue12 com o mesmo critério lateral. Outros drafts não incluídos.
Sem dependências/backend/migração. Sem merge/release/tag/deploy/VPS/mirror. Reversão pelo commit anterior. Produção v0.1.3 preservada.

Validação: teste dedicado em base limpa e prévia integrada em 320×640, 390×844, 1366×900; duas cenas, centro, glow, continuidade ±1px, reversão, idle, leitura e reduced motion passaram. Inspeção visual desktop e sintaxe/diff passaram. Teste usa DOM pronto/estado pronto, pois load completo aguarda conteúdo embutido independente do motion. Sem auditoria/build completo novo, nenhuma dependência alterada.

Refinamento: balanço lateral de um ciclo por galeria, amplitude 8% no celular/11% no desktop e inclinação suave acompanhando o pêndulo. Retirado giro rápido de 205°/180° concentrado no início da galeria. Percurso de scroll aumentado 50% (unidades 1,02 mobile/1,20 desktop), reduzindo a velocidade por gesto em cerca de um terço. Centro/glow e transições contínuas mantidos.

Validação do refinamento: teste dedicado passou novamente na branch e no Wi-Fi em três viewports; verificou amplitude do balanço, percurso mais longo e continuidade em x/y, além de glow, reversão, idle e leitura/reduced motion. Sintaxe e diff check passaram.
