# Issue 63 — leitura e enquadramento mobile

Base: `cc8046b30f82d33b84ecc15b4871017b2caf9e25` / `v0.2.0`.
Issue: https://github.com/selvalabs/SoberaniaHome/issues/63
Branch: `fix/63-mobile-viewport-fit`.

## Diagnóstico

A hero chegava a 906 px de composição em uma tela de 568 px; a segunda dobra
também reservava a altura de todo o argumento. O pin deslocava essa composição
para enquadrar os parágrafos, levando headline e chamadas para fora da tela.
Várias outras seções herdavam espaçamentos e alturas mínimas de desktop.

## Comportamento

- Em celulares e janelas baixas, os dois reveals têm uma cena limitada à área
  disponível abaixo da navbar. A headline permanece no lugar; os textos abrem
  espaço para os botões/destaque e, quando necessário, acompanham a impressão
  dentro da área de leitura. Todas as linhas são apresentadas pelo scroll nativo.
- A altura visível é recalculada quando a barra do navegador muda. O tempo de
  leitura usa a altura estável de referência, e o progresso do reveal é preservado
  em mudanças de tamanho. Não há novos handlers de wheel/touch nem loop contínuo.
- O espaço reservado para a navbar inclui a área segura superior; chamadas e
  controles respeitam o recorte inferior de aparelhos com indicador de início.
- Nos capítulos de leitura vertical, a mudança de altura preserva o trecho
  visível. Campos em foco também permanecem enquadrados; a remedição por
  ResizeObserver aguarda o resize para não refazer as cenas antes dessa ancoragem.
- As linhas da grid mantêm a altura intrínseca, evitando sobreposição quando a
  janela de leitura é menor que o conjunto dos parágrafos. Há respiro para os
  ascendentes das fontes na borda da máscara.
- Colagens, títulos, margens, abas, documentos, diagrama de soberania, referências,
  manifesto, caderno, formulário e rodapé recebem proporções móveis. As abas da
  entrega ficam lado a lado e atualizam a orientação ARIA e as teclas de navegação.
- As galerias continuam ocupando o viewport e conservam o scrub e a leitura dos
  mockups. Processo, artigos, formulários e conteúdo expandido continuam em etapas
  de leitura vertical: não se tenta comprimir todo um ensaio ou formulário em uma
  tela, nem esconder texto para produzir uma altura artificial de uma dobra.
- Modo de leitura, movimento reduzido, HTML sem JavaScript, conteúdo editorial,
  física da folha e controle dos glows permanecem disponíveis.

## Verificação

O teste `test_mobile_viewport_fit.py` percorre 16 capítulos em 320×480, 320×568,
360×640, 375×667, 390×844, 430×932, 667×375 e 844×390. Mede a headline, a cena e a chamada durante
71 posições de cada reveal; usa `Range.getClientRects()` para comprovar que cada
linha real do texto aparece integralmente em algum momento. Também verifica
progresso ao redimensionar, finais de capítulos alcançáveis, teclado das abas e
modo de leitura. Integra a suíte do build estático em CI.
`test_mobile_safe_area.py` simula 35 px de área superior e 34 px inferiores para
verificar as chamadas dos reveals e os controles das duas galerias.
`test_mobile_reading_resize.py` verifica parágrafos nas colagens, sobre, caderno
e rodapé, além do textarea em foco, ao reduzir e aumentar a altura do navegador.

A inspeção visual local percorre as 16 dobras nos temas claro e escuro. As
capturas e inventários intermediários ficam em `.playwright/` (ignorado pelo Git).
O navegador automatizado é Chromium; Safari/iOS físico precisa de homologação.

## Integração e recuperação

Prévia na porta Wi-Fi existente 4198, sem iniciar outro servidor. A branch é
entregue para homologação por PR; esta correção não publica uma nova versão.
Rollback do desenvolvimento: `v0.2.0` / `cc8046b`. Sem dados, migrações, VPS,
Worker, credenciais ou sincronização de mirror envolvidos.
