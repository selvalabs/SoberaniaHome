# Ateliê: integração opcional com Workers AI

## Estado desta entrega

O Worker está implementado e testado localmente com bindings simulados. **Não houve deploy, chamada a modelo pago, instalação do Wrangler, criação de recursos ou acesso a credenciais.** A experiência normal do site continua local. `edge/wrangler.example.jsonc` é um modelo de configuração deliberadamente incompleto, não uma configuração de produção.

O nome exclusivo previsto é `soberania-labs-atelier-preview`. Não reutilizar configuração, token, namespace, domínio, Worker ou ambiente de outro produto. Credenciais de DNS não demonstram permissão de Workers e não devem ser reaproveitadas por suposição.

## Duas decisões independentes

1. A build do frontend só consulta a capacidade da integração quando `PUBLIC_EDGE_AI=true`. Sem essa configuração, a experiência não faz chamadas a `/api/atelier`.
2. O Worker só permite inferência com `ENABLE_AI="true"`, binding `AI` e binding `ATELIER_RATE_LIMITER` disponíveis. Se qualquer pré-condição faltar, a geração permanece fechada.

Mesmo quando habilitado, carregar a página não envia o contexto ao modelo. O botão explícito **Explorar com IA** informa o envio à Cloudflare; só o seu acionamento faz o `POST`. A resposta é uma hipótese de trabalho para revisão humana, não diagnóstico, orçamento ou promessa de entrega. Usar contexto fictício ou não sensível na avaliação.

## Contrato HTTP

O frontend e o endpoint precisam estar na **mesma origem**. Não há CORS aberto nem endpoint cross-origin configurável pelo usuário.

`GET /api/atelier`:

```json
{"enabled":false,"mode":"demo"}
```

Quando a configuração e os bindings estão presentes, retorna `{"enabled":true,"mode":"edge"}`. Esse resultado confirma configuração local, não disponibilidade instantânea do modelo ou saldo de uso.

`POST /api/atelier`, `Content-Type: application/json`:

```json
{"context":"Queremos organizar uma feira comunitária.","sector":"cooperativa"}
```

Setores: `cooperativa`, `comunidade`, `educacao`, `cultura`. O contexto tem de 1 a 1800 caracteres UTF-16, compatível com o `maxlength` do campo no navegador. O corpo completo é limitado a 12.000 bytes e deve conter somente `context` e `sector`.

Resposta de sucesso:

```json
{
  "mode":"edge",
  "proposal":{
    "title":"Uma hipótese para a feira",
    "summary":"Uma possibilidade a validar em conjunto.",
    "steps":[
      {"title":"Escutar","detail":"Mapear a rotina com as pessoas."},
      {"title":"Experimentar","detail":"Testar um registro pequeno."},
      {"title":"Revisar","detail":"Decidir o próximo passo em conjunto."}
    ],
    "data":["Produtos e quantidades"],
    "human":["Prioridades e aprovação do teste"],
    "next":"Convidar as pessoas para uma primeira conversa."
  }
}
```

Falhas retornam `{"error":{"code":"CÓDIGO","message":"Mensagem pública"}}`, sem detalhe do provedor, prompt ou segredo. O frontend deve preservar o texto digitado, informar a falha e oferecer o modo local; não deve tentar novamente automaticamente nem apresentar uma resposta local como se tivesse vindo da IA.

| Situação | HTTP | Código |
| --- | --- | --- |
| IA desativada | 503 | `AI_DISABLED` |
| Binding ausente | 503 | `AI_UNAVAILABLE` |
| Origem recusada | 403 | `ORIGIN_DENIED` |
| Método não permitido | 405 | `METHOD_NOT_ALLOWED` |
| Corpo inválido / setor inválido | 400 | `INVALID_JSON` / `INVALID_INPUT` |
| Corpo grande | 413 | `BODY_TOO_LARGE` |
| Tipo incorreto / compressão | 415 | `JSON_REQUIRED` |
| Limite atingido | 429 | `RATE_LIMITED`, `Retry-After: 60` |
| Limiter indisponível | 503 | `RATE_LIMIT_UNAVAILABLE` |
| Modelo indisponível | 502 | `AI_FAILED` |
| Resposta fora do contrato | 502 | `INVALID_MODEL_RESPONSE` |
| Tempo de inferência excedido | 504 | `AI_TIMEOUT` |

Todas as respostas da API usam `no-store`, `nosniff`, restrição de recurso à mesma origem e `X-Robots-Tag: noindex, nofollow`. Query strings não são aceitas na API. Outras rotas `/api/` recebem 404; o restante é servido pelo binding `ASSETS`.

## Modelo, limites e processamento

O modelo fixado no código é `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, disponível na documentação consultada em 17/10/2026 com suporte a JSON Mode. A chamada usa `env.AI.run()`, mensagens separadas de sistema/usuário, schema fechado, resposta não streaming e no máximo 1100 tokens de saída. Modelo e ferramentas não são controláveis pelo pedido HTTP. Não há `fetch` de URLs arbitrárias, execução de código, navegação, tool calling, memória de conversa ou acesso aos projetos do usuário.

A resposta do modelo é tratada como entrada não confiável: schema, propriedades exatas, contagem de itens, tamanhos e texto simples são verificados novamente no Worker. Saídas em cercas Markdown, tags HTML, controles de direção invisíveis e pedidos de ferramentas são recusados. O cliente ainda precisa usar `textContent`, como nesta edição; não interpretar a resposta como HTML.

Há 5 segundos para receber o corpo, 1,5 segundo para o limiter e 18 segundos para a resposta do modelo. Não há retentativa automática. O timeout limita o tempo da resposta HTTP; o binding não fornece aqui uma confirmação de cancelamento da inferência, portanto uma requisição que expirou ainda pode consumir recursos no provedor.

O limiter é obrigatório e falha fechado. A proposta inicial permite **seis chamadas por minuto por localidade Cloudflare**, compartilhadas pelo endpoint. A chave é fixa por rota: nenhum IP ou identificador de rastreamento é guardado para esse controle. Essa decisão pode limitar visitantes legítimos em uma mesma localidade. O mecanismo da Cloudflare é eventualmente consistente e não constitui um teto financeiro global. Antes de habilitar publicamente, revisar orçamento, alcance da prévia, controles de abuso e cotas da conta.

## Privacidade

O Worker não grava prompts nem respostas em logs, KV, R2, banco, cache ou telemetria de aplicação. O template desativa observability. Nenhum token vai para o navegador; a chamada usa o binding do Worker. O modo local não envia contexto.

No modo externo, a Cloudflare processa entrada e saída conforme seus próprios termos. Sua documentação distingue o conteúdo da inferência de metadados operacionais e das exceções previstas. Não comunicar “nenhum dado sai do navegador” ou “nenhum registro existe no provedor” quando o modo externo estiver ativo. Logs de plataforma, gateway ou integrações futuras precisam de revisão própria; não habilitar captura de corpos ou de prompts por conveniência.

## Preparação para conexão futura

Após revisão do PR, homologação, identificação do SHA/tag aprovado e autorização da implantação:

1. Selecionar uma conta Cloudflare destinada à prévia. Confirmar identidade, custos, termos do modelo e permissões do operador sem imprimir tokens.
2. Preparar credenciais de implantação exclusivas, com escopo mínimo de Workers/Workers AI aplicável à conta. Guardar `CLOUDFLARE_API_TOKEN` somente em secret de CI ou ambiente controlado; não em variáveis `PUBLIC_*`, arquivos servidos ou argumentos que apareçam em logs. O runtime com binding não precisa de uma chave de modelo no cliente.
3. Copiar o template para uma configuração específica e revisar o nome `soberania-labs-atelier-preview`. Preencher o diretório da build imutável aprovada. O template aponta intencionalmente para um diretório inexistente até essa escolha.
4. Escolher um `namespace_id` positivo e exclusivo dentro da conta para `ATELIER_RATE_LIMITER`. O placeholder inválido impede que uma configuração copiada sem revisão use o namespace de outro produto. O limite proposto é 6/60 segundos.
5. Confirmar destino/domínio próprio de teste. `workers_dev` e `preview_urls` estão desativados no template; não existe route pronta para modificar um site público por acidente.
6. Fazer uma build nova com `PUBLIC_EDGE_AI=true`, mantendo `PUBLIC_INDEXABLE=false` na prévia, e conectar `ASSETS` ao artefato. A configuração `run_worker_first: ["/api/*"]` garante que a API chegue ao Worker.
7. Habilitar `ENABLE_AI="true"` somente com bindings e orçamento revisados. Verificar status, geração com contexto fictício, origem recusada, limite, ausência de logs de conteúdo e retorno ao modo local quando desativado.

Esta preparação não autoriza executar deploy. Usar uma versão homologada de Wrangler compatível com os bindings atuais; nenhuma dependência foi adicionada por este módulo. A autorização de publicação, o SHA/tag, o resultado de verificação e a versão anterior para rollback devem constar do registro da implantação.

## Verificação local e CI

Sem rede, credenciais ou instalação adicional:

```text
node --test tests/edge-atelier.test.mjs
```

Os testes usam as APIs web de Node e bindings simulados. Cobrem desativação, origem, métodos, tamanho de stream, JSON, setores, parâmetros extras, conteúdo malicioso, limiter ausente/falhando, timeout, erros do modelo, parsing estrito e passthrough de assets. Eles não comprovam permissões, faturamento, quota, compatibilidade de uma conta ou uma inferência real. Essas verificações pertencem ao preflight e à homologação do ambiente após autorização.

## Referências primárias

- [Cloudflare: Workers AI bindings](https://developers.cloudflare.com/workers-ai/configuration/bindings/)
- [Cloudflare: modelo Llama 3.3 70B FP8 Fast](https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/)
- [Cloudflare: JSON Mode](https://developers.cloudflare.com/workers-ai/features/json-mode/)
- [Cloudflare: Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Cloudflare: Static Assets binding](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Cloudflare: uso de dados no Workers AI](https://developers.cloudflare.com/workers-ai/platform/data-usage/)

Consultadas em 17 de outubro de 2026. Não há integração com serviços de email, caixas postais ou credenciais DNS.
