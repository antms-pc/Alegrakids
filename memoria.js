document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  const winMessage = document.getElementById("win-message");
  const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
  const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  let flippedCards = [];
  let matchedPairs = 0;
  let lockBoard = false;

  cards.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", () => {
      if (lockBoard || flippedCards.length >= 2 || card.classList.contains("flipped")) return;
      card.textContent = emoji;
      card.classList.add("flipped");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        lockBoard = true;
        setTimeout(() => {
          const [c1, c2] = flippedCards;
          if (c1.dataset.emoji === c2.dataset.emoji) {
            matchedPairs++;
            if (matchedPairs === emojis.length) {
              winMessage.classList.remove("hidden");
              setTimeout(restartGame, 2000);
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
    });

    board.appendChild(card);
  });
});

function restartGame() {
  location.reload();
}
