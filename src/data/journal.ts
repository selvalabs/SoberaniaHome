import { principles, examples } from './manifesto';
export interface JournalArticle {
  slug:string; category:string; title:string; deck:string;
  sections:{heading?:string;paragraphs:string[]}[];
  sources?:{label:string;url:string}[];
}
const notes = [
  {
    id:'ia-sem-magia', category:'IA / operação', title:'IA sem magia.', deck:'Um agente útil precisa de contexto, limites e uma forma de conferir o que fez.',
    paragraphs:[
      'Quando um agente participa de uma operação, há mais do que uma resposta na tela. Existem instruções, ferramentas, permissões e dados. Tornar essas relações visíveis ajuda a entender onde a automação pode contribuir e onde a decisão precisa continuar com uma pessoa.',
      'No nosso modo de projetar, começamos por uma tarefa delimitada: qual é a entrada, o que pode ser alterado e como verificar a saída. Uma proposta, uma execução e uma aprovação são momentos diferentes. Registrar essa diferença permite investigar falhas e melhorar o processo.',
      'O critério não é parecer inteligente. É produzir algo útil, verificável e compatível com as condições de quem trabalha.'
    ],
    closing:'Pergunta de projeto: como saberemos se a tarefa foi bem feita?'
  },
  {
    id:'internet-tem-chao', category:'Infraestrutura / ecologia', title:'A internet tem chão.', deck:'O que chamamos de nuvem também depende de lugares, recursos e trabalho.',
    paragraphs:[
      'Uma interface leve pode esconder uma operação complexa. Aplicações dependem de computadores, redes, armazenamento, energia e de pessoas que cuidam dessa infraestrutura. Quando o projeto ignora essas dependências, também deixa de enxergar parte do seu custo e da sua continuidade.',
      'Isso muda nossas perguntas: precisamos processar tudo de novo? É necessário manter esta tarefa em execução? O equipamento disponível atende ao uso? Uma ferramenta menor, bem documentada e adequada ao contexto pode ser uma escolha melhor do que uma arquitetura que exige mais capacidade de manutenção.',
      'Ecologia entra no projeto quando recursos, duração e cuidado passam a fazer parte da decisão técnica.'
    ],
    closing:'Pergunta de projeto: o que sustenta esta tela quando ninguém está olhando?'
  },
  {
    id:'ferramenta-que-deixa-sair', category:'Ferramentas / autonomia', title:'Uma ferramenta que deixa sair.', deck:'Conseguir mudar de ferramenta começa muito antes de uma migração.',
    paragraphs:[
      'Um sistema organiza trabalho, mas também estabelece dependências. Com o tempo, ele guarda memória: documentos, relações, configurações e decisões. Saber como levar essa memória para outro lugar é parte da autonomia de quem o utiliza.',
      'Uma exportação isolada não resolve tudo. É preciso entender o significado dos campos, preservar relações importantes e verificar o que foi transferido. Por isso, formatos compreensíveis, documentação e testes de recuperação merecem espaço no planejamento.',
      'A possibilidade de saída também melhora a permanência: continuar usando uma ferramenta pode ser uma escolha consciente, sustentada por utilidade e confiança.'
    ],
    closing:'Pergunta de projeto: o que acontece se a ferramenta precisar mudar?'
  },
  {
    id:'documentar-e-compartilhar', category:'Conhecimento / manutenção', title:'Documentar é compartilhar poder.', deck:'A próxima pessoa precisa de um caminho, não de um enigma.',
    paragraphs:[
      'Código explica uma parte do funcionamento. Nem sempre explica por que uma decisão foi tomada, qual restrição existia ou como recuperar a operação quando algo falha. Esse contexto também precisa ser transmitido.',
      'Uma documentação útil começa pelas perguntas de quem vai usar: como entrar, onde ficam os dados, como fazer uma alteração e como voltar a um estado conhecido. Exemplos pequenos e verificáveis ajudam mais do que uma descrição grandiosa que envelhece sem manutenção.',
      'Documentar distribui capacidade. Permite que o conhecimento atravesse uma troca de equipe, uma mudança de fornecedor ou um período em que a pessoa que construiu o sistema não está disponível.'
    ],
    closing:'Pergunta de projeto: alguém consegue continuar o trabalho sem depender de uma única pessoa?'
  },
  {
    id:'cultivar-ferramentas', category:'Território / método', title:'Cultivar ferramentas.', deck:'Escutar o contexto ajuda a decidir o que vale a pena construir.',
    paragraphs:[
      'Cultivar é uma imagem que nos ajuda a pensar no desenvolvimento: observar condições, preparar o terreno, acompanhar o uso e ajustar o cuidado. Aqui, a comparação é um método de atenção, não uma receita que torna todos os problemas iguais.',
      'Quem vive uma rotina conhece exceções, acordos e improvisos que uma especificação inicial pode não registrar. Conversar com essas pessoas ajuda a separar uma dificuldade real de uma solução escolhida cedo demais.',
      'O protótipo retorna ao contexto. Pode revelar que uma interface precisa mudar, que um processo deve ser mais simples ou que uma tecnologia não é necessária. Continuar atento faz parte da construção.'
    ],
    closing:'Pergunta de projeto: quem conhece os detalhes que ainda não conseguimos ver?'
  },
  {
    id:'quem-controla-o-botao', category:'Automação / responsabilidade', title:'Quem controla o botão?', deck:'Delegar uma tarefa também exige desenhar seus limites.',
    paragraphs:[
      'Uma automação pode sugerir, preparar ou executar uma ação. Essas capacidades não precisam ter a mesma permissão. Identificar consequências, responsáveis e pontos de revisão ajuda a decidir o nível de autonomia adequado a cada tarefa.',
      'Em fluxos com agentes, procuramos distinguir leitura, proposta e mudança. Ações que afetam pessoas, dados ou serviços precisam de critérios claros de autorização e verificação. A possibilidade de interromper e investigar a execução faz parte do desenho.',
      'Controle humano não é apenas um botão de confirmação. É ter informação suficiente para avaliar, condições para recusar e um caminho para corrigir.'
    ],
    closing:'Pergunta de projeto: quem pode entender, interromper e revisar esta ação?'
  }
];
export const journalArticles:JournalArticle[] = [
  ...notes.map(note=>({slug:note.id,category:note.category,title:note.title,deck:note.deck,
    sections:[{paragraphs:[...note.paragraphs,note.closing]}]})),
  ...[
  {
    "slug": "tempo-de-quem-trabalha",
    "category": "Trabalho / automação",
    "title": "Quem recebe o tempo que a tecnologia poupa?",
    "deck": "Jornada, salário e o destino dos ganhos de produtividade.",
    "sections": [
      {
        "heading": "Automatizar para viver melhor",
        "paragraphs": [
          "Automatizar tarefas pode reduzir o trabalho repetitivo e o esforço. Para nós, esse ganho deve melhorar a vida de quem sustenta a operação.",
          "Mais produtividade. Quem recebe os benefícios?",
          "Queremos que o ganho vire tempo disponível , menos desgaste e melhores condições de trabalho.",
          "Automatizar para viver melhor."
        ]
      },
      {
        "heading": "Uma referência histórica",
        "paragraphs": [
          "O mesmo trabalho, em ¼ do tempo. E a jornada de trabalho? E o salário? Não acompanham...",
          "Paráfrase de V. I. Lenin, 1914, a partir de O sistema Taylor — a escravização do homem pela máquina. A ilustração da landing questiona a distribuição dos ganhos; não apresenta uma medição de desempenho dos nossos produtos."
        ]
      }
    ],
    "sources": [
      {
        "label": "V. I. Lenin — O sistema Taylor — a escravização do homem pela máquina, 1914",
        "url": "https://www.marxists.org/archive/lenin/works/1914/mar/13.htm"
      }
    ]
  },
  {
    "slug": "meios-digitais-poder-popular",
    "category": "Comunicação / poder popular",
    "title": "O mundo digital também é território de luta.",
    "deck": "Por que disputar as redes e construir meios próprios faz parte da organização popular.",
    "sections": [
      {
        "heading": "O que produzimos",
        "paragraphs": [
          "Nosso campo produz trabalho, informação e cultura. Sites e redes ampliam o alcance das nossas iniciativas. Quando ficamos de fora, perdemos espaço para comunicar, sustentar projetos e organizar ações coletivas."
        ]
      },
      {
        "heading": "O que é capturado",
        "paragraphs": [
          "As grandes plataformas transformam nossos dados e nossa atenção em receita. Seus interesses comerciais e financeiros condicionam o que circula. Quando nossa comunicação e nossos processos dependem delas, nossa organização fica vulnerável."
        ]
      },
      {
        "heading": "O que precisamos construir",
        "paragraphs": [
          "Precisamos disputar as redes e construir nossos próprios meios: sites, sistemas, infraestrutura e conhecimento. Ou o campo popular se apropria dos meios digitais, ou perderemos batalhas que precisamos vencer. É parte da luta contra o capitalismo selvagem."
        ]
      },
      {
        "heading": "Uma resposta em construção",
        "paragraphs": [
          "Um site que o coletivo pode atualizar. Informações organizadas e exportáveis. Ferramentas que conversam. Pessoas preparadas para operar, adaptar e manter esses meios."
        ]
      }
    ],
    "sources": [
      {
        "label": "Uso de dados — FTC, 2024",
        "url": "https://www.ftc.gov/reports/look-behind-screens-examining-data-practices-social-media-video-streaming-services"
      },
      {
        "label": "Práticas de manipulação — FTC, 2022",
        "url": "https://www.ftc.gov/reports/bringing-dark-patterns-light"
      }
    ]
  },
  {
    "slug": "manifesto",
    "category": "Manifesto / princípios",
    "title": "Tecnologia a serviço de quem?",
    "deck": "Os princípios e as consequências que orientam nossas escolhas.",
    "sections": [
      {
        "heading": "Tecnologia a serviço da humanidade",
        "paragraphs": [
          "A Soberania Labs cria sites, software e automações para quem trabalha, produz e se organiza.",
          "Quem trabalha deve ter poder sobre a tecnologia que usa. Ferramentas e conhecimento precisam estar ao alcance das pessoas para que possam decidir e transformar a própria realidade.",
          "Construímos presença digital para cooperativas, comunidades e negócios sociais. Desenvolvemos no Brasil sistemas e infraestrutura para organizar rotinas e conectar ferramentas."
        ]
      }
    ],
    "sources": []
  }
]
];
export {principles,examples};
export const articlePath=(slug:string)=>`/caderno/${slug}/`;
