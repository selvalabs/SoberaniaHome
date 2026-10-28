# Preparação da release v0.3.0 — issue #79

Solicitação: usuário autorizou soltar a release da versão atual. Destino: GitHub Pages, https://selvalabs.github.io/SoberaniaHome/, ambiente github-pages, workflow pages.yml via dispatch a partir da main, tag anotada e SHA imutável. Sem domínio customizado, banco, migração, serviços de IA externa ou VPS.

Base aprovada: 6fc8dc103932b23d2af9ccca87f871ef5acc5853. A preparação altera somente expectativas de teste para a ordem aprovada da galeria (ELARA, Soberania, Desafio, demais), com nove páginas. O teste antigo causou falha da CI da main. Produto visual permanece igual à versão homologada na PR #78.

Preflight inicial: diretório limpo; Pages configurado em modo workflow. Versão pública lida em release.json: v0.2.1, SHA 057cf68630c899401cad6284833eb53b67b86a82. Rollback preservado nessa tag, via dispatch pages.yml com release_tag=v0.2.1. Nenhuma tag será reescrita. npm audit passou com zero vulnerabilidades. Espaço local disponível 1.46GB antes da preparação; evitar builds redundantes e não remover arquivos.

Validação local: test_site_edition.py passou desktop, reduced motion em 320x680/390x844/768x1024 e sem JavaScript. A CI completa precisa passar antes da release. Workflow público repete auditoria npm/Python, tipos, testes, build e testes comportamentais no prefixo /SoberaniaHome/ antes de publicar.

Sequência: PR de preparação com checks aprovados; merge GitHub autorizado como parte desta preparação, preservando branch; fetch e fast-forward da main ao SHA do merge; criar/push tag anotada v0.3.0 nesse SHA; verificar tag remota; criar release com notas; dispatch manual Pages com a tag; conferir job, release.json, versão/SHA, HTTP, recursos e navegação em desktop/mobile. Retorno por tag anterior mediante autorização caso a verificação não corresponda. Não repetir publicação ou rollback automaticamente após anomalia.

Estado: preparação. Registro final de SHA/tag/workflow e resultado será anexado à release/issue. Sem publicação nesta branch.
