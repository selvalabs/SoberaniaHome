# Login do Círculo na galeria

Issue https://github.com/selvalabs/SoberaniaHome/issues/19; branch feat/19-circulo-login; base 45ebfbbba3dd99fa64d62e6b5047901535568ef7.

Captura do frontend Círculo a partir da fonte em C:/Users/carlo/.codex/worktrees/circulo-release-main/ponto_comum, com a aparência padrão definida nessa versão. Não é o produto homônimo circulo-platform de operação de campo. A captura inicial usou um dist antigo de 19/09/2026 e foi corrigida. A fonte atual foi empacotada temporariamente com esbuild/JSX automático fora do produto para captura. Campos vazios, sem credenciais ou envio de formulário.

Playwright isolado: requests servidos apenas do bundle de captura e public da versão atual, auth retorna 401, appearance responde {appearance:{}} para a normalização do padrão, demais APIs respondem objeto vazio. Sem backend ou consulta a contas. Viewport 1440×900, captura 2× (2880×1800). Asset assets/portfolio-circulo-login-v2.png.

Integração local: Login como primeira vista, seguida de Portal, Curso e Aula; demais produtos preservados. circulo-preview.js abre trabalho/card 1 e seleciona Login somente com ?projeto=circulo&vista=login. Sem parâmetros inicia no Login.

PR contém asset, inicializador e documentação; galeria/home permanece integrada apenas sobre rascunhos locais ainda não publicados. Sem deploy/merge/tag/VPS/mirror ou alteração da autenticação. Rollback local: remover entrada Login e tag de script; vistas anteriores preservadas.

A imagem padrão correta é /assets/ponto-comum/opening/circulo-default-login.png, definida em src/domain/appearance.ts. A imagem de comunidade usada no dist antigo não é o login padrão atual. Campos email/senha vazios, imagem de fundo carregada e sem erros JS na captura. Nenhum tenant/conta real foi consultado.

Fonte confirmada: HEAD local e main no GitHub selvalabs/ponto_comum = 0ad28a351920ce08d0370cdaf72fc372b857bf30.

Ordem final solicitada: Login, Portal, Curso, Aula. Login selecionado e imagem correspondente desde a inicialização; entrada direta por parâmetro continua funcionando.
