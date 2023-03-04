const boardContainer = document.querySelector(".game__board");
const startBtn = document.querySelector(".start");
const home = document.querySelector(".home");

const gameBoard = (function () {
  // Game array

  const board = Array(3)
    .fill()
    .map(() => Array(3).fill());

  return { board };
})();

const displayControl = (function () {
  // Display logic

  const renderBoard = function (curBoardArr) {
    // Render logic

    // Probably can do it better with reduce;
    let boardHTML = "";
    let curElem = 0;
    for (row of curBoardArr) {
      for (cell of row) {
        boardHTML += `<div class="board__cell" data-coordinates="${curBoardArr.indexOf(
          row
        )};${curElem}" data-is-taken="false"></div>`;
        curElem === 2 ? (curElem = 0) : curElem++;
      }
    }

    boardContainer.insertAdjacentHTML("afterbegin", boardHTML);
  };

  const renderNameInput = function () {};

  return { renderBoard };
})();

const gameControl = (function () {
  // Control game flow;

  // Start game;

  function startGame() {
    // Listen to start button

    startBtn.addEventListener("click", function (e) {
      e.preventDefault();
      home.insertAdjacentHTML(
        "afterbegin",
        `
			<div class="inputs">
			<form action="input__form">
				<fieldset class="inputs__fieldset">
					<legend class="inputs__legend">Enter the names of players</legend>
					<input
						type="text"
						class="input__player1-name inputs__elem"
						data-player-name="one"
					/>
					<input
						type="text"
						class="input__player2-name inputs__elem"
						data-player-name="two"
					/>
					<button class="inputs__button button" type="submit">Start playing</button>
				</fieldset>
			</form>
		</div>
			`
      );
    });
  }

  // Listen to submit names button

  function submitNames() {
    document.addEventListener("click", function (e) {
      e.preventDefault();
      if (e.target.classList.contains("inputs__button")) {
        const nameOne = document.querySelector(".input__player1-name").value;
        const nameTwo = document.querySelector(".input__player2-name").value;
        if (nameOne === "" || nameTwo === "") return;
      }
    });
  }

  return { startGame, submitNames };
})();

function createPlayer(name) {
  // Start creating factory function for players.

  return {
    playerName: name,
  };
}

displayControl.renderBoard(gameBoard.board);
gameControl.startGame();
gameControl.submitNames();
