# Soberania Labs — edição experimental

Versão completa para avaliação na issue [#34](https://github.com/selvalabs/SoberaniaHome/issues/34), branch `feat/34-immersive-edition`. A publicação atual e a `main` permanecem independentes. Este código não publica automaticamente no GitHub Pages nem na Cloudflare.

## Executar

Requer Node **22.22+** (validado com 24.13), npm e as dependências fixadas no lockfile. Em um checkout novo:

```powershell
npm ci
npm run dev -- --host 0.0.0.0 --port 4184
```

A implementação é Astro 7 estático, TypeScript e CSS. O movimento usa rolagem nativa e cenas sticky; não há GSAP, vídeo de fundo, canvas contínuo ou serviço externo necessário para visitar a página.

Para uma prévia estática, use sempre uma pasta nova de build:

```powershell
$env:BUILD_DIR='.edition-builds/minha-revisao-01'
npm run build
python -m http.server 4184 --bind 0.0.0.0 --directory .edition-builds/minha-revisao-01
```

O endereço no Wi-Fi usa o IPv4 atual do computador e a porta escolhida. O servidor deve apontar somente para a pasta de build. Não sirva a raiz do repositório nem arquivos de ambiente. Builds anteriores são preservadas; não há comando de limpeza automática neste fluxo.

## O que explorar

- A abertura conecta a árvore a um desenho de circuitos e território.
- Trabalho e laboratório aceitam rolagem, arrasto, toque e teclado. Cada celular mantém sua própria rolagem; a galeria de celulares também aceita movimento horizontal.
- O processo monta seis peças com as explicações ao lado no desktop. No celular, o quadro acompanha a leitura vertical das seis etapas, com texto de 16 px. A cena de conexões reúne headline, órbitas e nove nós selecionáveis.
- Autonomia apresenta acesso, documentação e portabilidade. Soberania permite explorar três caminhos de infraestrutura.
- A mesa de possibilidades produz cenários locais exportáveis; há um endpoint opcional de IA separado, desabilitado por padrão.
- O caça-palavras usa 110 referências, uma lista acessível e uma nova rodada após cinco segundos de tinta. Referência não significa endosso.
- Manifesto com consequências práticas e Caderno com seis notas originais completas.
- Modo de leitura, movimento reduzido, HTML sem JavaScript, FAQ e índice documental para assistentes.

## Validação

```powershell
npm run check
npm test
npm audit --audit-level=low
node scripts/check-static.mjs .edition-builds/minha-revisao-01
python -m pip install -r requirements-pages.txt
python -m playwright install chromium
python tests/test_motion_edition.py --url http://127.0.0.1:4184/
python tests/test_site_edition.py --url http://127.0.0.1:4184/
python tests/test_landing_touch.py --url http://127.0.0.1:4184/
python tests/test_atelier_edge_ui.py --url http://127.0.0.1:4184/
```

O último teste simula a API no navegador. Os testes do Worker simulam os bindings: eles não comprovam inferência real na Cloudflare. A CI valida build, tipos, segurança de dependências, política de indexação e interações principais. Os testes antigos `tests/common.py`/`test_pages_release.py` pertencem à edição anterior e não são o protocolo desta branch.

## IA na borda

[Guia do Worker](docs/EDGE-AI.md): contrato, limites, bindings e configuração para um serviço separado. `PUBLIC_EDGE_AI=true` habilita a consulta de disponibilidade no frontend; `ENABLE_AI=true` habilita o Worker somente se os bindings obrigatórios estiverem disponíveis. A geração exige uma ação explícita e informa o processamento externo.

Não há credencial no repositório. Um token de DNS não é tratado como autorização ou credencial de deploy de Workers. A conexão efetiva, domínio, namespace de limite e quotas devem ser configurados no ambiente aprovado.

## Publicação e descoberta

[Política SEO/GEO](docs/SEO-GEO.md): a prévia é `noindex`; o sitemap fica vazio. Só uma origem HTTPS confirmada com `PUBLIC_SITE_URL` e `PUBLIC_INDEXABLE=true` habilita os metadados de produção. Esta edição usa caminhos a partir da raiz do domínio e precisa de adaptação específica antes de ser publicada em um subdiretório do GitHub Pages.

Produção segue issue → branch → PR → revisão/homologação → merge no GitHub → tag anotada e SHA imutável → preflight → publicação e verificação. Não usar o workflow legado `pages.yml` para publicar esta edição experimental.

## Arquivos e ativos

- `src/components/sections/`: conteúdo em HTML estático.
- `src/styles/edition*.css`: linguagem visual desta revisão; `motion-edition.css` define as cenas.
- `src/scripts/motion.ts`: motor de movimento e acessibilidade; `atelier.ts`: demonstração e integração opcional.
- `edge/`: Worker independente e template de configuração.
- `public/assets/edition/`: imagens WebP otimizadas; originais preservados.
- `public/demos/landing-collection/screens/tiles/`: páginas de celular em trechos carregados conforme a leitura.
- `scripts/optimize-edition-assets.py`: geração reproduzível dos ativos, usando Pillow. A imagem social usa fontes locais Arial/Georgia; `--font-dir` permite indicar os mesmos arquivos em outra máquina.

[Relatório da revisão](docs/EXPERIMENT-34.md) · [Documentação da edição pública anterior](docs/LEGACY-PUBLIC-EDITION.md)
