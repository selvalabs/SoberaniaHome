# Issue #57 — automação e autonomia

Issue: https://github.com/selvalabs/SoberaniaHome/issues/57
Branch: `chore/57-automation-autonomy-copy`.
Base remota: `77cbc76c632c95281d7cc2cc2e65af4f5362c061`.
Dependência e rollback: `65eaf72ed684abb84982d96b3d2f8a385524b535`, PR #56 e sequência anterior incorporada por fast-forward; main não alterada.

A dobra #folha passa a abrir com “Mais automação. Mais autonomia para quem trabalha.” A copy aprovada explica a redução de esforço, o controle das escolhas pelas pessoas e a distribuição dos ganhos de produtividade. A paráfrase de Lenin permanece identificada como paráfrase, com o link original; sua formulação explicita o salário que não acompanha a produtividade e a intensificação do desgaste.

Preservados a estrutura dos quatro blocos, seletores do reveal, pin, destaque final empurrado pelo texto, marcações de glow e código de movimento da folha. Apenas conteúdo e asserções de testes existentes foram alterados. O teste de contraste passa a selecionar a etiqueta fixa real, evitando o placeholder que já existia na hero.

Validação: TypeScript, 42 testes Node, build, verificação estática e diff check aprovados; npm audit sem vulnerabilidades reportadas. Reveal sequencial, enquadramento, deslocamento do closing, leitura, reduced motion e ausência de JS verificados em 1440×900, 390×844, 844×390 e 320×568. Contraste e glows verificados em 390×844 e 1440×900, nos temas claro e escuro e modo de leitura. Capturas da prévia Wi-Fi inspecionadas em mobile escuro e desktop claro. Safari/iOS físico não testado.

Prévia existente reutilizada em `http://192.168.1.4:4198/`, PID 12080, resposta HTTP 200 com a nova copy. A inspeção inicial dentro do sandbox não mostrou o listener; confirmação fora dele identificou o servidor existente. A tentativa de iniciar outro Astro foi recusada pelo lock sem substituir o processo. Nenhum processo encerrado. Sem merge, tag/release, migração, deploy em produção ou operação/sincronização de mirror VPS.
