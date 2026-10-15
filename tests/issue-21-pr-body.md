O Analytics passa a ter a sequência Login, Visão geral, Mapa e Documentação na prévia local. Login é a vista inicial. Closes #21.

Inclui capturas reais de Login e Mapa (2880×1800), inicializador de entrada direta e documentação de integração. Fonte: build local de apitracker-internal-current/dashboard/frontend, source HEAD 90533563f65f3ee2cbf609c2274770734391472e. Captura isolada com dados fictícios de quatro cidades; sem backend ou envio de autenticação.

Validação: imagens carregadas e ausência de erros JS; troca das quatro vistas e início no Login em 320/390/1366px; sintaxe JavaScript e git diff --check passaram. Sem novas dependências. Integração portfolio.js/index.html permanece na prévia sobre rascunhos anteriores não publicados, sem incorporá-los a este PR. Build completo/CI deste PR não executado.

Branch feat/21-analytics-views; base 45ebfbbba3dd99fa64d62e6b5047901535568ef7; resultado c5b760d89a6162f3f0fe00c72b9a85166f1697e2. Risco: composição ainda depende dos rascunhos anteriores da galeria. Sem migrações, merge, release/tag, deploy ou VPS/mirror. Rollback: seletor e imagens anteriores preservados; produção v0.1.3 permanece.
