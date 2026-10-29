(() => {
  const section = document.querySelector('#referencias [data-reference-search]');
  if (!section) return;

  const names = JSON.parse(document.getElementById('reference-data').textContent).flatMap(({field,people}) => people.map(name => ({field,name})));

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
  let seed = 34817;
  const random = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const shuffled = values => values.map(value => [random(), value]).sort((a,b) => a[0]-b[0]).map(entry => entry[1]);
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
      const [dx,dy] = directions[Math.floor(random()*directions.length)];
      const x = Math.floor(random()*cols), y = Math.floor(random()*rows);
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
    const cols = mobile ? 14 : 32, rows = mobile ? 18 : 22, wanted = mobile ? 12 : 30;
    const matrix = Array.from({length: rows}, () => Array(cols).fill(''));
    const candidates = shuffled(names.map(item => ({...item, letters: normalize(item.name)})).filter(item => item.letters.length >= 4 && item.letters.length <= Math.max(cols,rows)));
    const chosen = candidates.slice(0, wanted).sort((a,b) => b.letters.length-a.letters.length);
    activeWords = chosen.map(word => placeWord(word,matrix,cols,rows)).filter(Boolean);
    matrix.forEach(row => row.forEach((letter,index) => { if (!letter) row[index] = alphabet[Math.floor(random()*alphabet.length)]; }));
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
      const item = document.createElement('li'); item.dataset.word = id; const button = document.createElement('button'); button.type = 'button'; button.textContent = word.name; button.setAttribute('aria-pressed','false'); button.addEventListener('click', () => reveal(id)); item.append(button);
      item.title = word.field; return item;
    }));
    roundLabel.textContent = `${names.length} vozes · rodada ${String(round).padStart(2,'0')}`;
    foundCount.textContent = `0 / ${activeWords.length} encontrados`;
    status.textContent = `Passe ou toque para iluminar. ${names.length} referências.`;

    function reveal(id) {
      if (busy || found.has(id)) return;
      found.add(id);
      activeWords[id].indices.forEach(position => { cells[position].dataset.found = 'true'; });
      const item = targetList.querySelector(`[data-word="${id}"]`);
      item?.setAttribute('data-found','true'); item?.querySelector('button')?.setAttribute('aria-pressed','true');
      foundCount.textContent = `${found.size} / ${activeWords.length} encontrados`;
      status.textContent = `${activeWords[id].name} · ${activeWords[id].field}.`;
    }
    const discover = event => {
      const cell = event.target.closest?.('[data-cell]');
      if (!cell || !grid.contains(cell) || busy) return;
      (lookup.get(Number(cell.dataset.cell)) || []).forEach(reveal);
    };
    grid.onpointerover = discover;
    grid.onclick = discover;
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
    status.textContent = 'Nova rodada. Encontre outros nomes.';
    await pause(450);
    busy = false; shuffleButton.disabled = false;
  }

  shuffleButton.addEventListener('click', shuffleRound);
  renderRound();
})();
