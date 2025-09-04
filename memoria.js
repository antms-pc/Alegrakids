const board = document.getElementById("game-board");
const winMessage = document.getElementById("win-message");

let cards = ["🍎", "🍌", "🍇", "🍓", "🍎", "🍌", "🍇", "🍓"];
let flippedCards = [];
let matchedCards = [];

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  board.innerHTML = "";
  winMessage.classList.add("hidden");
  flippedCards = [];
  matchedCards = [];
  shuffle(cards).forEach((symbol, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (flippedCards.length === 2 || this.classList.contains("flipped")) return;

  this.textContent = this.dataset.symbol;
  this.classList.add("flipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
      matchedCards.push(card1, card2);
      flippedCards = [];
      if (matchedCards.length === cards.length) {
        setTimeout(() => winMessage.classList.remove("hidden"), 500);
      }
    } else {
      setTimeout(() => {
        card1.textContent = "";
        card2.textContent = "";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
      }, 1000);
    }
  }
}

function restartGame() {
  createBoard();
}

createBoard();
