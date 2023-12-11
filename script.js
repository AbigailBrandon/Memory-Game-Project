const gameGrid = document.querySelector(".game-container");
let memoryCards = [];
let firstGuess, secondGuess;
let isBoardLocked = false;
let playerScore = 0;

document.querySelector(".score").textContent = playerScore;

fetch("./carddata/cards.json")
  .then((response) => response.json())
  .then((data) => {
    memoryCards = [...data, ...data];
    shuffleMemoryCards();
    createMemoryCards();
  });

function shuffleMemoryCards() {
  let currentIndex = memoryCards.length,
    randomIndex,
    temporaryCard;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryCard = memoryCards[currentIndex];
    memoryCards[currentIndex] = memoryCards[randomIndex];
    memoryCards[randomIndex] = temporaryCard;
  }
}

function createMemoryCards() {
  for (let card of memoryCards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gameGrid.appendChild(cardElement);
    cardElement.addEventListener("click", flipMemoryCard);
  }
}

function flipMemoryCard() {
  if (isBoardLocked) return;
  if (this === firstGuess) return;

  this.classList.add("flipped");

  if (!firstGuess) {
    firstGuess = this;
    return;
  }

  secondGuess = this;
  playerScore++;
  document.querySelector(".score").textContent = playerScore;
  isBoardLocked = true;

  verifyMatch();
}

function verifyMatch() {
  let isMatch = firstGuess.dataset.name === secondGuess.dataset.name;

    //adding matched class to the cards
    if (isMatch) {
      firstGuess.classList.add('matched');
      secondGuess.classList.add('matched');
      disableMatchedCards();
    } else {
      firstGuess.classList.add('mismatch');
      secondGuess.classList.add('mismatch');
      flipBackCards();
    }

  // isMatch ? disableMatchedCards() : flipBackCards();
}

function disableMatchedCards() {
  firstGuess.removeEventListener("click", flipMemoryCard);
  secondGuess.removeEventListener("click", flipMemoryCard);

  resetGuesses();
}

function flipBackCards() {
  setTimeout(() => {
    firstGuess.classList.remove("flipped", "mismatch");
    secondGuess.classList.remove("flipped", "mismatch");
  
    // firstGuess.classList.remove("flipped");
    // secondGuess.classList.remove("flipped");
    resetGuesses();
  }, 1000);
}

function resetGuesses() {
  firstGuess = null;
  secondGuess = null;
  isBoardLocked = false;
}

function restartGame() {
  resetGuesses();
  shuffleMemoryCards();
  playerScore = 0;
  document.querySelector(".score").textContent = playerScore;
  gameGrid.innerHTML = "";
  createMemoryCards();
}
