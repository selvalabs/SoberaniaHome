# Inline Editor — demonstração local

Fonte: pacote `INLINE_EDITOR_PACK_v1.6.1(2).zip` anexado à conversa **Integrar editor inline**, no projeto ChatGPT **Web-Design-Editor**. Os fragmentos canônicos foram conferidos contra o manifesto SHA256 do pacote. Não foram recriados os motores ou a toolbox.

`editor-original.html` é o documento de demonstração do Soberania Labs. `editor-editavel.html` contém esse documento e os fragmentos compilados do pacote, incluindo a imagem em Data URI. O exemplo funciona sem depender dos assets, scripts ou servidor da landing.

Para atualizar a integração a partir do original:

```powershell
node vendor/inline-editor-1.6.1/tools/integrate.mjs demos/editor-original.html demos/editor-editavel.html
```

A dobra abre o documento em um diálogo com iframe próprio, preservando as animações da landing. A opção **Abrir em outra aba** permite trabalhar diretamente no documento. **Salvar editável** conserva editor e comentários; **Exportar final** remove a camada editorial. Os downloads geram novas cópias: não sobrescrevem o código do site nem publicam alterações.

Validação da integração: `tests/test_inline_package.py`, com downloads reais e reabertura das cópias em Chromium emulado a 1366, 390 e 320 px. A regressão do pacote usa sua fixture histórica; ela é distinta do documento de demonstração. Não há homologação em Safari, Firefox ou aparelho físico.

Trabalho local da [issue 13](https://github.com/selvalabs/SoberaniaHome/issues/13), branch `feat/13-inline-editor-demo`, base e HEAD `45ebfbbba3dd99fa64d62e6b5047901535568ef7`. Os ajustes locais anteriores foram preservados em `local-development-12` e carregados para esta prévia. Sem commit, PR, merge, tag, publicação ou sincronização de VPS nesta tarefa. A release publicada continua sendo `v0.1.3`.
