# Login do Círculo na galeria

Issue https://github.com/selvalabs/SoberaniaHome/issues/19; branch feat/19-circulo-login; base 45ebfbbba3dd99fa64d62e6b5047901535568ef7.

Captura real do build local da plataforma de cursos em C:/Users/carlo/projects/ponto_comum/dist, frontend Círculo. Não é o produto homônimo circulo-platform de operação de campo. Origem local HEAD 39cc67349ba761c2642ecba41372280d81934b25; build já existente. Campos vazios, sem credenciais ou envio de formulário.

Playwright isolado: requests servidos apenas de dist/public, auth retorna 401 e demais APIs respondem objeto vazio. Sem backend ou consulta a contas. Viewport 1440×900, captura 2× (2880×1800). Asset assets/portfolio-circulo-login-v1.png.

Integração local: Login como quarta vista após Portal, Curso e Aula; demais produtos preservados. circulo-preview.js abre trabalho/card 1 e seleciona Login somente com ?projeto=circulo&vista=login. Sem parâmetros mantém Portal por padrão.

PR contém asset, inicializador e documentação; galeria/home permanece integrada apenas sobre rascunhos locais ainda não publicados. Sem deploy/merge/tag/VPS/mirror ou alteração da autenticação. Rollback local: remover entrada Login e tag de script; vistas anteriores preservadas.
