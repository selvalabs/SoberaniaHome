import type { APIRoute } from 'astro';
import { publication, publicUrl } from '../lib/seo';

export const GET: APIRoute = () => {
  const text = `# Soberania Labs

> Laboratório independente de tecnologia em Florianópolis, Brasil. Software, automação, infraestrutura digital e pesquisa para ampliar autonomia.

${publication.indexable ? 'Este arquivo resume o conteúdo desta edição do site.' : 'Esta é uma edição experimental para avaliação. As páginas HTML usam noindex; esta edição não anuncia lançamento ou disponibilidade comercial dos projetos.'}

## Sobre o laboratório

- [Apresentação](${publicUrl('/#hero')}): tecnologia a serviço da humanidade, com conhecimento técnico em conversa com a experiência de quem trabalha.
- [Trabalhos](${publicUrl('/#trabalho')}): SoberanIA Analytics, Círculo, Editor HTML e Monitor Comunitário.
- [Laboratório](${publicUrl('/#laboratorio')}): landing pages, publicação, voz e busca em documentos locais.
- [Processo](${publicUrl('/#processo')}): entender, investigar, prototipar, construir, testar e transferir capacidade.
- [Possibilidades](${publicUrl('/#possibilidades')}): quatro roteiros locais preparados, anotação de contexto e exportação; IA externa opcional, explicitamente acionada.
- [Manifesto](${publicUrl('/#manifesto')}): princípios que orientam o trabalho.
- [Perguntas frequentes](${publicUrl('/perguntas/')}): escopo, autonomia, agentes e estágio dos projetos.

## Projetos e limites do que está apresentado

- SoberanIA Analytics: plataforma para reunir SEO, tracking, conversões e Meta Ads na operação de landing pages. Fluxos por MCP conectam ferramentas ao backend. A integração com um gerador de landing pages e outros serviços está em desenvolvimento.
- Círculo: plataforma personalizável de cursos e comunidade. Prevê operação por agentes via MCP. A gratuidade do programa de parceiros depende de candidatura e aprovação.
- Editor HTML: edição de textos, imagens e composição no navegador; salvamento de uma cópia editável ou exportação do HTML.
- Monitor Comunitário: aproxima avisos públicos de desligamentos programados da Celesc de moradores por endereço, com alertas pelo WhatsApp. Não é o canal oficial da concessionária nem um serviço de emergência.
- Universal Voice Engine: perfis de voz, roteiro, prévias e exportação de áudio em fluxo local. [Repositório](https://github.com/selvalabs/universal-voice-engine).
- RAG Local: busca semântica e lexical em documentos locais, com referências às fontes e Ollama opcional. [Repositório](https://github.com/selvalabs/sialabs-local-rag).

As telas identificadas como demonstrativas usam dados de demonstração. Capturas de UVE e RAG Local mostram interfaces reais sem comprovar uma execução de inferência. Os estudos de landing pages não implicam resultados comerciais medidos. O Caderno reúne seis notas editoriais originais sobre princípios de trabalho; não apresenta resultados de pesquisa científica. As referências de leitura não representam endosso dessas pessoas ao laboratório.

A Mesa de possibilidades apresenta um de quatro roteiros preparados no modo local. O texto anotado acompanha o esboço, mas não altera o roteiro e não é interpretado por IA. Uma integração opcional com Cloudflare Workers AI depende de configuração; a interface informa a disponibilidade e só envia texto e campo escolhido ao clicar em “Explorar com IA”. A exportação preserva a origem e o contexto do último resultado, sem incluir edições ainda não incorporadas.

## Leitura e acessibilidade

O conteúdo principal está em português brasileiro. A navegação oferece modo de leitura e respeita a preferência por movimento reduzido. Este índice é documentação complementar; não substitui o texto visível das páginas.
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
