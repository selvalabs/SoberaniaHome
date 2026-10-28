# Arte da dobra Meios digitais — issue #83

Fonte: `public/assets/ink/network-generated-v1.png` (1536 × 1024).
SHA-256: `9a50f96ad9a7ab6e8c6b7b45a7e4c424c43dd94f0db9bafe23f827c3f5fb74b7`.
Geração: ferramenta integrada image_gen, fundo branco, preto em gravura política e popular.
O primeiro estudo de hardware foi rejeitado pelo usuário e ficou arquivado apenas na pasta local ignorada de exploração; não integra a página.

## Prompt final

Use case: illustration-story. BRAND NEW landscape illustration, 1536 x 1024, pure black ink on clean white. A powerful sophisticated Brazilian popular political engraving, linocut and woodcut inspired, with confident expressive contours, restrained cross-hatching and clear anatomy. NOT a hardware product drawing, NOT an infographic of servers, NOT generic icons.
Subject: the work, culture and communication of ordinary people being captured by concentrated digital platform power, and people organizing their own means. One coherent symbolic composition.
LOWER HALF AND LEFT, the human protagonists: five dignified adult workers and community organizers around a shared wooden table in a Brazilian neighborhood collective print workshop. A woman operates a small printing press, one person writes a community newspaper, two people discuss and draw connections on a large sheet, another uses a phone. Working hands clearly visible and anatomically excellent. Simple everyday clothes, confident active postures, no misery or helpless puppet imagery. A small leafy plant, books, sheets and a modest laptop belong to this working collective. Community-facing sheets being passed from hand to hand. This must be the emotional focus.
UPPER RIGHT, looming over them, ONE oversized smartphone/platform frame, its screen visibly a funnel or grid collecting many small personal profile silhouettes and speech/message sheets. Three flowing thick curved conduits carry the people's communication from lower left toward the phone. Above the phone a compact financial mechanism transforms the collected message/profile sheets into a stream of round coins going toward a small distant bank/corporate facade. Make this extraction visually unmistakable without text, with direction conveyed by the funnel and the trajectory of the shapes.
At the shared table, the two organizers are also drawing their own small lateral network on paper, suggesting capacity and agency, not a solved fantasy. Keep a broad clean WHITE central corridor between the collective below/left and the phone above/right for animated connections to be overlaid in code. Avoid a web of random cables. No huge server racks. No giant hands controlling puppets. No weaponry or violence. No logos or real corporate trademarks. No lettering, labels, numbers, slogans or watermark. The concept must be legible at small scale and have professional editorial printmaking quality. White margins all around; no black background, no grey washes, no colour, no border.

## Construção da animação

O PNG original permanece intacto. `python scripts/trace-ink.py public/assets/ink/network-generated-v1.png src/data/network-traces.json --scene network` extrai 1576 percursos apenas para a máscara: a obra continua raster. O algoritmo ordena contornos vizinhos, com fases próprias para trabalho popular, captura e construção coletiva. A imagem em si não é reproduzível por seed; o arquivo versionado e seu hash fixam a fonte. Percursos, tempos, fluxos, tensão dos cabos e glows são determinísticos.

O mesmo motor de lápis, máscara e iluminação das demais gravuras recebe o progresso da nova dobra. Os cabos são Béziers com impulso amortecido e pontas fixas; partículas seguem a curva e desaparecem nas extremidades. O motor usa o único relógio de scroll já existente, sem RAF ou timer próprios. No modo leitura/reduced-motion e sem JavaScript, o desenho completo e todos os textos permanecem disponíveis.

A gravura é uma alegoria editorial. As notas da FTC sustentam as referências a monetização de dados e práticas manipulativas; não constituem comprovação de cada elemento simbólico da imagem.

