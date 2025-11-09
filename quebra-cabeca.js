const container = document.getElementById("puzzle-container");
const faseTexto = document.getElementById("fase-atual");
const imagemPreview = document.getElementById("imagem-preview");
const mensagemFinal = document.getElementById("mensagem-final");
const botaoJogarNovamente = document.getElementById("jogar-novamente");

let dragged = null;
let ordemCorreta = [];
let faseAtual = 0;

const fases = [
  { tamanho: 3, imagem: "urso.png" },
  { tamanho: 4, imagem: "girafa.jpg" }
];

function criarQuebraCabeca(tamanho, imagem) {
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${tamanho}, 1fr)`;
  faseTexto.textContent = `Fase ${faseAtual + 1}`;
  imagemPreview.src = imagem;
  mensagemFinal.textContent = "";
  botaoJogarNovamente.style.display = "none";

  const total = tamanho * tamanho;
  ordemCorreta = [];

  const containerSize = container.getBoundingClientRect().width;

  for (let i = 0; i < total; i++) {
    const x = (i % tamanho) * (containerSize / tamanho);
    const y = Math.floor(i / tamanho) * (containerSize / tamanho);
    ordemCorreta.push({ x, y, index: i });
  }

  const embaralhado = ordemCorreta.slice().sort(() => Math.random() - 0.5);

  embaralhado.forEach((pos) => {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundImage = `url('${imagem}')`;
    piece.style.backgroundSize = `${containerSize}px ${containerSize}px`;
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
      mensagemFinal.textContent = "🎉 Parabéns! Você completou todas as fases!";
      botaoJogarNovamente.style.display = "inline-block";
    }
  }
}

botaoJogarNovamente.addEventListener("click", () => {
  faseAtual = 0;
  criarQuebraCabeca(fases[0].tamanho, fases[0].imagem);
});

window.addEventListener("resize", () => {
  criarQuebraCabeca(fases[faseAtual].tamanho, fases[faseAtual].imagem);
});

criarQuebraCabeca(fases[0].tamanho, fases[0].imagem);
