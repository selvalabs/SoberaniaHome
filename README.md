# Soberania Labs — V8.5.6

## Edição pública: quatro dobras e Em construção

A fonte selecionada para publicação fica em `site/`. O rascunho da raiz não é
enviado ao GitHub Pages. O pacote público contém somente as quatro dobras,
citação, rodapé e nove imagens aprovadas; não inclui os produtos em preparação.

Validação: instalar `requirements-pages.txt`, executar
`python tools/build_pages_release.py` e `python tests/test_pages_release.py`.
JavaScript nativo, sem dependências de runtime ou compilação. A auditoria de
dependências cobre o Playwright usado na validação; não há banco ou segredos.

Publicação: depois da revisão e homologação do PR, criar uma tag **anotada**
`vMAJOR.MINOR.PATCH` no SHA de merge de `main` e enviá-la. Iniciar o workflow
`pages.yml` a partir de `main` com `release_tag` igual a essa tag. O ambiente
Pages permite somente esse contexto; o checkout da aplicação usa a tag
imutável selecionada. O workflow confirma
que a tag aponta para um commit integrado em `main`, valida o site e publica
exclusivamente `.pages-release/`. O arquivo `release.json` identifica o SHA no ar.
Não há deploy automático por push de branch ou tag. O dispatch exige uma tag anotada.

Verificação: abrir `https://selvalabs.github.io/SoberaniaHome/`, conferir
`release.json`, quatro seções, imagens, índice, leitura e animação no rodapé.
Rollback: preservar as tags anteriores. O alvo anterior é `v0.1.2`
(`600d985f863592a53365d368d72cfc9aa8f2d244`), que usa a estrutura antiga da
raiz e não pode ser publicado pelo novo workflow sem uma adaptação. Se for
necessário restaurá-lo, abrir uma issue/PR de rollback que promove a fonte
daquele SHA para `site/`, validar, homologar e publicar uma nova tag anotada.
Esse rollback restaura também a edição antiga com quinze seções: confirmar o
impacto antes de autorizar. Releases posteriores com `site/` podem ser
republicadas por dispatch da respectiva tag, sempre com autorização e preflight.

## Execução local

Para abrir a landing page, sirva este diretório como arquivos estáticos. Por
exemplo, com Python:

```powershell
python -m http.server 4173
```

Para executar os testes funcionais, instale as dependências e os navegadores
do Playwright:

```powershell
python -m pip install -r requirements.txt
python -m playwright install chromium
python -m pytest -q
```

O `scrollY` do documento é a única fonte da narrativa visual. Em ponteiros
finos, a roda do mouse controla uma desaceleração do próprio documento; a
folha e as cenas são atualizadas diretamente a partir da posição que está
visível. Toque, teclado, barra de rolagem e movimento reduzido continuam
nativos e imediatos.

Focused correction round.

## Alterado nesta rodada

### Folha
- curva contínua Catmull–Rom em vez de parar/recomeçar em cada dobra;
- inércia com spring-damper;
- rajadas em frequências diferentes;
- inclinação reage à velocidade lateral;
- a folha não é mais reparentada para containers locais que podiam cortá-la;
- opacidade permanece integral: texto denso desvia a trajetória, não faz a folha desaparecer.

### “Precisamos de … melhores”
- frases permanecem próximas;
- aparecem cumulativamente uma abaixo da outra;
- reveal curto + pequena subida;
- frase atual recebe foco sem remover as anteriores;
- distância de scroll reduzida.

Nenhuma outra seção foi redesenhada nesta rodada.


## V8.4
- integra o Leaf Motion Lab ao site real;
- folha com profundidade, perspectiva e microflutuação;
- sem mudanças estruturais nas demais dobras.


## V8.5 — Leaf Motion 3.0
- árvore mobile reposicionada para revelar tronco;
- folha inicial menor, junto à copa;
- desprendimento no primeiro scroll sem subida;
- queda pendular, sustentação, rajadas e inércia;
- rotateX/rotateY/rotateZ com tumbles de 180°;
- rajada impulsiva nas duas seções horizontais;
- escala variável para profundidade;
- pouso deitado, com bounce e integração sob a camada frontal da pilha.


## V8.5.4
- corrige sumiço da folha durante o Caderno/Jornal;
- landing agora depende da geometria real da pilha;
- folha só é reparentada quando a pilha está visível;
- bottom final normalizado para chegar em estado `rest`.


## V8.5.6
- playhead visual com velocidade máxima para amortecer roda, trackpad e touch;
- sincronização imediata preservada apenas para navegação explícita e layout;
- pouso final determinístico no ponto físico da pilha;
- estado `rest` sem microflutuação residual;
- testes de scroll rápido e pouso final baseados em condições reais;
- dependências do Playwright documentadas para reprodução local.


## V8.5.7
- transição da folha sincronizada com o playhead visual;
- estados explícitos `entering`, `occluded`, `exiting` e `visible` nas áreas escuras;
- ocultação real por `visibility` e `opacity`, além da composição por camadas;
- `processo` e `espiral` tratados como passagens escuras independentes;
- retorno gradual da folha após a faixa de saída;
- testes específicos para entrada, ocultação e reentrada.


## V8.5.8
- removida toda microanimação baseada em tempo da folha;
- posição, rotação e escala passam a responder apenas ao scroll e ao assentamento físico curto;
- RAF encerra quando a folha e as cenas alcançam seus alvos;
- novo teste garante que o contador de frames não avança após o repouso.


## V8.5.9
- playhead amortecido apenas durante eventos ativos de scroll;
- após 80 ms sem entrada, posição visual e folha sincronizam no mesmo frame;
- novo teste garante que a folha para imediatamente após o gesto.


## V8.6
- folha convertida para uma visualização diretamente dirigida pelo scroll;
- removidas mola, inércia, impulsos e qualquer força autônoma;
- trajetória vertical monotônica: ao rolar para baixo, a folha nunca sobe;

## V8.6.1
- removido o playhead visual amortecido que atrasava folha e cenas em relação
  ao documento;
- a desaceleração da roda passa a avançar o `scrollY` real, antes da renderização;
- folha, transições e cenas são uma projeção imediata do `scrollY` atual;
- toque, teclado, seleção de texto, campos de edição e preferências de
  movimento reduzido não são interceptados.
- rajadas e espiral afetam apenas posição horizontal e rotação;
- novo teste verifica a queda contínua até a pilha.
