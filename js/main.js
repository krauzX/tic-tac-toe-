let startingPage = document.querySelector("#startingPage");
let choose = document.querySelectorAll(".choose");

let mainPage = document.querySelector("#mainPage");
let showChange = document.querySelector("#showChange");
let boxes = document.querySelectorAll(".boxes");

let winner = document.querySelector("#winner");
let winnerName = document.querySelector("#winnerName");
let quit = document.querySelector("#quit");

let changeTurn = null;

// Add global variables for AI
let gameMode = "pvp";
let aiDifficulty = "easy";
let playerSymbol = "X";
let aiSymbol = "O";
let isAITurn = false;

// Show/hide AI difficulty based on game mode selection
const modeSelect = document.querySelector("#modeSelect");
const aiDifficultyDiv = document.querySelector("#aiDifficulty");

modeSelect.addEventListener("change", () => {
  gameMode = modeSelect.value;
  if (gameMode === "ai") {
    aiDifficultyDiv.style.display = "block";
  } else {
    aiDifficultyDiv.style.display = "none";
  }
});

document.querySelector("#difficultySelect").addEventListener("change", (e) => {
  aiDifficulty = e.target.value;
});

choose.forEach((chooseNow) => {
  chooseNow.addEventListener("click", () => {
    if (chooseNow.id === "playerX") {
      changeTurn = false;
      playerSymbol = "X";
      aiSymbol = "O";
      showChange.style.left = `0px`;
    } else {
      changeTurn = true;
      playerSymbol = "O";
      aiSymbol = "X";
      showChange.style.left = `160px`;
    }
    startingPage.style.display = "none";
    mainPage.style.display = "block";

    // If AI goes first, make AI move
    if (gameMode === "ai" && playerSymbol === "O") {
      isAITurn = true;
      setTimeout(makeAIMove, 500);
    }
  });
});

boxes.forEach((items) => {
  items.addEventListener("click", () => {
    // Only allow clicks if it's not AI's turn
    if (gameMode === "ai" && isAITurn) return;

    if (changeTurn == false) {
      // Create X symbol with CSS
      const symbolX = document.createElement("div");
      symbolX.className = "symbol-x";
      items.appendChild(symbolX);

      items.id = "X";
      items.style.pointerEvents = "none";
      showChange.style.left = `160px`;
      changeTurn = true;
    } else {
      // Create O symbol with CSS
      const symbolO = document.createElement("div");
      symbolO.className = "symbol-o";
      items.appendChild(symbolO);

      items.id = "O";
      items.style.pointerEvents = "none";
      showChange.style.left = `0px`;
      changeTurn = false;
    }

    winningFunc();

    if (!drawFunc() && gameMode === "ai") {
      isAITurn = true;
      // Add slight delay for better UX
      setTimeout(makeAIMove, 500);
    }
  });
});

// All Possible Winning Combinations
let winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let winningFunc = () => {
  for (let a = 0; a <= 7; a++) {
    let b = winningCombinations[a];

    if (boxes[b[0]].id == "" || boxes[b[1]].id == "" || boxes[b[2]].id == "") {
      continue;
    } else if (
      boxes[b[0]].id == "X" &&
      boxes[b[1]].id == "X" &&
      boxes[b[2]].id == "X"
    ) {
      winnerName.innerText = `Player X Win The Game!`;
      mainPage.style.display = "none";
      winner.style.display = "block";
    } else if (
      boxes[b[0]].id == "O" &&
      boxes[b[1]].id == "O" &&
      boxes[b[2]].id == "O"
    ) {
      winnerName.innerText = `Player O Win The Game!`;
      mainPage.style.display = "none";
      winner.style.display = "block";
    } else {
      continue;
    }
  }
};

let drawFunc = () => {
  if (
    boxes[0].id != "" &&
    boxes[1].id != "" &&
    boxes[2].id != "" &&
    boxes[3].id != "" &&
    boxes[4].id != "" &&
    boxes[5].id != "" &&
    boxes[6].id != "" &&
    boxes[7].id != "" &&
    boxes[8].id != ""
  ) {
    winnerName.innerText = `Match Draw!`;
    mainPage.style.display = "none";
    winner.style.display = "block";
    return true;
  }
  return false;
};

// AI implementation
function makeAIMove() {
  if (aiDifficulty === "easy") {
    makeRandomMove();
  } else if (aiDifficulty === "medium") {
    // 50% chance of making a smart move
    if (Math.random() < 0.5) {
      makeSmartMove();
    } else {
      makeRandomMove();
    }
  } else {
    // Hard - use minimax algorithm
    makeSmartMove();
  }

  isAITurn = false;
}

function makeRandomMove() {
  const availableBoxes = Array.from(boxes).filter((box) => box.id === "");
  if (availableBoxes.length > 0) {
    const randomBox =
      availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
    simulateClick(randomBox);
  }
}

function makeSmartMove() {
  // Check if AI can win
  const winMove = findWinningMove(aiSymbol);
  if (winMove !== -1) {
    simulateClick(boxes[winMove]);
    return;
  }

  // Check if player can win and block
  const blockMove = findWinningMove(playerSymbol);
  if (blockMove !== -1) {
    simulateClick(boxes[blockMove]);
    return;
  }

  // Take center if available
  if (boxes[4].id === "") {
    simulateClick(boxes[4]);
    return;
  }

  // Take a corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((i) => boxes[i].id === "");
  if (availableCorners.length > 0) {
    simulateClick(
      boxes[
        availableCorners[Math.floor(Math.random() * availableCorners.length)]
      ]
    );
    return;
  }

  // Take any available spot
  makeRandomMove();
}

function findWinningMove(symbol) {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    // Check if two positions have the symbol and the third is empty
    if (
      boxes[a].id === symbol &&
      boxes[b].id === symbol &&
      boxes[c].id === ""
    ) {
      return c;
    }
    if (
      boxes[a].id === symbol &&
      boxes[c].id === symbol &&
      boxes[b].id === ""
    ) {
      return b;
    }
    if (
      boxes[b].id === symbol &&
      boxes[c].id === symbol &&
      boxes[a].id === ""
    ) {
      return a;
    }
  }
  return -1;
}

function simulateClick(box) {
  if (changeTurn == false) {
    // Create X symbol with CSS
    const symbolX = document.createElement("div");
    symbolX.className = "symbol-x";
    box.appendChild(symbolX);

    box.id = "X";
    box.style.pointerEvents = "none";
    showChange.style.left = `160px`;
    changeTurn = true;
  } else {
    // Create O symbol with CSS
    const symbolO = document.createElement("div");
    symbolO.className = "symbol-o";
    box.appendChild(symbolO);

    box.id = "O";
    box.style.pointerEvents = "none";
    showChange.style.left = `0px`;
    changeTurn = false;
  }

  winningFunc();
  drawFunc();
}

// Add a reset function to clear the board without reloading
function resetGame() {
  boxes.forEach((box) => {
    box.innerHTML = "";
    box.id = "";
    box.style.pointerEvents = "auto";
  });

  if (playerSymbol === "X") {
    changeTurn = false;
    showChange.style.left = `0px`;
  } else {
    changeTurn = true;
    showChange.style.left = `160px`;
  }

  mainPage.style.display = "block";
  winner.style.display = "none";

  // If AI goes first, make AI move
  if (gameMode === "ai" && playerSymbol === "O") {
    isAITurn = true;
    setTimeout(makeAIMove, 500);
  }
}

// Update quit button to use reset function
quit.addEventListener("click", resetGame);
