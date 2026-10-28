import { generatedHighlights } from './generated-ink-model';

/** Art direction is specific to each composition. Timing, pencil and light stay
 * identical to the approved study; these are not universal object detectors. */
export const landingInkScenes = {
  'network-solution': {
    section: 'meios-digitais', title: 'Meios próprios, capacidade compartilhada.',
    description: 'Gravura-resposta: o mesmo coletivo publica num site, organiza seu acervo e compartilha ferramentas. Conexões laterais aproximam comércio cooperativo, aprendizagem e produção agroecológica. Pessoas aprendem a operar os meios que constroem; a cena representa um caminho em construção.',
    highlights: [
      {name:'own-publication',x:760,y:800,rx:190,ry:140,at:.775},
      {name:'cooperative-work',x:650,y:240,rx:220,ry:150,at:.815},
      {name:'shared-knowledge',x:1240,y:220,rx:220,ry:150,at:.855},
      {name:'territory',x:1230,y:530,rx:220,ry:150,at:.89},
    ],
  },
  network: {
    section: 'meios-digitais', title: 'O mundo digital também é território de luta.',
    description: 'Gravura política e popular: um coletivo trabalha com impressão, comunicação e ferramentas digitais. Perfis e publicações alimentam uma plataforma representada como funil e uma engrenagem financeira. Na mesa, pessoas constroem seu próprio plano de rede. Os fluxos luminosos são uma metáfora editorial de concentração e organização coletiva.',
    highlights: [
      {name:'popular-work',x:240,y:800,rx:230,ry:180,at:.775},
      {name:'collective-plan',x:700,y:865,rx:220,ry:130,at:.815},
      {name:'local-means',x:1030,y:860,rx:190,ry:140,at:.855},
    ],
  },
  workbench: {
    section: 'folha', title: 'A ferramenta amplia. Quem trabalha dá direção.',
    description: 'Desenho editorial gerado: uma mão gira uma chave sobre uma peça presa à morsa; outra mão a sustenta sobre a bancada. A automação amplia possibilidades; a distribuição dos ganhos depende das decisões humanas.',
    highlights: generatedHighlights,
  },
  knowledge: {
    section: 'deslocamento-2', title: 'Saberes diferentes na mesma mesa.',
    description: 'Desenho editorial gerado de uma mesa compartilhada. Um caderno botânico, uma amostra de encaixe de madeira e três gestos de trabalho se encontram em um projeto comum. Um computador fechado ocupa um lugar secundário.',
    highlights: [
      {name:'observation',x:220,y:650,rx:220,ry:160,at:.775},
      {name:'craft',x:1180,y:470,rx:190,ry:150,at:.815},
      {name:'common-plan',x:800,y:640,rx:230,ry:180,at:.855},
    ],
  },
  handover: {
    section: 'editor', title: 'O sistema chega com capacidade de continuar.',
    description: 'Desenho editorial gerado: uma pessoa já opera o computador enquanto outra compartilha o manual. As chaves de acesso e uma unidade de dados acompanham a entrega. A interface desenhada é conceitual.',
    highlights: [
      {name:'access',x:720,y:770,rx:150,ry:150,at:.775},
      {name:'documentation',x:350,y:570,rx:260,ry:180,at:.815},
      {name:'continuity',x:1090,y:580,rx:240,ry:190,at:.855},
    ],
  },
};
