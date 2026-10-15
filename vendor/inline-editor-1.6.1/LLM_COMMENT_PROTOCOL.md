# Protocolo de comentários — Inline Editor 1.6.1

Contrato v1 de comentários preservado da 1.5.4; sem mudança de schema ou estados.


## Objetivo
Permitir que um HTML editável carregue contexto humano e tarefas explícitas para um LLM sem alterar o layout visível.

## Onde ler
No HTML editável salvo, procure:

```html
<script type="application/json" id="ie-comments-data" data-ie-authored-comments>
...
</script>
```

Cada alvo possui `data-ie-comment-anchor="..."`.

## Tipos

- `note`: informação/contexto. **Não executar como alteração por si só.**
- `llm_task`: pedido explícito de ajuste. Executar somente quando `status` for `open`.

## Regra para o LLM
1. Leia `instructionsForLLM` do registro global.
2. Para cada `llm_task` aberto, encontre o elemento cujo `data-ie-comment-anchor` é igual ao `target`.
3. Use `text` como instrução do usuário.
4. Se existir `range.quote`, trate-o como referência do trecho específico dentro do alvo.
5. Notas podem informar a decisão, mas não autorizam mudança sozinhas.
6. Tarefas `resolved` não devem ser reaplicadas.
7. Ao devolver outro HTML editável depois de executar uma tarefa, marque-a como resolvida. Em Clean Build, os comentários são removidos.

## Exemplo

```json
{
  "type": "llm_task",
  "status": "open",
  "target": "ieca-abc123",
  "text": "Aumentar o contraste deste card sem trocar a paleta.",
  "range": {"quote": "texto de referência", "start": 10, "end": 28}
}
```


## Exclusão estrutural na v1.6.1

Registros cujo alvo foi excluído, inclusive os de descendentes, não são emitidos no HTML salvo. A exclusão não cria status novo: os registros permanecem somente nos nós retidos pelo Undo da sessão e são recuperados junto deles. O agente deve trabalhar com o registro do arquivo que recebeu, não recuperar tarefas de uma versão anterior ou inferir que um elemento ausente ainda existe. A exclusão não equivale a executar ou resolver uma tarefa aberta.
