# Issue #47 — impressão dos textos da hero

Issue: https://github.com/selvalabs/SoberaniaHome/issues/47
Branch: feat/47-hero-print-reveal
Base GitHub: 77cbc76c632c95281d7cc2cc2e65af4f5362c061
Dependência preservada: issue #45 / PR #46, até f08534d.

A headline permanece completa. Os três parágrafos originais são revelados por uma passagem irregular de tinta, linha por linha, usando as linhas reais do texto responsivo. Um leve desencontro cromático se alinha e os grifos avançam com o scroll. Sem cópias de texto, assets novos ou dependências. Conteúdo e links originais preservados.

Em desktop de pelo menos 1100 px, a hero só permanece fixa se sua composição inteira couber abaixo da navbar. A duração extra é de até 1100 px de rolagem, com trecho final de leitura completa. Em celular ou viewport baixo, cada parágrafo é revelado à medida que entra na tela, sem pin. O mesmo controlador de movimento cuida da medição e renderização: sem listeners de wheel adicionais, temporizadores permanentes ou RAF ocioso.

Sistemas brasileiros foi incluído novamente no grupo do glow após ser movido para fora da hero pela issue #45. Laboratório independente permanece na composição. Ambos acompanham o scroll, mantendo as regras de contraste existentes e a transparência da etiqueta em colisões.

Modo leitura, movimento reduzido, impressão e ausência de JS preservam a leitura integral. Texto semântico permanece disponível para tecnologias assistivas. Não há links ocultos dentro dos blocos revelados; as chamadas de ação continuam disponíveis.

Prévia: servidor Astro existente em 0.0.0.0:4198 (PID 12972), no checkout sticky-45 agora na branch desta issue. Nenhum processo foi interrompido. Branch #45 permanece preservada local/remotamente. A proposta de animações da porta 4197 permanece separada.

Recuperação: f08534d (antes da revelação). Sem merge na main, release/tag, publicação de produção, migração, operação ou sincronização de espelho VPS. Homologação visual pendente; Safari/iOS físico não testado.

## Validação concluída
- TypeScript, 38 testes Node, build e verificador estático aprovados; npm audit sem vulnerabilidades reportadas.
- Hero: Chromium em 1440x900, 390x844, 844x390, 320x568; progressão/reversão, medição sem salto, texto preservado, glow, temas, resize, leitura, reduced motion, repouso e ausência de JS. A espera do teste acompanha o estado de scroll renderizado, evitando corrida com RAF.
- Etiqueta: três viewports, cinco dobras, posição, colisão/recuperação, passagem de cliques e modos de leitura.
- Galerias: dez viewports de 240x320 até 1440x900; toque em três formatos; mudança de orientação e largura. Retorno da folha também aprovado.
- Inspeção de screenshots desktop e mobile, claro/escuro. Os testes estáticos usaram um servidor temporário em loopback, encerrado ao concluir. Uma primeira execução no dev foi interrompida pelo HMR durante edição; a versão compilada passou. A medição que temporariamente removia a altura foi corrigida para evitar saltos de ancoragem.
