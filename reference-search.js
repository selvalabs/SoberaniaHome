(() => {
  const section = document.querySelector('#referencias [data-reference-search]');
  if (!section) return;

  const names = [
    ['Educação e território', 'Paulo Freire', 'bell hooks', 'Ailton Krenak', 'Milton Santos', 'Nego Bispo', 'Darcy Ribeiro', 'Anísio Teixeira', 'Lélia Gonzalez', 'Carolina Maria de Jesus', 'Sueli Carneiro', 'Abdias do Nascimento', 'Conceição Evaristo', 'Djamila Ribeiro', 'Antonieta de Barros', 'Beatriz Nascimento', 'Josué de Castro', 'Eduardo Galeano', 'Davi Kopenawa', 'Sonia Guajajara', 'Célia Xakriabá', 'Florestan Fernandes', 'Celso Furtado', 'Maria da Conceição Tavares', 'Mário de Andrade', 'Daniel Munduruku'],
    ['Direitos e cooperação', 'Martin Luther King Jr.', 'Malcolm X', 'Frantz Fanon', 'Angela Davis', 'Piotr Kropotkin', 'W. E. B. Du Bois', 'Audre Lorde', 'Rosa Luxemburg', 'Emma Goldman', 'Stuart Hall', 'James Baldwin', 'Toni Morrison', 'Octavia Butler', 'Amílcar Cabral', 'Thomas Sankara', 'Nelson Mandela', 'Marielle Franco', 'Ruth Wilson Gilmore', 'Patricia Hill Collins', 'Kimberlé Crenshaw', 'Grada Kilomba', 'Achille Mbembe', 'Judith Butler', 'Silvia Federici', 'David Graeber'],
    ['Ciência e tecnologia', 'Miguel Nicolelis', 'Yuk Hui', 'Ruha Benjamin', 'Sasha Costanza-Chock', 'Catherine D’Ignazio', 'Lauren Klein', 'Donna Haraway', 'Ursula Franklin', 'Langdon Winner', 'Ivan Illich', 'Timnit Gebru', 'Safiya Noble', 'Joy Buolamwini', 'Kate Crawford', 'Virginia Eubanks', 'Cathy O’Neil', 'Shoshana Zuboff', 'Tim Berners-Lee', 'Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Radia Perlman', 'Meredith Broussard', 'Paulo Blikstein', 'Jaron Lanier'],
    ['Ecologia, música e cultura', 'Chico Mendes', 'Ana Primavesi', 'Vandana Shiva', 'Wangari Maathai', 'Elinor Ostrom', 'Robin Wall Kimmerer', 'José Lutzenberger', 'Marina Silva', 'Carlos Nobre', 'Bertha Becker', 'Aziz Ab’Sáber', 'João Pedro Stedile', 'José Graziano', 'Masanobu Fukuoka', 'Arturo Escobar', 'Eduardo Viveiros de Castro', 'Isabelle Stengers', 'Bruno Latour', 'Lynn Margulis', 'Fritjof Capra', 'Bob Marley', 'Fela Kuti', 'Nina Simone', 'Gilberto Gil', 'Milton Nascimento', 'Luedji Luna', 'Bia Ferreira', 'Emicida', 'Chico Science', 'Dona Ivone Lara', 'Maya Angelou', 'Rita Lee', 'Tiganá Santana', 'Beatriz Milhazes', 'Naná Vasconcelos']
  ].flatMap(([field, ...people]) => people.map(name => ({field, name})));

  const grid = section.querySelector('[data-reference-grid]');
  const board = section.querySelector('[data-reference-board]');
  const targetList = section.querySelector('[data-reference-targets]');
  const library = section.querySelector('[data-reference-library-list]');
  const status = section.querySelector('[data-reference-status]');
  const foundCount = section.querySelector('[data-reference-found]');
  const roundLabel = section.querySelector('[data-reference-round]');
  const shuffleButton = section.querySelector('[data-reference-shuffle]');
  const directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/gi, '').toUpperCase();
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const shuffled = values => values.map(value => [Math.random(), value]).sort((a,b) => a[0]-b[0]).map(entry => entry[1]);
  let round = 0, busy = false, activeWords = [], cells = [];

  function buildLibrary() {
    const groups = [...new Set(names.map(item => item.field))];
    library.replaceChildren(...groups.map(field => {
      const group = document.createElement('section');
      const heading = document.createElement('h4'); heading.textContent = field;
      const list = document.createElement('p'); list.textContent = names.filter(item => item.field === field).map(item => item.name).join(' · ');
      group.append(heading, list); return group;
    }));
    section.querySelector('.reference-library summary').textContent = `Ver as ${names.length} pessoas da curadoria`;
  }

  function placeWord(word, matrix, cols, rows) {
    for (let attempt = 0; attempt < 6000; attempt++) {
      const [dx,dy] = directions[Math.floor(Math.random()*directions.length)];
      const x = Math.floor(Math.random()*cols), y = Math.floor(Math.random()*rows);
      const endX = x + dx*(word.letters.length-1), endY = y + dy*(word.letters.length-1);
      if (endX < 0 || endX >= cols || endY < 0 || endY >= rows) continue;
      const indices = word.letters.split('').map((_,i) => (y+dy*i)*cols + x+dx*i);
      if (indices.some((index,i) => matrix[Math.floor(index/cols)][index%cols] && matrix[Math.floor(index/cols)][index%cols] !== word.letters[i])) continue;
      indices.forEach((index,i) => { matrix[Math.floor(index/cols)][index%cols] = word.letters[i]; });
      return {...word, indices};
    }
    return null;
  }

  function renderRound() {
    round++;
    const mobile = matchMedia('(max-width: 759px)').matches;
    const cols = mobile ? 14 : 26, rows = mobile ? 12 : 18, wanted = mobile ? 10 : 24;
    const matrix = Array.from({length: rows}, () => Array(cols).fill(''));
    const candidates = shuffled(names.map(item => ({...item, letters: normalize(item.name)})).filter(item => item.letters.length >= 4 && item.letters.length <= Math.max(cols,rows)));
    const chosen = candidates.slice(0, wanted).sort((a,b) => b.letters.length-a.letters.length);
    activeWords = chosen.map(word => placeWord(word,matrix,cols,rows)).filter(Boolean);
    matrix.forEach(row => row.forEach((letter,index) => { if (!letter) row[index] = alphabet[Math.floor(Math.random()*alphabet.length)]; }));
    grid.style.setProperty('--reference-cols', cols);
    grid.setAttribute('aria-label', `Caça-palavras, rodada ${round}, ${cols} colunas por ${rows} linhas.`);
    cells = matrix.flat().map((letter,index) => {
      const cell = document.createElement('span'); cell.className = 'reference-cell'; cell.textContent = letter;
      cell.dataset.cell = index; cell.setAttribute('aria-hidden','true'); return cell;
    });
    grid.replaceChildren(...cells);
    const placedIds = new Map(activeWords.map((word,index) => [word,index]));
    const found = new Set(), visited = activeWords.map(() => new Set());
    const lookup = new Map();
    activeWords.forEach((word,id) => word.indices.forEach(index => {
      if (!lookup.has(index)) lookup.set(index,[]);
      lookup.get(index).push(id);
    }));
    targetList.replaceChildren(...activeWords.map((word,id) => {
      const item = document.createElement('li'); item.textContent = word.name; item.dataset.word = id;
      item.title = word.field; return item;
    }));
    roundLabel.textContent = `${names.length} vozes · rodada ${String(round).padStart(2,'0')}`;
    foundCount.textContent = `0 / ${activeWords.length} encontrados`;
    status.textContent = `Passe pelas letras para acender as referências. ${names.length} pessoas na curadoria.`;

    grid.onpointerover = event => {
      const cell = event.target.closest?.('[data-cell]');
      if (!cell || !grid.contains(cell)) return;
      const index = Number(cell.dataset.cell);
      cell.dataset.glow = 'true';
      (lookup.get(index) || []).forEach(id => {
        if (found.has(id)) return;
        visited[id].add(index);
        if (visited[id].size === activeWords[id].indices.length) {
          found.add(id);
          activeWords[id].indices.forEach(position => { cells[position].dataset.found = 'true'; });
          targetList.querySelector(`[data-word="${id}"]`)?.setAttribute('data-found','true');
          foundCount.textContent = `${found.size} / ${activeWords.length} encontrados`;
          status.textContent = `Referência encontrada: ${activeWords[id].name}. Continue a percorrer a grade.`;
        }
      });
    };
    grid.dataset.round = String(round);
  }

  async function shuffleRound() {
    if (busy) return;
    busy = true; shuffleButton.disabled = true; board.dataset.inked = 'true';
    for (let seconds = 5; seconds > 0; seconds--) {
      status.textContent = `A tinta cobre a grade · embaralhando em ${seconds}…`;
      await pause(1000);
    }
    renderRound();
    await pause(120);
    board.dataset.inked = 'false';
    status.textContent = 'Nova rodada. Os nomes e as letras mudaram de lugar.';
    await pause(450);
    busy = false; shuffleButton.disabled = false;
  }

  shuffleButton.addEventListener('click', shuffleRound);
  buildLibrary(); renderRound();
})();
