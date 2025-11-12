const container = document.getElementById("puzzle-container");
const faseTexto = document.getElementById("fase-atual");
const imagemPreview = document.getElementById("imagem-preview");
const mensagemFinal = document.getElementById("mensagem-final");
const botaoJogarNovamente = document.getElementById("jogar-novamente");

let dragged = null;
let dragOverTarget = null;
let ordemCorreta = [];
let faseAtual = 0;
let pointerStartX = 0;
let pointerStartY = 0;
let draggedPieceOriginalRect = null;
let currentTargetPiece = null;

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

function handleDragEnd() {
    if (dragged) {
        dragged.classList.remove("dragging");
        document.body.style.cursor = "default";

        dragged.style.transform = '';
        dragged.style.position = '';
        dragged.style.width = '';
        dragged.style.height = '';

        if (currentTargetPiece) {
            currentTargetPiece.classList.remove("highlight-target");
}

        if (dragOverTarget) {
            swapPieces(dragged, dragOverTarget);
}
    }
    dragged = null;
    dragOverTarget = null;
    currentTargetPiece = null;
    draggedPieceOriginalRect = null;
}

container.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("piece")) {
        e.preventDefault();
        dragged = e.target;
        dragged.classList.add("dragging");
        document.body.style.cursor = "grabbing";
        
        dragged.setPointerCapture(e.pointerId); 
        
        dragged.style.position = 'fixed'; 
        dragged.style.width = `${dragged.offsetWidth}px`;
        dragged.style.height = `${dragged.offsetHeight}px`;

        draggedPieceOriginalRect = dragged.getBoundingClientRect();
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
}
});

container.addEventListener("pointermove", (e) => {
    if (dragged) {
  e.preventDefault();
        
        const currentX = e.clientX;
        const currentY = e.clientY;

        const deltaX = currentX - pointerStartX;
        const deltaY = currentY - pointerStartY;

        dragged.style.transform = `translate(${deltaX}px, ${deltaY}px)`; 
        
        const elementsUnderPointer = document.elementsFromPoint(currentX, currentY);
        const target = elementsUnderPointer.find(
            (el) => el.classList.contains("piece") && el !== dragged
        );

        if (currentTargetPiece && currentTargetPiece !== target) {
            currentTargetPiece.classList.remove("highlight-target");
  }

        if (target) {
            target.classList.add("highlight-target");
            dragOverTarget = target;
            currentTargetPiece = target;
        } else {
            dragOverTarget = null;
        }
    }
});

container.addEventListener("pointerup", () => {
    if (dragged) {
        handleDragEnd();
    }
});

document.addEventListener("pointercancel", () => {
    if (dragged) {
        handleDragEnd();
    }
});
document.addEventListener("pointerout", () => {
    if (dragged) {
        handleDragEnd();
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