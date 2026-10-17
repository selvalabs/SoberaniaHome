# V8.3 — decisões de implementação

## Estrutura

O HTML contém o texto editorial. O JavaScript acrescenta a experiência espacial; não é necessário para recuperar o conteúdo das etapas.

A classe `motion` habilita cenas sticky. Sem ela, os projetos, palavras, etapas e textos permanecem em fluxo normal. O modo de leitura também entra automaticamente quando o sistema pede movimento reduzido ou a tela tem altura inferior a 580 px, como em muitas orientações paisagem.

## Um gesto principal

Trabalho e Laboratório usam rolagem vertical nativa como entrada. O primeiro trilho avança para a esquerda; o segundo retorna para a direita. A ordem editorial dos projetos é preservada: o segundo usa composição invertida, não uma lista lida de trás para frente.

A posição central dos itens é medida. O deslocamento nunca usa uma distância extra arbitrária depois do último item. Há controles anterior/próximo de 44 px como alternativa ao gesto.

## Tempo, velocidade e saltos

As cenas usam unidades de etapa/projeto. Dentro de uma sequência, a aproximação do alvo é exponencial, baseada em segundos, com velocidade limitada. O mesmo cálculo foi simulado a 60, 90, 120 e 144 Hz.

Um salto grande no documento, uma navegação pelo índice ou uma mudança superior a 1,05 etapa são tratados como descontinuidade: a cena sincroniza o destino em vez de reproduzir todas as etapas rapidamente. Ao sair do trecho, seu estado assenta no limite correspondente.

**Isto não bloqueia a rolagem física e não garante “um projeto por gesto” em qualquer flick.** Esse tipo de garantia exigiria interferir na navegação do usuário. O que se evita aqui é aceleração adicionada pelo código, overshoot do trilho e reprodução atrasada de cenas já abandonadas.

## Ciclo de renderização

`requestAnimationFrame` é iniciado por eventos ou por uma aproximação ainda em andamento. Para quando cenas e folha estão estáveis. `visibilitychange` pausa a renderização fora de vista; abrir um diálogo pausa o motor.

`IntersectionObserver` acompanha proximidade das cenas. Alturas, pontos de entrada/saída, centros dos cards e limites da folha são cacheados. `ResizeObserver` acompanha dimensões dos frames; resize/orientação recalculam o layout. Não há consultas geométricas nos renderizadores de cena.

A etapa atual é preservada numa mudança relevante de largura. Alterações de teclado durante edição não acionam uma reconstrução agressiva da narrativa.

## Viewport

A área sticky usa `svh` com fallback para `vh`, mantendo a altura de referência estável quando a interface do navegador aparece ou desaparece. Modais usam `dvh` para ocupar o espaço disponível. Esta escolha evita tratar uma mudança da barra do navegador como avanço da narrativa.

## Texto e movimento

Textos corridos não fazem crossfade sobre outros parágrafos. A etapa ativa é a única legível; a geometria e a periferia podem continuar mudando. A máquina de palavras, que contém apenas títulos, permite passagem espacial entre estados.

## Folha

A origem está dentro de `tree-wrap`, em coordenadas proporcionais à imagem. O recorte CSS retira da composição uma folha solta já desenhada no PNG da árvore, para não simular dois objetos protagonistas.

A folha é um elemento persistente, recolocado entre a camada global e os hosts locais das cenas sem mudar suas coordenadas visuais. Nos hosts fica atrás das superfícies de leitura. Fora deles, zonas de exclusão cacheadas reduzem sua presença junto a texto crítico.

Na Espiral, a folha e os elementos usam o mesmo progresso suavizado. No rodapé, a trajetória utiliza a posição física de `leaf-dock` e o fim real do documento. `End` termina no apoio, sem acumular segundos de viagem atrasada.

O monte tem 37 instâncias das três folhas, distribuídas em planos traseiro, intermediário e frontal. Não há formas abstratas nem novos assets gerados.

## Portabilidade

Não há requisições de terceiros. O preview incorpora os PNGs em CSS/dados, reaproveitando o mesmo recurso nas várias folhas, em vez de repetir o base64 a cada instância do monte.

## Referência técnica consultada

- MDN — `requestAnimationFrame`: timestamp, refresh rate e chamada de execução única. https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- MDN — unidades de comprimento e viewport. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length
- MDN — elemento `dialog` e comportamento modal. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- MDN — `prefers-reduced-motion`. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
