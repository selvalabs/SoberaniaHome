# Vistas do SoberanIA Analytics

Issue https://github.com/selvalabs/SoberaniaHome/issues/21; branch feat/21-analytics-views; base 45ebfbbba3dd99fa64d62e6b5047901535568ef7.

Ordem solicitada: Login, Visão geral, Mapa, Documentação. Login é a vista inicial. O Funil foi retirado do seletor; o asset antigo fica preservado. Círculo também inicia no Login, conforme issue 19.

Capturas reais do build existente em apitracker-internal-current/dashboard/frontend/dist, frontend source HEAD 90533563f65f3ee2cbf609c2274770734391472e. Navegador isolado sem backend: auth 401 no Login, sessão viewer fictícia no Mapa, quatro cidades com contagens sintéticas (Florianópolis45, São Paulo30, Lisboa15, Buenos Aires10) e cem sessões totais. Nenhum usuário/senha preenchido, envio de autenticação, dado pessoal ou API de produção consultado. Não houve mudança no produto Analytics.

Assets: portfolio-analytics-login-v1.png (2880×1800), portfolio-analytics-map-v1.png (2880×1800), captura Chromium 2×. Mapa e logo carregados, quatro pontos e ausência de erros JS verificados. analytics-preview.js abre Login somente com ?projeto=analytics&vista=login, cena trabalho/card0.

Integração home/galeria demonstrada sobre rascunhos locais anteriores, sem incorporá-los neste PR. Sem novas dependências, release/tag/merge/deploy/VPS/mirror. Produção v0.1.3 mantida. Rollback local: restaurar seletor anterior e URLs; todas as imagens anteriores preservadas.

Captura do mapa enquadrada após rolar até a distribuição geográfica, para deixar o mapa inteiro visível.
