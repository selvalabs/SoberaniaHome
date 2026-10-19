# SPEC — Soberania Labs: revisão editorial integral da copy

**Issue:** https://github.com/selvalabs/SoberaniaHome/issues/38  
**Status:** escopo fechado, aguardando execução editorial em modo Pro  
**Repositório:** selvalabs/SoberaniaHome  
**Branch exclusiva:** editorial/issue-38-copy-autoral-v1  
**Base imutável:** 6cfe8869993a4e786f3ab47cb7461f0acaa1e2cd (main na criação da issue)  
**Escopo da presente etapa:** preparação documental; **nenhuma alteração na copy de produção**.

## 0. Contrato de proteção do projeto

1. A **main nunca será alterada** nesta tarefa. Também não serão alteradas as demais branches existentes, tags, releases e a publicação no ar. A base deve permanecer verificável pelo SHA acima.
2. Trabalho futuro **exclusivamente na branch nova**. É proibido mudar para branches antigas para editar, sincronizar por push, fazer merge/rebase/reset/cherry-pick, abrir PR automaticamente, publicar ou disparar workflows manualmente.
3. A experiência visual e funcional existente é patrimônio do projeto e fica **congelada**: design, CSS, interações, rolagem, folha, pins/sticky, galerias, modais, forms, navegação, acessibilidade, SEO técnico, Worker, dados, demos, imagens, responsividade.
4. A versão-alvo é a **edição completa Astro** montada em **src/pages/index.astro**. A edição pública curta de **site/** com quatro dobras é outro artefato e **não entra nesta revisão**. O merge de código na main não prova publicação da edição completa.
5. Esta spec não autoriza inventar serviços, equipe, casos, clientes, números, resultados, credenciais, contatos ou capacidades técnicas.
6. Invariantes técnicos valem mais que preferência literária: se um texto novo estourar um componente, reescrever o texto para caber; **não alterar o componente**.

## 1. Objetivo, público e tese

**Problema editorial:** a mesma ideia — autonomia, conhecimento, pessoas no centro, tecnologia para necessidades reais, controle de dados — reaparece na hero, nos deslocamentos, na entrega, em soberania, no sobre, no manifesto e nas notas, muitas vezes apenas com outras palavras. A leitura perde novidade, energia e precisão; o resultado pode parecer texto gerado por IA.

**Objetivo de comunicação:** uma pessoa que explore o site deve entender, sem precisar decifrar slogans:
- O que é a Soberania Labs e o que ela desenvolve.
- Para quem constrói e que problemas concretos enfrenta.
- Como tecnologia, trabalho, ciência, cultura e ecologia se relacionam na sua atuação.
- Quais projetos existem de fato e em que estágio estão.
- Que decisões técnicas e compromissos éticos orientam as entregas.
- Como iniciar uma conversa utilizando os canais já existentes.

A identidade é a de um **laboratório brasileiro de tecnologia**, com repertório técnico e sensibilidade social; não de agência que promete “transformar o mundo” com palavras vagas, nem de manifesto sem trabalho demonstrável.

## 2. Direção de voz — obrigatória

### 2.1 Personalidade

**Ensaística, literária na medida certa, materialista, crítica, brasileira, humana, simples sem ser simplista, tecnicamente séria.**

Escrever como alguém que lê, pesquisa, constrói e conhece os limites da própria técnica. Estilo autoral nasce da escolha de detalhes, cadência, observação e bons argumentos, não de uma sucessão de frases de efeito. Alternar frases curtas com períodos mais desenvolvidos conforme o conteúdo pedir.

Preservar a assinatura editorial e o uso institucional de “nós”, sem fingir uma equipe, escritório, capacidade de atendimento ou trajetória que não estejam documentados. Evitar autoelogios, superlativos e falsa intimidade com o leitor.

### 2.2 Regras práticas

- **Uma ideia central por seção**; cada parágrafo deve acrescentar fato, consequência, contraste ou exemplo que não tenha aparecido da mesma forma antes.
- Começar pelo concreto quando possível: uma cooperativa organizando pedidos, uma pessoa verificando um alerta, um sistema cuja exportação precisa funcionar.
- **Economia de texto sem perda de substância**. Cortar frases que apenas repetem a manchete; não reduzir o manifesto e o caderno a slogans desprovidos de pesquisa.
- Preferir verbos e objetos identificáveis a substantivos abstratos acumulados: “exportar os dados e testar a restauração” comunica mais que “ampliar potencialidades”.
- Tratar tecnologia como escolha **situada**: IA, modelos, MCP, APIs, agentes, bancos de dados, servidores e segurança aparecem quando explicam algo relevante. Traduzir jargão brevemente na primeira ocorrência necessária, sem abrir parênteses didáticos a cada frase.
- Distinguir **produto existente**, **demonstração**, **protótipo**, **experimento** e **proposta**. Não produzir falsa sensação de funcionalidades em produção.
- Preservar o viés social, ecológico e político: questionar a distribuição dos benefícios, o trabalho, as dependências e o território. Fazer isso por meio de argumentos, não por repetição de rótulos ideológicos.

### 2.3 Antipadrões editoriais (auditar explicitamente)

- “Mais X. Menos Y.” repetido em várias dobras. Pode existir como assinatura pontual, não como ritmo dominante.
- “Não é apenas X, é também Y”, “não começa em X e não termina em Y”, “no centro de tudo”, “transformar realidades”, “ferramentas que ampliam possibilidades”, “soluções reais para problemas reais” usados como muletas.
- Parágrafos que só trocam a ordem de “compreender, construir, adaptar, manter, transformar, decidir”.
- Repetir “autonomia”, “território”, “humano”, “conhecimento”, “soberania” como se a frequência demonstrasse a ideia.
- Metáfora vegetal/natural inserida em toda seção por causa dos assets botânicos. Natureza é parte do pensamento do projeto, não ornamento obrigatório.
- Amontoar siglas, áreas de trabalho ou palavras de tecnologia como prova de competência.
- Contrastes artificiais, falsos dilemas, frases solenes sem desdobramento factual, slogans encadeados e o tom universalizante de “a tecnologia precisa...” a cada parágrafo.
- Citações literais de autoras/autores sem checar texto, autoria, contexto e licitude de reprodução.

### 2.4 Referências culturais e científicas

A curadoria atual contempla Freire, Krenak, Milton Santos, Martin Luther King Jr., Malcolm X, Frantz Fanon, Angela Davis, Kropotkin, Nicolelis, Yuk Hui, Ruha Benjamin, Sasha Costanza-Chock, Bob Marley, Fela Kuti e outras vozes.

**Uso desejado:** referência como lente para uma ideia específica, com contexto, sem criar endosso à Soberania Labs, sem transformar pensadores diferentes em uma doutrina homogênea. A música e a cultura popular podem informar ritmo e sensibilidade, mas não exigem inserir letras ou citações a cada dobra. Verificar autoria, bibliografia, versões traduzidas e ligação com o argumento antes de inserir ou ajustar transcrições. Preservar os links verificados que já sustentam as citações de Lenin e Paulo Freire, salvo correção editorial fundamentada. Se uma passagem demandar verificação não alcançável, preferir paráfrase identificada ou não utilizá-la.

### 2.5 Três testes de qualidade

1. **Teste da oralidade:** um ser humano que conhece o assunto falaria assim sem parecer que está lendo um manifesto promocional?
2. **Teste da informação:** se este parágrafo desaparecer, o leitor perde um detalhe ou apenas mais uma variação do mesmo argumento?
3. **Teste do rigor:** uma pessoa técnica poderia contestar esta frase por exagero, promessa inventada ou imprecisão?

## 3. Arquitetura editorial — uma função para cada parte

Esta matriz governa a reescrita. **Não implica mover, eliminar ou redesenhar seções.**

| Ordem / componente | Pergunta que deve responder | Contribuição exclusiva / fronteira |
| --- | --- | --- |
| 01 — HeroSection | Quem é a Soberania Labs, o que faz e por quê? | Identificação clara, software/IA/infra, orientação social; não antecipar todos os argumentos sobre trabalho, ciência e portabilidade. Preservar título homologado “Tecnologia a serviço da humanidade.” salvo decisão editorial justificada. |
| 02 — ChoicesSection | Quem recebe os benefícios de ganhar produtividade? | Apresentar contradição entre eficiência e vida de quem trabalha; citação de Lenin como argumento, não decoração. Não repetir serviços e missão da hero. |
| 03 — TechnologySection | Como escolher a complexidade técnica adequada? | Alta tecnologia/baixa dependência como decisão de arquitetura, operação, custos e manutenção, em diálogo com a colagem da cooperativa. Não repetir a tese geral do trabalho humano. |
| 04 — KnowledgeSection | Que conhecimentos importam antes de projetar? | Relação entre ciência, técnica, prática, escuta e limites da IA; Paulo Freire como contexto, não como chancela. Não duplicar as etapas do processo. |
| 05 — WorkSection | O que foi realmente construído? | Quatro casos, com problema, funcionamento, estágio e limite verificável. Evitar promessas genéricas e reexplicar a filosofia do site em cada card. |
| 06 — ProcessSection | Como a ideia se transforma em trabalho confiável? | Seis etapas distintas: entender, investigar, prototipar, construir, testar, transferir. Cada verbo deve produzir uma informação nova. Não antecipar todos os detalhes de entrega. |
| 07 — AutonomySection | O que fica nas mãos de quem recebe o sistema? | Inventário concreto de acessos, documentação, recuperação, limites de permissão e formatos. Não repetir os caminhos de migração/hospedagem da seção 10. |
| ↳ — AtelierSection | Como o visitante experimenta uma pergunta de projeto? | Instruções claras e honestidade sobre cenários locais pré-preparados e IA opcional desligada por padrão. **Não alterar lógica, formulários, validações ou afirmações de privacidade.** |
| 08 — LabSection | O que está sendo investigado ou experimentado? | Diferenciar laboratório de portfólio. Cada card descreve hipótese, objeto de pesquisa ou protótipo com maturidade correta. Não fingir que tudo já está disponível comercialmente. |
| 09 — SpiralSection | Onde o digital encontra o mundo material? | Relações observáveis entre código, energia, água, trabalho, cultura e território. Trocar tautologias por consequências quando o espaço editorial permitir. Preservar os nove nós e quatro estados visuais. |
| 10 — SovereigntySection | Quais caminhos técnicos tornam uma escolha reversível? | Três exemplos concretos: hospedar, transportar dados, integrar sistemas. Enfocar condições e custos de mudança; seção 07 é **o que entregamos**, seção 10 é **como projetamos alternativas**. |
| 11 — ReferencesSection | Com quem o laboratório pensa, aprende e discorda? | Contextualizar a curadoria como diálogo e investigação, sem endossos inventados. Caça-palavras, 110 nomes e interações preservados. |
| 12 — AboutSection | Quem está por trás do trabalho e de onde vem seu olhar? | Origem, modo de trabalhar e singularidade com dados verificáveis; **não** recontar a lista de serviços, que já apareceu na abertura. Não inventar biografia/equipe. |
| 13 — ManifestoSection | Que compromissos orientam decisões difíceis? | Dez princípios operacionais, com consequências distintas. Textos curtos e concretos sem explicar novamente a narrativa inteira. Manter todos os princípios. |
| 14 — JournalSection | Que investigação nova o visitante pode levar? | Seis notas com substância própria, mais próximas de um ensaio de laboratório que de versões alongadas do manifesto. Evitar nota 1/6 e nota 3/4 como duplicatas. Preservar estrutura e total das notas. |
| 15 — ContactFooterSection | Como começa uma conversa ou colaboração? | Convite claro, direto, com caminhos reais **já presentes**. Não inventar WhatsApp/e-mail/formulário ou redes. Encerrar sem refazer a hero. |

### Fronteiras semânticas para resolver primeiro

**01/02/03/04:** apresentação ≠ distribuição dos ganhos ≠ decisão de arquitetura ≠ epistemologia dos saberes.

**05/08:** casos em operação ou desenvolvimento comprovável ≠ pesquisa/protótipo/exploração. Manter situações e estágios próprios de cada projeto.

**06/07/10:** método de construção ≠ inventário transferido na entrega ≠ rotas futuras de migração, hospedagem e integração.

**09/14:** espiral é argumento sintético e interativo; “A internet tem chão” deve investigar exemplos materiais e decisões técnicas que ainda não apareceram na espiral.

**12/01:** sobre deve humanizar e situar; não repetir slogan institucional e lista de serviços.

**13/14:** manifesto afirma compromissos; caderno expõe métodos, tensões, falhas possíveis, exemplos e perguntas abertas.

### Orientação específica para as seis notas do Caderno

- **IA sem magia:** anatomia operacional e verificabilidade dos agentes (entrada, ferramentas, permissões, saída).
- **A internet tem chão:** energia, máquinas, materialidade, manutenção e escolha da complexidade necessária.
- **Uma ferramenta que deixa sair:** migração, significado dos dados, formatos e restauração efetiva.
- **Documentar é compartilhar poder:** memória de decisões e handover legível por outras pessoas; não repetir apenas exportação.
- **Cultivar ferramentas:** observação de contexto e correção por uso; metáfora pontual, nunca substituta de método.
- **Quem controla o botão?:** governança de ações, autorização, registros, reversibilidade e intervenção humana; distinto da anatomia dos agentes da primeira nota.

## 4. Superfície de edição, sem modificar funcionamento

**Ler para estabelecer o baseline**: src/pages/index.astro (ordem canônica), src/components/sections/*.astro, componentes de cabeçalho/rodapé relevantes, dados editoriais efetivamente renderizados e docs/EDITORIAL.md como referência histórica. **Não assumir que o texto da V8.3 é o texto vigente**.

**Arquivos potencialmente editáveis na Fase 1**: somente os componentes Astro que contenham copy visível da página completa, atributos textuais editoriais estritamente pertinentes e eventual metadescrição. Para conteúdo dinâmico, identificar origem real antes de editar. **Não é uma autorização genérica para reescrever arquivos JavaScript.**

**Fora do escopo de alterações**: estilos, scripts de comportamento, build/configuração, package/lock, API, Worker, testes de comportamento, workflows, infraestrutura, assets e publicações; edição curta sob site/; documentação funcional, exceto relatório de revisão. Proibido alterar IDs, links/hrefs, classes, atributos data-*, quantidade e ordem de cards/notas/etapas/nós, tags estruturais, atributos que dirigem cenas, estados, bindings, lógicas, rotas e seletores.

**Texto de interface**: rótulos com função operacional devem permanecer identificáveis; se houver mudança textual inevitável, não alterar seu significado nem vinculação de acessibilidade. Não alterar termos de privacidade, consentimento ou status de desenvolvimento para ficarem “mais bonitos”.

**Texto + responsividade**: cada novo heading, legenda e card deve ser verificado quanto a quebra de linha, truncamento e contraste no layout atual. Ajuste de largura, espaçamento ou estilo **não** é solução permitida nesta issue. Se a proposta literária não couber, condensar a proposta.

## 5. Procedimento da Fase 1 (modo Pro)

1. **Congelar a referência:** verificar SHA de main da criação e HEAD da branch antes da edição. Trabalhar somente em editorial/issue-38-copy-autoral-v1.
2. **Inventariar texto real:** extrair copy visível, seções, headlines, subtítulos, cards, textos condicionais, manifesto, seis notas e microcopy editorial. Registrar origem por arquivo, evitando confundir protótipos e documentação antiga com produção.
3. **Mapa de redundâncias:** agrupar argumentos repetidos e mostrar onde cada ideia ficará, onde será cortada e onde será substituída por informação nova. Não contar apenas frequência de palavras: avaliar repetição semântica.
4. **Guia aplicado:** para cada seção estabelecer argumento, voz, densidade, dado verificável, eventual referência cultural e contribuição inédita.
5. **Reescrever só copy:** editar textos existentes nas mesmas posições/componentes, revisar concisão, voz e precisão dos conceitos técnicos. Não expandir escopo porque surgiu uma ideia visual.
6. **Auditoria factual:** conferir nomes, status, tecnologias, URLs e referências; sinalizar alegações incertas, sem fabricar resposta.
7. **Comparar antes/depois:** relatório com cada seção, trechos removidos, razão editorial, tese mantida e ganho de informação. Registrar variação total e por seção do volume de palavras **sem meta percentual artificial**.
8. **Inspecionar diff:** aprovar somente alterações de texto e arquivos documentais autorizados. Qualquer necessidade estrutural vira proposta separada, não mudança silenciosa.
9. **Verificação técnica factível:** checar sintaxe/compilação se for possível; validar texto em viewports 320, 390 e 1440 px ou documentar indisponibilidade. Preservar leitura sem JS e conteúdo acessível. Se CI estiver sem cota, **não insistir em dispará-la**: registrar claramente o que foi e não foi executado.
10. **Handoff:** relatar branch, SHA, arquivos modificados, matriz antes/depois, riscos residuais e verificações executadas. Nenhuma PR, merge ou publicação sem pedido explícito posterior.

## 6. Critérios de aceite da implementação futura

### Narrativa e conteúdo
- [ ] Os 15 capítulos e a Mesa de Possibilidades foram considerados no inventário e avaliados, incluindo cards, notas e manifesto.
- [ ] A contribuição de cada capítulo é distinguível da contribuição dos capítulos anteriores.
- [ ] Repetições semânticas relevantes foram eliminadas, consolidadas ou justificadas.
- [ ] Tom autoral e próximo, com literatura e referências como instrumentos de pensamento, não adorno.
- [ ] Termos técnicos aparecem de forma inteligível, no lugar necessário e sem imprecisões.
- [ ] A copy demonstra trabalho concreto antes de apresentar slogans.
- [ ] Estágio e limites de projetos/IA/demos estão corretos; nenhuma alegação inventada.
- [ ] Manutenção de todas as dez entradas do manifesto e seis notas do Caderno, com aportes diferentes entre si.
- [ ] Citações e referências relevantes devidamente verificadas ou marcadas como incerteza para revisão, nunca atribuídas por suposição.

### Preservação
- [ ] Diff sem mudanças de código comportamental, estrutura DOM, CSS, assets, interações, integrações, configuração e infraestrutura.
- [ ] Mesmo número/ordem de capítulos, etapas, projetos, notas, cenas e nós.
- [ ] Nenhuma rota, âncora, controle ou texto legal/privacidade foi quebrado.
- [ ] Texto cabe no layout existente em telas pequenas e grandes quando verificado.
- [ ] main e demais branches/tags/releases/deploys continuam intactos; branch de trabalho isolada.
- [ ] Nenhum CI ou deploy acionado manualmente; qualquer ausência de testes por cota documentada de maneira honesta.

## 7. O que NÃO é conclusão e o que será entregue agora

**Agora (Fase 0)** a única mudança autorizada no repositório é este documento na branch nova. A issue fica aberta para a implementação no modo Pro. Não há promessa de “copy pronta”, revisão visual concluída ou testes executados.

Na continuação, começar pelo mapa de repetições com o código real, propor a nova versão completa **dentro dos componentes existentes**, comparar com a base e registrar evidências no relatório. A execução pode ter vários commits **exclusivamente nesta branch**; nunca pressionar a main ou branches antigas.

**Referências técnicas da baseline:** README.md, docs/EXPERIMENT-34.md, src/pages/index.astro, src/components/sections/ e docs/EDITORIAL.md. Documentos mais antigos são contexto, não verdade automática da edição vigente.
