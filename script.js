let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let mgsContainer = document.querySelector(".mgs-container");
let mgs = document.querySelector("#mgs");

let turnO = true; // true means "O", false means "X" (AI)
const player = "O";
const ai = "X";

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8]
];

const resetGame = () => {
  turnO = true;
  enableBoxes();
  mgsContainer.classList.add("hide");
};

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (turnO) { // Human player's turn
      box.innerText = player;
      box.disabled = true;
      turnO = false;
      if (!checkWinner()) {
        // Delay AI move by 1 seconds
        setTimeout(() => {
          aiMove();
        }, 1000);
      }
    }
  });
});

const disableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = true;
  });
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove('ai');
  });
};

const showWinner = (winner) => {
  mgs.innerText = `Congratulations🎉, The winner is ${winner}`;
  mgsContainer.classList.remove("hide");
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        console.log("Winner", pos1Val);
        showWinner(pos1Val);
        return true;
      }
    }
  }

  // Check for draw
  const allBoxesFilled = [...boxes].every(box => box.innerText !== "");
  if (allBoxesFilled) {
    mgs.innerText = "It's a draw!🤝";
    mgsContainer.classList.remove("hide");
    return true;
  }
  return false;
};

const aiMove = () => {
  if (checkWinner()) return; // Don't move if there's already a winner

  // Try to block the player or pick a random move
  const emptyBoxes = [];
  boxes.forEach((box, index) => {
    if (box.innerText === "") emptyBoxes.push(index);
  });

  // Find a block if possible
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];

    if (values.filter(val => val === player).length === 2 && values.includes("")) {
      let emptyIndex = values.indexOf("");
      boxes[pattern[emptyIndex]].innerText = ai;
      boxes[pattern[emptyIndex]].disabled = true;
      turnO = true;
      checkWinner();
      return;
    }
  }

  // If no block, pick a random move
  const randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
  boxes[randomIndex].innerText = ai;
  boxes[randomIndex].disabled = true;
  turnO = true;
  checkWinner();
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
