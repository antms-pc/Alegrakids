const container = document.getElementById("puzzle-container");
const faseTexto = document.getElementById("fase-atual");
const imagemPreview = document.getElementById("imagem-preview");
let dragged = null;
let ordemCorreta = [];
let faseAtual = 0;

const fases = [
  { tamanho: 3, imagem: "Bob 3x3.webp" },
  { tamanho: 5, imagem: "Cascão 5x5.jpg" },
  { tamanho: 7, imagem: "Girafa 7x7.jpg" },
];

function criarQuebraCabeca(tamanho, imagem) {
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${tamanho}, 100px)`;
  container.style.gridTemplateRows = `repeat(${tamanho}, 100px)`;
  faseTexto.textContent = `Fase atual: ${tamanho}×${tamanho}`;
  imagemPreview.src = imagem;

  const total = tamanho * tamanho;
  ordemCorreta = [];

  for (let i = 0; i < total; i++) {
    const x = (i % tamanho) * 100;
    const y = Math.floor(i / tamanho) * 100;
    ordemCorreta.push({ x, y, index: i });
  }

  const embaralhado = ordemCorreta.slice().sort(() => Math.random() - 0.5);

  embaralhado.forEach((pos) => {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.width = "100px";
    piece.style.height = "100px";
    piece.style.backgroundImage = `url('${imagem}')`;
    piece.style.backgroundSize = `${tamanho * 100}px ${tamanho * 100}px`;
    piece.style.backgroundPosition = `-${pos.x}px -${pos.y}px`;
    piece.setAttribute("draggable", true);
    piece.dataset.index = pos.index;
    container.appendChild(piece);
  });
}

container.addEventListener("dragstart", (e) => {
  dragged = e.target;
});

container.addEventListener("dragover", (e) => {
  e.preventDefault();
});

container.addEventListener("drop", (e) => {
  if (e.target.classList.contains("piece")) {
    const temp = document.createElement("div");
    container.insertBefore(temp, dragged);
    container.insertBefore(dragged, e.target);
    container.insertBefore(e.target, temp);
    container.removeChild(temp);
    verificarMontagem();
  }
});

function verificarMontagem() {
  const pecas = Array.from(container.children);
  const indices = pecas.map(p => parseInt(p.dataset.index));
  const correto = indices.every((val, i) => val === i);

  if (correto) {
    faseAtual++;
    if (faseAtual < fases.length) {
      setTimeout(() => {
        const proxima = fases[faseAtual];
        criarQuebraCabeca(proxima.tamanho, proxima.imagem);
      }, 1000);
    } else {
      faseTexto.innerHTML = "<strong>🎉 Parabéns! Você ganhou o jogo! 🎉</strong>";
    }
  }
}

// Inicia com a primeira fase
criarQuebraCabeca(fases[0].tamanho, fases[0].imagem);
