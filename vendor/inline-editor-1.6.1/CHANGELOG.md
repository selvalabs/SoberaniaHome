# Changelog — Inline Editor Pack

## 1.6.1 — Delete & Smart Reflow (2026-09-13)

Base 1.6.0. Mesmo integrador, runtime local e contrato de autoria. Sem backend ou novos comandos de produção.

- Lixeira junto de Mover, setinha de opções e acesso pelo painel Elemento; posicionamento defensivo em telas pequenas.
- Del exclui a seleção estrutural; texto, campos, Range, composição, modais e gestos em andamento são protegidos. Backspace não exclui elementos.
- Exclusão normal deixa o navegador recompor fluxo/flex/grid, sem reescrever CSS, coordenadas ou alturas originais.
- Espaçador opcional, validado geometricamente no viewport atual; rollback em composições incompatíveis. Caixa persiste no final, marca editorial não.
- Undo/Redo no histórico existente, mantendo os nós reais, posição, listeners, estado e comentários. Lotes normalizam pai/filho. Conflitos externos não consomem silenciosamente uma entrada.
- Tarefas LLM abertas exigem confirmação; comentários excluídos ficam somente nos nós retidos por Undo, sem registros órfãos no arquivo salvo.
- Compactação limitada a altura autoral com baseline nesta sessão, e remoção explícita de wrapper vazio simples. Sem cascatas.
- Ajuda, escopo, auditoria de decisões, demonstração e QA atualizados. Resultados reais e limites em RELEASE_REPORT_v1.6.1.md.

## 1.6.0 — Refinamento da interface (2026-09-13)

Base 1.5.4. Sem mudança de arquitetura ou nova dependência de runtime.

- Cabeçalho ? © − ×; Sobre com identidade, versão, execução local e aviso interno de copyright.
- Central de Ajuda com oito guias, busca local tolerante a acentos, navegação, contexto de seleção, orientações de comentários/LLM, atalhos e limites.
- Finalizar renomeado para Fechar edição; Salvar HTML para Salvar editável.
- Exportar final acionando o Clean Build existente com confirmação e o mesmo caminho de gravação/download. Preserva o dirty state do editável.
- Novos modais com Escape, retorno de foco, navegação contida por Tab e revisão em oito viewports.
- Ajuda/versão centralizadas no VERSION.json existente; estrutura regular de seções; referências de versão corrigidas.
- COPYRIGHT.md e escopo da release; sem watermark, backend, CLI nova, temas, migração de localStorage ou Smart Clean Build.
- 40 novos casos de produto; regressões herdadas mantidas, com expectativas de versão atualizadas. Relatórios identificam simulações, fixture recuperada e limites dos dispositivos ensaiados.

### Compatibilidade

Os contratos data-ie-*, comentários, efeitos e authored runtime permanecem. Não há upgrade automático de HTML já integrado: como antes, o integrador recusa uma instalação existente.

### Correção documental

O registro de edição textual antes rotulado novamente como 1.5.4 foi corrigido para 1.5.3; o conteúdo histórico foi preservado.

---

## 1.5.4 — Duplicação e comentários (2026-09-12)

- Duplicar elemento restaurado em Mais → Elemento, com IDs únicos, undo/redo estrutural e sem copiar comentários.
- Nova subaba Mais → Comentários.
- Dois tipos: Nota e Ajuste para LLM.
- Handoff LLM machine-readable via `#ie-comments-data` + `data-ie-comment-anchor`.
- Comentários podem referenciar o trecho textual selecionado.
- Ajustes LLM podem ser marcados como resolvidos/reabertos.
- Clean Build remove metadados de comentário.
- v1.5.3 preservada como baseline funcional.


## 1.5.3 — Edição textual direta / trecho / Tab

- Ativação do conteúdo no pointerdown: um clique já permite digitar no ponto clicado; removidos os botões de entrada redundantes.
- Estado textual explícito caret/range/block/batch, com indicador de escopo e seleção preservada durante o uso da toolbox.
- Formatação por text nodes em runs autorais: reutilização, divisão nas bordas, união de vizinhos e preservação de strong/em/links/spans originais.
- Dez propriedades tipográficas respeitam a seleção parcial. Text-align permanece no bloco. Limpar formatação também respeita o trecho.
- Tab/Shift+Tab por roots semânticos, ignorando runs/ocultos. Foco de UI e modais preservado; scroll consciente de movimento reduzido.
- Cor e marca-texto com preview no input e commit coalescido; atalhos B/I/U usam o mesmo engine.
- CTAs editáveis sem acionar navegação/Enter; tabelas preservam blocos internos.
- Normalização das quebras nativas recém-inseridas em P/H* para salvar/reabrir HTML válido.
- Serializer preserva runs necessários no artefato editável e retira só a marca no Clean Build.
- Módulos de geometria, Box Model e efeitos preservados byte a byte em relação à v1.5.2.

### Refinamentos encontrados durante QA

- Ao sair de um campo numérico, o browser passa brevemente o foco ao body. Isso podia fazer a restauração de Range roubar o foco da toolbox. A intenção de foco agora é mantida explicitamente até uma nova interação com o conteúdo.
- `scrollIntoView({behavior:'auto'})` ainda obedecia ao smooth do host. Na preferência de movimento reduzido, a rolagem do host é neutralizada só durante essa chamada e restaurada em seguida.
- O teste de CTA passou a medir a navegação depois do posicionamento da fixture. O recenter de teste enquanto havia hover causava 2px de diferença; os testes continuam exigindo menos de 2px de deslocamento causado pela formatação, sem ampliar tolerância para esconder navegação.

## 1.5.2 — Box Model / Espaçamento

- Controlador único para padding, margin, gap e unidades; removidos handlers antigos do painel.
- AUTO real e origem semântica distinguida do valor calculado. Sem regravar CSS ao selecionar.
- Preservação de %, rem, em, vw, vh, calc/clamp/min/max/var e shorthands com substituição pendente.
- Aplicação inline normal primeiro; tentativa bloqueada é revertida integralmente e não marca dirty. Força !important somente após confirmação, avisando efeito global.
- Conversão explícita com equivalência quando segura; normalização de valores mistos sem zerar tudo ao incrementar.
- Steppers relativos, limites efetivos, hold consolidado; campos vazios nunca significam zero implicitamente.
- Vínculos locais à seleção; contexto inline/tabela e gap flex/grid; avisos sobre margens dos filhos.
- Reset local sem perder outras edições; histórico, salvar/reabrir e Clean Build preservam unidades.
- Leitura CSS evita varrer imagens Base64 irrelevantes. Transições do host não provocam falso conflito de prioridade.
- Fixture permanente de Box Model, suíte de 36 gates e verificações defensivas complementares.
- GeometryController, EffectsEngine, autores de efeitos e seleção geral preservados.

### Ajustes de QA

Os testes anteriores agora esperam a versão 1.5.2 e comparam a contagem de steppers antes/depois do save, em vez de exigir os antigos 60 (foram adicionados os três campos de gap). O teste de CTA espera o término da transição original .25s antes da medição. O gesto de mobilidade ativa o controle visível Mover livre, não apenas uma flag interna sem atualizar o overlay.

---
## Histórico preservado


## 1.5.1 — 2026-09-11 — Mobility hotfix

Esta versão é uma correção de estabilidade sobre a v1.5.0. Não altera o modelo de autoria, as 5 abas, as 24 subabas, a multiseleção, os efeitos ou o contrato de serialização.

### Problemas confirmados

- Em determinadas posições, o grab `⠿ Mover` podia ficar por baixo da toolbox. O elemento continuava selecionado, mas o hit-test do navegador atingia a toolbox em vez do grab, dando a impressão de movimento travado.
- O drag processava cada `pointermove` bruto imediatamente. Cada evento podia fazer snapping, leituras de layout, escrita de estilo e atualização de overlay. Em mouses de polling alto isso gerava trabalho excessivo no main thread e podia produzir engasgos perceptíveis.
- Durante movimentos em elementos inseridos em ancestrais ainda animando/transicionando, o sistema de coordenadas visual podia mudar no meio do gesto.
- Em `absolute/fixed`, atualizar `left/top` continuamente durante o gesto forçava mais trabalho de layout do que o necessário.

### Correções

- Grab com posicionamento adaptativo: tenta topo, base e laterais da seleção e evita colisão com a toolbox e bordas da viewport.
- `pointermove` coalescido por `requestAnimationFrame`: somente o estado mais recente do ponteiro é aplicado por frame.
- Linhas de snapping são calculadas/capturadas no início do gesto em vez de reconstruídas integralmente a cada evento.
- Preview de movimento orientado ao compositor com `translate`; a geometria autoral definitiva é consolidada uma única vez no release.
- Elementos `absolute/fixed` deixam de reescrever `left/top` em todo evento e só consolidam a posição final ao soltar.
- Animações/transições relevantes do elemento e ancestrais são pausadas durante o gesto e restauradas ao final, evitando drift de coordenadas.
- Um gesto continua gerando uma única entrada no histórico.
- Novo teste de regressão `tests/test_mobility.py` e evidência comparativa em `qa/evidence/mobility-comparison.json`.

### Medidas do cenário de regressão

No mesmo Chromium/Linux e na mesma landing:

- v1.5.0: média do handler de movimento `2,152 ms`, p95 `4,1 ms`, máximo `5,9 ms` em 61 amostras.
- v1.5.1: média `0,141 ms`, p95 `0,3 ms`, máximo `0,4 ms` no comparativo equivalente.
- Burst sintético de 500 `pointermove`: 1 frame de movimento processado na execução de regressão da v1.5.1.
- Caso `.device-tablet`: antes o hit-test do centro do grab atingia a toolbox; na v1.5.1 atinge `#ie-move-handle`.

Essas medidas são diagnósticas do ambiente de teste e não representam garantia de latência idêntica em outros equipamentos/navegadores.

## 1.5.0 — 2026-09-11

- Cinco abas principais com 24 subabas contextuais.
- Tipografia, steppers, multiseleção e operações em lote.
- GeometryController unificado, Smart Guides, snapping e axis-lock.
- Visual v2 com fundos, bordas compostas, sombras e filtros.
- 48 presets em Hover/Entrada/Contínuo/Interação com intensidade e duração.
- Reset/baseline, dirty state, proteção ao recarregar e checkpoint de salvamento.
- Integração reproduzível, QA canônico e smoke da landing real.
