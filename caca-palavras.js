const palavras = ['GATO','ROSA','AZUL','LEAO','TULIPA','VERDE','PEIXE','AMARELO','LOBO','ORQUIDEA'];
const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const grid = document.getElementById('grid');
const foundWordsDiv = document.getElementById('found-words');
const winMessage = document.getElementById('win-message');

let matriz = Array(10).fill().map(() => Array(10).fill(''));
let selectedCells = [];
let foundWords = [];

function shuffleWords() {
  palavras.forEach(palavra => {
    let placed = false;
    let tentativas = 0;

    while (!placed && tentativas < 100) {
      tentativas++;
      const horizontal = Math.random() < 0.5;
      const maxX = horizontal ? 10 - palavra.length : 9;
      const maxY = horizontal ? 9 : 10 - palavra.length;
      const x = Math.floor(Math.random() * (maxX + 1));
      const y = Math.floor(Math.random() * (maxY + 1));

      let podeColocar = true;

      for (let i = 0; i < palavra.length; i++) {
        const xi = horizontal ? x + i : x;
        const yi = horizontal ? y : y + i;
        const letraExistente = matriz[yi][xi];
        if (letraExistente && letraExistente !== palavra[i]) {
          podeColocar = false;
          break;
        }
      }

      if (podeColocar) {
        for (let i = 0; i < palavra.length; i++) {
          const xi = horizontal ? x + i : x;
          const yi = horizontal ? y : y + i;
          matriz[yi][xi] = palavra[i];
        }
        placed = true;
      }
    }

    if (!placed) {
      console.warn(`Não foi possível posicionar a palavra: ${palavra}`);
    }
  });
}

function renderGrid() {
  grid.innerHTML = '';
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.innerText = matriz[y][x] || letras[Math.floor(Math.random() * letras.length)];
      cell.addEventListener('click', () => selectCell(cell));
      grid.appendChild(cell);
    }
  }
}

function selectCell(cell) {
  cell.classList.toggle('selected');
  const index = selectedCells.indexOf(cell);
  if (index > -1) {
    selectedCells.splice(index, 1);
  } else {
    selectedCells.push(cell);
  }

  checkSelectedWord();
}

function checkSelectedWord() {
  const word = selectedCells.map(c => c.innerText).join('');
  if (palavras.includes(word) && !foundWords.includes(word)) {
    selectedCells.forEach(c => {
      c.classList.remove('selected');
      c.classList.add('found');
    });
    foundWords.push(word);
    updateFoundWords();
    selectedCells = [];

    if (foundWords.length === palavras.length) {
      winMessage.classList.remove('hidden');
    }
  } else if (word.length > 10 || !palavras.some(p => p.startsWith(word))) {
    selectedCells.forEach(c => c.classList.remove('selected'));
    selectedCells = [];
  }
}

function updateFoundWords() {
  foundWordsDiv.innerText = `Encontradas: ${foundWords.join(', ')}`;
}

function restartGame() {
  matriz = Array(10).fill().map(() => Array(10).fill(''));
  selectedCells = [];
  foundWords = [];
  foundWordsDiv.innerText = '';
  winMessage.classList.add('hidden');
  shuffleWords();
  renderGrid();
}

shuffleWords();
renderGrid();
