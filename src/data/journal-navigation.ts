/** Each long-form reading reconnects to the scene it develops on the landing page. */
const articleScenes: Record<string, { anchor: string; label: string }> = {
  'ia-sem-magia': { anchor: 'possibilidades', label: 'IA na prática' },
  'internet-tem-chao': { anchor: 'espiral', label: 'Nada existe isolado' },
  'ferramenta-que-deixa-sair': { anchor: 'editor', label: 'Autonomia na entrega' },
  'documentar-e-compartilhar': { anchor: 'editor', label: 'Autonomia na entrega' },
  'cultivar-ferramentas': { anchor: 'processo', label: 'O processo' },
  'quem-controla-o-botao': { anchor: 'possibilidades', label: 'IA na prática' },
  'tempo-de-quem-trabalha': { anchor: 'folha', label: 'Trabalho e tempo' },
  'meios-digitais-poder-popular': { anchor: 'meios-digitais', label: 'Meios digitais' },
  manifesto: { anchor: 'manifesto', label: 'Nossos princípios' },
  'saberes-em-comum': { anchor: 'deslocamento-2', label: 'Saberes em comum' },
  'antes-do-codigo': { anchor: 'processo', label: 'O processo' },
  'ferramentas-em-uso': { anchor: 'trabalho', label: 'Trabalhos do laboratório' },
  'outras-ferramentas': { anchor: 'laboratorio', label: 'Outras ferramentas' },
  'tecnologia-no-trabalho': { anchor: 'deslocamento-1', label: 'Organização coletiva' },
  'capacidade-de-continuar': { anchor: 'editor', label: 'Autonomia na entrega' },
  'construir-no-brasil': { anchor: 'soberania', label: 'Construir no Brasil' },
  'nada-existe-isolado': { anchor: 'espiral', label: 'Nada existe isolado' },
  'laboratorio-com-os-pes-no-mundo': { anchor: 'sobre', label: 'Sobre o laboratório' },
  'mesa-de-possibilidades': { anchor: 'possibilidades', label: 'IA na prática' },
};

export function getJournalScene(slug: string) {
  const scene = articleScenes[slug];
  return scene ? { href: `/#${scene.anchor}`, label: scene.label } : undefined;
}
