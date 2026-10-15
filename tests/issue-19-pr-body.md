O mockup do Círculo oferece Login como primeira vista, seguido de Portal, Curso e Aula. Closes #19.

Captura da fonte atual da plataforma de cursos, main GitHub selvalabs/ponto_comum SHA 0ad28a351920ce08d0370cdaf72fc372b857bf30, com a aparência padrão e a imagem /assets/ponto-comum/opening/circulo-default-login.png. PNG 2880×1800, campos vazios, sem tenant configurado. Frontend empacotado apenas para captura; requests locais isolados com appearance vazia normalizada ao padrão e auth 401. Sem backend, contas, credenciais ou envio de login.

Inclui asset e circulo-preview.js para entrada direta no Login. Integração da home/galeria demonstrada na prévia local sobre rascunhos anteriores, sem incorporá-los neste PR.

Validação: galeria com quatro vistas e Home/End em 320/390/768/1366px; captura corrigida e entrada direta em 390/1366px, sem overflow ou erros JS; fontes/imagem carregadas; inspeção visual, sintaxe e diff check passaram. Build público e testes públicos/fallback passaram na mesma branch. Nenhuma dependência adicionada; auditoria da mesma base sem vulnerabilidades na revisão local anterior.

Branch feat/19-circulo-login; base 45ebfbbba3dd99fa64d62e6b5047901535568ef7; resultado a80ff800c369c27d18bc729849469030b2b802e2. Prévia local Wi-Fi porta 4181, PR draft. Sem merge/release/tag/deploy/migração/VPS/mirror. Rollback: retirar entrada Login/script; vistas anteriores preservadas. Produção permanece v0.1.3.
