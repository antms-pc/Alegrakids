const container = document.getElementById("puzzle-container");
const faseTexto = document.getElementById("fase-atual");
const imagemPreview = document.getElementById("imagem-preview");
const mensagemFinal = document.getElementById("mensagem-final");
const botaoJogarNovamente = document.getElementById("jogar-novamente");

let dragged = null;
let dragOverTarget = null;
let ordemCorreta = [];
let faseAtual = 0;

let touchStartX = 0;
let touchStartY = 0;
let draggedPieceOriginalRect = null;

const fases = [
  { tamanho: 3, imagem: "urso.png" },
  { tamanho: 4, imagem: "girafa.jpg" },
  { tamanho: 5, imagem: "cachorro.jpg" } 
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
    piece.dataset.index = pos.index;
    container.appendChild(piece);
  });
}

function getPieceIndex(piece) {
  return Array.from(container.children).indexOf(piece);
}

function swapPieces(piece1, piece2) {
  if (!piece1 || !piece2 || piece1 === piece2) return;

  const piece1Index = getPieceIndex(piece1);
  const piece2Index = getPieceIndex(piece2);

  if (piece1Index < piece2Index) {
    container.insertBefore(piece2, piece1);
    container.insertBefore(piece1, container.children[piece2Index + 1]);
  } else {
    container.insertBefore(piece1, piece2);
    container.insertBefore(piece2, container.children[piece1Index + 1]);
  }
  verificarMontagem();
}

container.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("piece")) {
    dragged = e.target;
    dragged.classList.add("dragging");
    document.body.style.cursor = "grabbing";
  }
});

container.addEventListener("mousemove", (e) => {
  if (dragged) {
    if (e.target.classList.contains("piece") && e.target !== dragged) {
      dragOverTarget = e.target;
    } else {
      dragOverTarget = null;
    }
  }
});

container.addEventListener("mouseup", () => {
  if (dragged) {
    dragged.classList.remove("dragging");
    document.body.style.cursor = "default";
    if (dragOverTarget) {
      swapPieces(dragged, dragOverTarget);
    }
    dragged = null;
    dragOverTarget = null;
  }
});

container.addEventListener("mouseleave", () => {
  if (dragged) {
    dragged.classList.remove("dragging");
    document.body.style.cursor = "default";
    dragged = null;
    dragOverTarget = null;
  }
});

container.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1 && e.target.classList.contains("piece")) {
    e.preventDefault();
    dragged = e.target;
    dragged.classList.add("dragging");
    
    draggedPieceOriginalRect = dragged.getBoundingClientRect();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
}, { passive: false });

container.addEventListener("touchmove", (e) => {
  if (dragged && e.touches.length === 1) {
    e.preventDefault();

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    const deltaX = currentX - touchStartX;
    const deltaY = currentY - touchStartY;

    // Ações agressivas de arrasto (translate + scale)
    dragged.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    const elementsUnderFinger = document.elementsFromPoint(currentX, currentY);
    dragOverTarget = elementsUnderFinger.find(
      (el) => el.classList.contains("piece") && el !== dragged
    );
  }
}, { passive: false });

container.addEventListener("touchend", () => {
  if (dragged) {
    dragged.classList.remove("dragging");
    // Limpeza de estilo para garantir que a peça volte ao normal
    dragged.style.transform = '';

    if (dragOverTarget) {
      swapPieces(dragged, dragOverTarget);
    }
    dragged = null;
    dragOverTarget = null;
    draggedPieceOriginalRect = null;
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
      mensagemFinal.textContent = "🥳 Parabéns, você venceu!!!";
      botaoJogarNovamente.style.display = "inline-block";
    }
  }
}

botaoJogarNovamente.addEventListener("click", () => {
  faseAtual = 0;
  criarQuebraCabeca(fases[0].tamanho, fases[0].imagem);
});

window.addEventListener("resize", () => {
  const faseParaRecriar = fases[faseAtual] || fases[0];
  criarQuebraCabeca(faseParaRecriar.tamanho, faseParaRecriar.imagem);
});


criarQuebraCabeca(fases[0].tamanho, fases[0].imagem);
