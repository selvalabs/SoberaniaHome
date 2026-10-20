# Issue #49 — impressão do argumento sobre trabalho

Issue: https://github.com/selvalabs/SoberaniaHome/issues/49
Branch: feat/49-work-print-reveal
Base remota conferida: 77cbc76c632c95281d7cc2cc2e65af4f5362c061
Dependência: feat/47-hero-print-reveal / PR #48 até 6461d81.

O destaque É para isso que construímos tecnologia começa abaixo da headline e é empurrado pela altura real dos textos que vão surgindo. Os quatro blocos — abertura, contraponto, referência com crédito, consequência — são impressos em sequência, linha a linha, com pausas. A seção permanece sticky até concluir, com enquadramento progressivo em telas menores e a frase final inteira visível.

A mesma rotina da hero passou a aceitar seletores de estágio, área editorial e blocos. A configuração opcional de enquadramento final no fundo é usada apenas nesta dobra, preservando o enquadramento da hero. A antiga grade editorial é redefinida dentro da nova área para não criar colunas implícitas. Toda a redação, paráfrase, crédito e link são preservados; o link da referência fica inert enquanto ela está oculta. Leitura/reduced motion/print/no-JS mostram o conteúdo completo.

O servidor Astro já existente em 0.0.0.0:4198, PID 12972, foi reaproveitado no checkout sticky-45 agora na branch #49. Nenhum processo foi interrompido. As branches #45 e #47 permanecem preservadas; a porta 4197 serve a proposta independente de animações.

Recuperação: 6461d81, antes de estender a impressão para esta dobra. Sem merge na main, release/tag, publicação em produção, migração ou operação/sincronização VPS. PR rascunho para homologação; Safari/iOS físico ainda não testado.

## Validação e ajustes de integração
TypeScript, 38 testes Node, build, verificador estático e npm audit aprovados (zero vulnerabilidades reportadas). A nova suíte verifica quatro viewports, posição inicial/deslocamento real da frase, sequência dos quatro blocos, enquadramento final, reversão, medição sem salto, texto preservado, foco da referência e fallbacks. A suíte da hero fica limitada aos blocos da própria hero agora que há duas áreas de impressão.

A suíte de movimento aprovou navegação/índice/cenas, toque, modais, repouso, leitura, toolbar resize, glow e folha em ambas as galerias. A janela de observação do voo livre passou a cobrir mais de um ciclo de rajada (até cinco viewports, antes da primeira galeria), mantendo o limiar de amplitude e demais critérios: a abertura mais longa alterava a fase observada pela janela curta anterior. Física e trajetória não foram editadas. Grab/retorno da folha também aprovado.

A medição desliga temporariamente as regras de impressão antes de obter a altura natural, sem remover o espaço da seção. Uma regra antiga com height:auto!important prevalecia no CSS compilado; a especificidade da altura reservada da hero foi corrigida. Capturas desktop/mobile/paisagem inspecionadas; evidências locais fora do Git em .playwright. Os servidores de teste em loopback encerram ao concluir.

A conferência final também corrigiu o intervalo entre medir e desenhar: o estado revelado é restaurado dentro da própria medição, antes de poder ser exibido um quadro com toda a área expandida. Isso evita que o destaque ou os botões apareçam momentaneamente no fim do texto durante recálculo de fontes/layout.
