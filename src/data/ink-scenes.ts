export type InkStage = { title: string; copy: string; start: number; end: number };
export type InkScene = {
  id: 'tempo' | 'saberes' | 'autonomia'; version: number; seed: number;
  title: string; deck: string; closing: string; stages: readonly InkStage[];
};

export const inkScenes: readonly InkScene[] = [
  {
    id: 'tempo', version: 1, seed: 1914,
    title: 'Quem ganha com o tempo que a tecnologia poupa?',
    deck: 'Uma bancada, um relógio e uma decisão sobre o destino dos ganhos.',
    closing: 'Mais automação. Mais autonomia para quem trabalha.',
    stages: [
      { title: 'A rotina', copy: 'Trabalhar exige tempo e esforço.', start: 0, end: .18 },
      { title: 'A automação', copy: 'O mesmo trabalho. Em menos tempo.', start: .18, end: .38 },
      { title: 'A contradição', copy: 'A produção cresce. O benefício nem sempre chega a quem trabalha.', start: .38, end: .60 },
      { title: 'A decisão', copy: 'Quem decide o destino desse ganho?', start: .60, end: .78 },
      { title: 'A proposta', copy: 'Menos desgaste. Mais tempo disponível. Mais autonomia.', start: .78, end: 1 },
    ],
  },
  {
    id: 'saberes', version: 1, seed: 1967,
    title: 'Um projeto começa quando os saberes se encontram.',
    deck: 'Pesquisa, ofício e vida cotidiana participam da mesma construção.',
    closing: 'Quem vive o problema participa da construção.',
    stages: [
      { title: 'Conhecer', copy: 'A pesquisa abre caminhos. O trabalho conhece os detalhes. A vida cotidiana revela o contexto.', start: 0, end: .32 },
      { title: 'Conversar', copy: 'Os fios se encontram: cada saber muda o que estamos construindo.', start: .32, end: .66 },
      { title: 'Construir junto', copy: 'Uma solução ganha forma com a participação de quem vai usá-la.', start: .66, end: 1 },
    ],
  },
  {
    id: 'autonomia', version: 1, seed: 1988,
    title: 'Entregar também é abrir caminhos.',
    deck: 'Uma ferramenta continua viva nas mãos de quem a recebe.',
    closing: 'Compreender. Ajustar. Continuar.',
    stages: [
      { title: 'Compreender', copy: 'Código, documentação e conhecimento acompanham a ferramenta.', start: 0, end: .32 },
      { title: 'Ajustar', copy: 'Quem recebe pode abrir, experimentar e adaptar ao próprio trabalho.', start: .32, end: .66 },
      { title: 'Continuar', copy: 'A entrega cria condições para cuidar, integrar e seguir construindo.', start: .66, end: 1 },
    ],
  },
];
