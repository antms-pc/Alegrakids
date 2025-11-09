const board = document.getElementById("game-board");
const winMessage = document.getElementById("win-message");
const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

function handleCardClick() {
  const card = this;
  if (lockBoard || flippedCards.length >= 2 || card.classList.contains("flipped")) return;
  
  card.textContent = card.dataset.emoji;
  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    setTimeout(() => {
      const [c1, c2] = flippedCards;
      
      if (c1.dataset.emoji === c2.dataset.emoji) {
        matchedPairs++;
        c1.removeEventListener("click", handleCardClick);
        c2.removeEventListener("click", handleCardClick);
        
        if (matchedPairs === emojis.length) {
          winMessage.classList.remove("hidden");
        }
      } else {
        c1.textContent = "";
        c2.textContent = "";
        c1.classList.remove("flipped");
        c2.classList.remove("flipped");
      }
      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

function initGame() {
  board.innerHTML = '';
  
  flippedCards = [];
  matchedPairs = 0;
  lockBoard = false;
  winMessage.classList.add("hidden");

  const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  cards.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    
    card.addEventListener("click", handleCardClick);

    board.appendChild(card);
  });
}

// Esta função agora faz o "Soft Reset" e é chamada pelo botão HTML
function restartGame() {
  initGame();
}

document.addEventListener("DOMContentLoaded", initGame);