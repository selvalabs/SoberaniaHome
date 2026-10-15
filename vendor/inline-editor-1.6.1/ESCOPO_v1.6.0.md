# Escopo aprovado — Inline Editor Pack 1.6.0

**Base:** 1.5.4. **Uso:** interno. **Natureza:** acabamento incremental da experiência existente.

## Recorte

Manter a arquitetura de injeção de fragmentos, o integrador atual e os motores homologados. Não antecipar a etapa GPT/backend.

## Entregas

1. Cabeçalho `? © − ×`, com botão Sobre discreto, tooltips e nomes acessíveis.
2. Sobre: produto, versão, copyright, uso interno, execução local e remoção da camada editorial no Clean Build. Sem watermark ou atribuição jurídica inventada.
3. Central de Ajuda navegável com oito categorias, busca local, explicação de comentários/LLM, salvar versus publicar, atalhos, limites e contexto de seleção quando já disponível.
4. Clareza de ações: Finalizar passa a Fechar edição; Salvar HTML passa a Salvar editável; expor Exportar final usando o serializer existente, sem criar outra limpeza.
5. Modais com Escape, foco inicial, retorno de foco, navegação por teclado, scroll interno e revisão mobile/desktop.
6. Versão e documentos coerentes, correção do changelog, aviso de copyright, testes de regressão, novas evidências e manifesto SHA-256.

## Decisões da execução

- VERSION.json já existia: seu campo version é reutilizado no build, sem novo sistema de metadata.
- Exportar final reutiliza Serializer.html({clean:true}) e o mesmo caminho de gravação/download; não marca o editável como salvo, pois o final não guarda comentários e tarefas.
- Fechar edição mantém o comportamento anterior de fechar a toolbox com confirmação se houver alterações pendentes.
- A identidade jurídica do titular não foi fornecida. COPYRIGHT.md registra esse ponto, e a UI identifica apenas o produto.
- Não há novo diagnóstico, telemetria, serviço ou dependência remota.

## Preservado

GeometryController, seleção, texto e Range, Box Model, tabelas, mídia, efeitos, duplicação, comentários, anchors, llm_task, authored runtime, namespaces de armazenamento, formato de documentos e dependências do runtime. Mudanças mínimas no serializer limitam-se ao modal adicional e à opção final no mesmo caminho de salvamento.

## Fora de escopo

Backend, API, GPT customizado, upload remoto, autenticação, contas, banco, CLI nova, clean.mjs, inspect.mjs, validate.mjs, Core headless, automação JSON, arquitetura de armazenamento, temas novos, compressão/limites de mídia, Smart Clean Build, DRM, watermark, licenciamento online e novos motores de edição.

## Aceite

Regressão herdada completa, testes da nova UI, persistência editável, exportação sem UI/branding editorial, preservação do conteúdo e do suporte authored, responsividade dos modais, logs e hashes válidos. A homologação deve declarar quais navegadores, documentos e dispositivos foram realmente ensaiados.
