# Issue #45 — etiqueta fixa

Issue: https://github.com/selvalabs/SoberaniaHome/issues/45
Branch: feat/45-sticky-brand-label
Base remota conferida: 77cbc76c632c95281d7cc2cc2e65af4f5362c061
Estado anterior recuperável: f4ee1d0

Somente Sistemas brasileiros acompanha a página. Laboratório independente permanece na hero. A etiqueta usa uma camada fixa, ancoragem CSS com svh e margem segura, sem deslocamentos calculados por scroll. Sua opacidade cai para 12% quando texto, mídia ou controles cruzam sua posição, recuperando-se ao desocupar. Linhas de texto são medidas individualmente para evitar colisões com espaços vazios de parágrafos. A árvore decorativa da abertura não é obstáculo. Camada abaixo da navbar; pointer-events:none preserva os gestos.

Servidor Astro já existente reaproveitado: 0.0.0.0:4198, PID 12972. Nenhum servidor interrompido. A porta 4197 permanece destinada à branch de animações.

Validação: TypeScript, 38 testes Node, build, verificador estático, npm audit (zero vulnerabilidades reportadas), testes Chromium da etiqueta em 390x844, 1440x900 e 844x390; posição em cinco dobras, colisão/recuperação de opacidade, passagem de clique, movimento reduzido e leitura. Regressão de grab/retorno da folha aprovada. Screenshot mobile inspecionado. Safari/iOS físico ainda depende de homologação.

Sem merge, tag de release, publicação de produção, migração ou acesso/sincronização VPS. Rollback por commit revisado, preservando f4ee1d0. Os quatro commits locais anteriores da própria issue são preservados e enviados junto da correção.
