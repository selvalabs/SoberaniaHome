# Issue 39 — manter a posição ao fechar diálogos

Issue: https://github.com/selvalabs/SoberaniaHome/issues/39  
Branch: `fix/39-index-scroll-restoration`  
Base: `e3f4035015f5a49fd80cc242248b2bff5bdb2092` (merge do PR #37).  
Data: 19 de outubro de 2026.

## Sintoma e causa

Escolher Abertura no índice grava a âncora `#hero`. Depois de rolar até um projeto, abrir e fechar o índice pode levar o documento ao topo. A posição observada no Chromium móvel foi de 2.519px para zero, tanto na versão anterior quanto na reorganizada. A reorganização não introduziu esse comportamento.

O fechamento atravessa o histórico. Durante `popstate`, a aplicação retira o bloqueio do corpo e restaura a posição salva. O navegador ainda pode restaurar seu estado persistido depois desse evento. Reativar `history.scrollRestoration='auto'` dentro do mesmo handler permite que essa restauração nativa sobrescreva a recuperação da aplicação.

Fontes: [ordem dos eventos em popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event#when_popstate_is_sent) e [scrollRestoration](https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration). O diagnóstico foi confrontado com instrumentação real: o evento começa com o corpo fixo; a aplicação o libera; a posição termina em zero. Adiar a reativação automática preserva os 2.519px no mesmo cenário.

## Correção localizada

- Manter o modo manual durante a travessia e restaurar a preferência original no próximo frame. A posição salva continua sendo recuperada imediatamente; não há animação de scroll nem atraso arbitrário em milissegundos.
- Se outro diálogo abrir antes desse frame, cancelar a restauração pendente e transferir a preferência original para o novo bloqueio. Isso evita herdar permanentemente o modo manual temporário.
- Guardar somente a preferência `auto`/`manual` em `history.state` das entradas de modal. Ao reabri-las por Avançar, recuperar essa preferência. Estado histórico anterior sem esse campo continua aceito.
- Preservar navegação explícita para outra dobra: a restauração agendada altera apenas a preferência do navegador, sem reaplicar uma posição antiga sobre o destino escolhido.
- Versionar a URL do controlador na home, evitando reutilizar uma cópia antiga do script em cache ao abrir a prévia corrigida.

Nenhuma mudança em texto, ordem das 16 dobras, assets, estilos, galeria, física da folha, Worker ou processamento de IA.

## Evidências e validação

`tests/test_dialog_history.py` falha no build da main com `before=2519, after=0` e passa no build corrigido. O teste usa o histórico real do Chromium, sem simular `popstate` ou substituir a API de histórico.

Cobertura em 390×844 e 1440×900, com movimento e com preferência por movimento reduzido:

- Índice depois de âncora antiga, nas duas galerias.
- Fechamento por Escape, botão e Voltar.
- Preservação do scroll e posição lógica do card, foco e desbloqueio do corpo.
- Avançar reabre a entrada e Voltar conserva a posição.
- Destino explícito pelo índice, preferência manual original e mapa de referências.
- Reabertura no mesmo turno de `popstate`, antes do frame de restauração.
- Carga direta de `#indice` e `#mapa-referencias`, com fechamento dentro do site.

O teste foi incluído na CI. Sintaxe do script, tipos, testes Node/Worker, build estática, diff check, auditorias e suites existentes complementam a regressão específica. A validação de navegador é em Chromium; não representa teste em Safari físico.

Resultado local: sintaxe, tipos, 36 testes Node/Worker, build/check estático, diff check, npm audit e pip-audit passaram (sem vulnerabilidades conhecidas). Passaram as oito suites de navegador: histórico de diálogos, movimento, folha/glow, viewports horizontais, galerias de projetos, edição do site/sem JS, toque dos mockups e Mesa/API simulada. A regressão de histórico também passou no endereço LAN final, após versionar a URL do script. HTML e controlador servidos nas duas portas foram comparados por bytes aos respectivos builds.

## Entrega e rollback

Build final: `.edition-builds/index-history-39-03`. Main permanece em `e3f4035`; a correção é proposta em PR separado e exige homologação antes do merge. Prévia main em 4190; correção em 4193. Retorno por revisão/revert à base; sem reset ou force-push.

Sem release/tag, produção, migrações, credenciais, VPS ou sincronização de mirror. O PR #37 já foi integrado no GitHub, a main local foi atualizada por fast-forward e sua árvore foi conferida contra o head validado `0614813`. A versão prévia anterior da main, `6cfe886`, permanece no histórico do merge.
