# Issue #53 — origem natural da queda da folha

Issue: https://github.com/selvalabs/SoberaniaHome/issues/53
Branch: fix/53-leaf-reveal-origin
Base remota: 77cbc76c632c95281d7cc2cc2e65af4f5362c061
Dependência/rollback: feat/51-work-marquee até 565fa3d, PR #52, incluindo as anteriores.

Reprodução em 390x844: parado em scrollY=200, disparar sl:layout-change mudava o ponto da folha de y=93,9 para 290,8. Em y=1000, a folha passava de 637,8 para 803,0, encostando no limite inferior. O cálculo somava o scroll à origem medida dentro da hero sticky e prolongava o lançamento usando a altura artificial adicionada pelo reveal.

A rotina de impressão agora registra origem e fim natural da hero enquanto ela está desfixada para medição. O controlador da folha usa esses valores no lançamento, sem adicionar a extensão de leitura nem recapturar um ponto já pinned. Física pendular, rajadas, giros, órbita, colisões e grab/retorno são preservados. O avanço do relógio foi depois ajustado conforme o pedido adicional de desaceleração descrito abaixo.

No primeiro teste da origem corrigida, antes da desaceleração adicional, os recálculos nos mesmos pontos preservaram as posições: 235,4/147,6 em 200; 155,0/408,9 em 600; 239,6/409,5 em 1000; 138,7/414,9 em 1800. A queda alcança o meio da tela durante o reveal e o layout parado não muda sua posição.

Prévia: servidor existente 0.0.0.0:4198, PID 12972; sem interrupção. Porta 4197 independente. Sem merge/main, release/tag, produção, migração ou operação/sincronização VPS. PR rascunho para homologação; reversão por commit revisado. Safari/iOS físico pendente.


## Desaceleração durante toda a dobra
O usuário esclareceu que o scroll extra deve apenas distribuir a queda por toda a leitura. Um relógio virtual desconta a extensão artificial das duas revelações, com entrada/saída de velocidade suaves e monotônicas. A queda conserva a trajetória, mas avança bem menos por pixel rolado nessas dobras; após sair delas, recupera o ritmo original sem reiniciar a fase. As rajadas das galerias e a chegada ao rodapé usam o mesmo relógio, mantendo a continuidade dos giros. Órbita e posição das galerias continuam acompanhando seus próprios progressos de scroll.

A origem natural e a altura sem runway determinam a geometria do lançamento; o relógio virtual determina seu avanço lento. O scroll nativo, os reveals e o glow não são desacelerados.

Validação: 40 testes Node (incluindo relógio contínuo, velocidade positiva/reduzida, retomada e reversão), TypeScript, build, verificador estático e npm audit sem vulnerabilidades reportadas. O teste de navegador cobre origem/pose estáveis após recálculo, desaceleração em ambas as dobras e entrada sem saltos em ambas as galerias; foi adicionado ao workflow CI. As suítes das revelações e grab/retorno passaram. A janela da suíte de voo considera agora o runway descontado para observar um ciclo físico completo sem enfraquecer seus critérios.

A suíte contínua de movimento também passou após a desaceleração: navegação/cenas em 390 e 1440 px, folha e toolbar/glow/leitura em quatro formatos mobile, queda pendular, giros inerciais e presença nas duas galerias. As verificações finais da nova origem/clock, fluxo e tema/órbita foram executadas sobre a build estática, em servidor temporário de loopback encerrado ao terminar.
