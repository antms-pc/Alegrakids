document.addEventListener("DOMContentLoaded", () => {
  iniciarJogo();
});

function iniciarJogo() {
  const palavras = ["gato", "rosa", "azul", "leão", "tulipa", "verde", "peixe", "amarelo", "lobo", "orquídea"];
  const gridSize = 10;
  const grid = document.getElementById("grid");
  const foundWordsDiv = document.getElementById("found-words");
  const winMessage = document.getElementById("win-message");

  grid.innerHTML = "";
  foundWordsDiv.innerHTML = "";
  winMessage.classList.add("hidden");

  let selecionadas = [];
  let encontradas = [];

  const letras = Array.from({ length: gridSize * gridSize }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  );

  const ocupado = Array(gridSize * gridSize).fill(false);

  palavras.forEach((palavra) => {
    const direcao = Math.random() > 0.5 ? "horizontal" : "vertical";
    let colocado = false;

    while (!colocado) {
      const linha = Math.floor(Math.random() * gridSize);
      const coluna = Math.floor(Math.random() * gridSize);
      const indices = [];

      if (direcao === "horizontal" && coluna + palavra.length <= gridSize) {
        for (let i = 0; i < palavra.length; i++) {
          const idx = linha * gridSize + coluna + i;
          if (ocupado[idx]) break;
          indices.push(idx);
        }
      } else if (direcao === "vertical" && linha + palavra.length <= gridSize) {
        for (let i = 0; i < palavra.length; i++) {
          const idx = (linha + i) * gridSize + coluna;
          if (ocupado[idx]) break;
          indices.push(idx);
        }
      }

      if (indices.length === palavra.length) {
        indices.forEach((idx, i) => {
          letras[idx] = palavra[i].toUpperCase();
          ocupado[idx] = true;
        });
        colocado = true;
      }
    }
  });

  letras.forEach((letra, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = letra;
    cell.dataset.index = i;
    cell.setAttribute("role", "button");
    cell.setAttribute("tabindex", "0");
    grid.appendChild(cell);

    cell.addEventListener("click", () => {
      if (cell.classList.contains("found")) return;
      cell.classList.toggle("selected");
      if (cell.classList.contains("selected")) {
        selecionadas.push(cell);
      } else {
        selecionadas = selecionadas.filter(c => c !== cell);
      }
      verificarPalavra();
    });
  });

  function verificarPalavra() {
    const palavraSelecionada = selecionadas.map(c => c.textContent).join("").toLowerCase();
    if (palavras.includes(palavraSelecionada) && !encontradas.includes(palavraSelecionada)) {
      encontradas.push(palavraSelecionada);
      selecionadas.forEach(c => {
        c.classList.remove("selected");
        c.classList.add("found");
      });
      selecionadas = [];
      atualizarLista();
      if (encontradas.length === palavras.length) {
        winMessage.classList.remove("hidden");
        setTimeout(iniciarJogo, 2000);
      }
    }
  }

  function atualizarLista() {
    foundWordsDiv.innerHTML = `<strong>Encontradas:</strong> ${encontradas.map(p => `<span>${p}</span>`).join(" ")}`;
  }
}

function restartGame() {
  iniciarJogo();
}
