# Escopo — Inline Editor Pack v1.5.4

## Objetivo
Reintroduzir duplicação estrutural de elementos e adicionar comentários de autoria com dois tipos: Nota e Ajuste para LLM, preservando integralmente texto por Range, Box Model, mobilidade, efeitos, multiseleção e serializer da v1.5.3.

## Duplicar
- Mais → Elemento → Duplicar.
- Apenas seleção única.
- Clona conteúdo, estilos e efeitos.
- IDs do clone e descendentes são regenerados; referências internas são remapeadas.
- Metadados transitórios, histórico e comentários não são copiados.
- Elementos absolute/fixed recebem deslocamento visual de 16px para a cópia ficar perceptível.
- Undo/redo estrutural atômico.

## Comentários
- Mais → Comentários.
- Nota: contexto informativo; não solicita alteração.
- Ajuste para LLM: instrução explícita de modificação do elemento marcado.
- Comentários são associados por `data-ie-comment-anchor` e persistidos em `data-ie-comments`.
- Se houver Range textual, a frase selecionada é armazenada como referência.
- Ajustes para LLM possuem status aberto/resolvido.
- HTML editável salvo materializa `#ie-comments-data` com protocolo machine-readable.
- Clean Build remove comentários, protocolo e anchors.
- Reset visual não remove comentários.

## Protocolo LLM
No handoff do HTML editável, registros `llm_task` com `status=open` são pedidos explícitos do usuário e devem ser aplicados ao elemento com anchor correspondente. Registros `note` são apenas contexto e não devem gerar mudança por si só.
