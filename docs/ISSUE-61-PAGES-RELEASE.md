# Issue #61 — publicação da edição completa

Issue: https://github.com/selvalabs/SoberaniaHome/issues/61.
Branch: `fix/61-pages-current-edition`.
Base main: `77cbc76c632c95281d7cc2cc2e65af4f5362c061`.
Conteúdo aprovado incorporado por fast-forward: `d921d3c7cec6da09b95279dd42f52f93e917de87`, PR #60 e sequência #46–#58. O experimento rejeitado do PR #44 não integra essa sequência.

## Destino e autorização

O usuário autorizou nesta conversa o merge e a publicação da versão atual em https://selvalabs.github.io/SoberaniaHome/. Ambiente GitHub Pages existente, público, HTTPS, sem domínio customizado; política permite dispatch somente da main. É uma aplicação estática: sem banco, migração, configuração secreta de aplicação ou VPS. IA externa permanece desligada; a Mesa de possibilidades oferece seus roteiros locais e exportação.

## Adaptação

`PUBLIC_BASE_PATH` configura a base do Astro e das URLs SEO/GEO. A origem continua validada separadamente. O empacotador cria uma pasta nova exclusivamente a partir da build pública, adaptando URLs locais em HTML, CSS, JS, JSON e SVG, incluindo dados e previews legados. Preserva URLs externas e relativas, não altera fontes e recusa saída existente/symlinks. `.nojekyll` e `release.json` identificam a edição completa, SHA, tag, destino, prefixo e IA desligada. O artefato tem aproximadamente 82 MB, abaixo do limite de tamanho do Pages.

O workflow Pages passa a construir, auditar, testar e publicar a edição Astro. Exige tag anotada, commit pertencente à main, checkout limpo e dispatch a partir da main. O formato anterior continua reconhecido para um rollback pela tag v0.1.3. A CI também testa uma build pública sob o prefixo real, além da prévia na raiz. O servidor de testes usa loopback, porta efêmera, fila de 128 e encerramento ao concluir. Corrigido o teste antigo que procurava a etiqueta fixa dentro da hero.

## Validação e limites

Tipos, 44 testes Node, auditorias npm/Python e validação estática do artefato aprovados localmente. As 16 suítes de navegador na raiz e as quatro suítes do pacote Pages passaram. O novo teste público cobre recursos sem escapes/404, 16 dobras, copy, canônicos, duas galerias, celulares, demos do editor/WhatsApp, exportação local, temas, leitura, FAQ e conteúdo sem JS. Os resultados da CI e SHAs imutáveis são registrados no PR antes do merge. O primeiro teste identificou a base do carregador Vite ainda na raiz; configurar a base do Astro resolveu o carregamento da animação. Safari/iOS físico não foi testado.

## Release e rollback

Versão pretendida: tag anotada `v0.2.0`, criada somente após merge e apontando para o SHA exato retornado pelo GitHub. Antes do dispatch, verificar CI aprovada, tag remota, árvore limpa, destino/ambiente, inventário do artefato, auditorias, recursos e versão anterior. Após publicação, ler `release.json`, conferir SHA/tag, HTTP/recursos, FAQ e comportamento em navegador desktop/mobile. O PR e o relatório final registram o SHA e o workflow de deployment.

Versão anterior verificada no Pages: `v0.1.3`, SHA `45ebfbbba3dd99fa64d62e6b5047901535568ef7`, quatro dobras, under-construction. A tag anotada está preservada no GitHub. Recuperação, mediante autorização de rollback: disparar `pages.yml` na main com `release_tag=v0.1.3`; o workflow usa os scripts antigos daquela tag. Não substituir nem mover tags. Main anterior à integração preservada no histórico e registrada acima.

Sem operação de VPS, Docker ou sincronização de mirror: o destino autorizado é GitHub Pages. O servidor de desenvolvimento na porta 4198 é independente da publicação. Nenhuma remoção ou encerramento de processo existente faz parte desta tarefa.
