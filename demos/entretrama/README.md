# Entretrama — estudo demonstrativo

Página estática de uma escola fictícia de tecelagem manual. Estrutura adaptada da landing local Escola Pé no Chão V31 por solicitação do usuário; nova identidade, conteúdo próprio e três fotografias geradas. Nenhuma foto, professora, depoimento, preço ou matrícula da escola original foi reaproveitado.

Abra `index.html`, ou sirva a pasta com qualquer servidor estático. Sem instalação, conexão externa, formulário, rastreamento ou pagamentos. A primeira prática abre um diálogo e permite baixar um roteiro ilustrativo em TXT. A FAQ e o conteúdo permanecem disponíveis sem JavaScript.

## Imagens

Geradas com a ferramenta integrada imagegen e copiadas para `assets/`: `atelie-v1.png`, `trama-v1.png`, `pecas-v1.png`. Os originais foram preservados. As cenas e pessoas são fictícias. Os prompts estão em `image-prompts.json`.

## Validação

`tests/test_landing_school.py`: tamanhos 320×568, 390×844, 768×1024 e 1366×900; imagens locais, ausência de overflow, âncoras, FAQ, diálogo, download real do roteiro, Escape e retorno do foco. Também verifica as 16 vistas da coleção e leitura sem JavaScript. Inspeção visual desktop e mobile.

## Coleção

`../landing-collection/index.html` oferece oito projetos, duas vistas por projeto, com capturas isoladas de arquivos locais e requisições externas bloqueadas. SHÅLA está identificada como reconstrução de referência. As prévias não atestam publicação, pagamentos ou integrações em produção.

## Versionamento

Issue: https://github.com/selvalabs/SoberaniaHome/issues/15

Branch: `feat/15-weaving-school-landings`, criada no GitHub a partir de `45ebfbbba3dd99fa64d62e6b5047901535568ef7`.

O laboratório local herda rascunhos não publicados das issues 12–14. Sua integração ao capítulo horizontal continua como prévia local; o commit desta issue contém apenas a nova escola, coleção e ferramentas específicas. Nenhum deploy, migração ou operação de VPS.
