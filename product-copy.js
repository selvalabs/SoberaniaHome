/* Product descriptions for the local portfolio. Scope and roadmap supplied by the product owner. */
(() => {
  "use strict";
  const descriptions = {
  "analytics": "Uma plataforma para reunir SEO, tracking, conversões e Meta Ads na operação de cada landing page. Fluxos agênticos via MCP conectam ferramentas a um backend soberano, em infraestrutura própria, com proteção e controle dos dados. A integração com o próprio gerador de landing pages e novos serviços estão em desenvolvimento.",
  "circulo": "Uma plataforma de cursos e comunidade inteiramente personalizável conforme o cliente desejar. Conteúdos, jornadas, acessos e operação podem ser controlados por agentes, em fluxos via MCP. Uso gratuito para projetos que se candidatarem e forem aceitos no programa de parceiros.",
  "editor": "Seu site, editável no próprio navegador. O cliente ajusta textos, imagens e composição com autonomia e soberania, depois salva uma cópia editável ou exporta o HTML final. Uma forma de manter a página nas mãos de quem a usa.",
  "monitor": "Nem todo morador é titular da conta ou tem acesso aos cadastros das fornecedoras de água e luz. O Monitor aproxima os avisos de quem vive no endereço: acompanha desligamentos programados da Celesc e envia alertas pelo WhatsApp conforme o endereço cadastrado.",
  "lab_game": "Aprender programação vendo uma ideia acontecer. Missões e blocos ajudam a construir as regras de um jogo, enquanto a cena mostra o efeito de cada escolha. Um laboratório para experimentar, observar e ajustar o próprio código.",
  "lab_foco": "Uma publicação para conhecer candidaturas, trajetórias e suas fontes. A consulta por estado e cargo aproxima cada nome do contexto da eleição, preservando o recorte e as referências de cada edição.",
  "lab_techia": "Um espaço de leitura e investigação sobre tecnologia e inteligência artificial. Textos, glossário e ferramentas de consulta conectam conceitos a novas perguntas. Uma experiência editorial ainda em desenvolvimento.",
  "lab_ciclico": "Uma página que apresenta uma comunidade e seu modo de planejar. A narrativa articula proposta, método e caminhos de participação, dando forma digital ao encontro entre pessoas e organização coletiva."
};
  for (const [key, text] of Object.entries(descriptions)) {
    const paragraph = document.querySelector(`[data-work-gallery="${key}"]`)?.closest("article")?.querySelector(":scope > p");
    if (paragraph) paragraph.textContent = text;
  }
  const landing = document.querySelector(".landing-project > p");
  if (landing) landing.textContent = "Oito propostas para educação, trabalho autoral e comunidade. Cada apresentação explora uma combinação de narrativa, fotografia e interface, com diferentes vistas da página. Estudos de landing pages para mostrar como uma ideia pode ganhar presença na web.";
})();
