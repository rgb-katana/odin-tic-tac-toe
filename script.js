const boardContainer = document.querySelector('.game__board');
const entireGame = document.querySelector('.game');

const startBtn = document.querySelector('.start');
const refreshBtn = document.querySelector('.refresh');
const finishBtn = document.querySelector('.finish');

const home = document.querySelector('.home');
const player1 = document.querySelector('.game__player--1');
const player2 = document.querySelector('.game__player--2');
let player1Obj = {};
let player2Obj = {};

const WINS = [
  new Set(['0;0', '0;1', '0;2']),
  new Set(['1;0', '1;1', '1;2']),
  new Set(['2;0', '2;1', '2;2']),
  new Set(['0;0', '1;0', '2;0']),
  new Set(['0;1', '1;1', '2;1']),
  new Set(['0;2', '1;2', '2;2']),
  new Set(['0;0', '1;1', '2;2']),
  new Set(['2;0', '1;1', '0;2']),
];

const gameBoard = (function () {
  // Game array

  const createBoard = function () {
    return Array(3)
      .fill()
      .map(() => Array(3).fill());
  };

  const board = createBoard();

  return { board };
})();

const displayControl = (function () {
  // Display logic

  const renderBoard = function (curBoardArr) {
    // Render logic

    // Probably can do it better with reduce;
    boardContainer.innerHTML = '';
    let boardHTML = '';
    let curElem = 0;
    for (row of curBoardArr) {
      for (cell of row) {
        boardHTML += `<div class="board__cell" data-coordinates="${curBoardArr.indexOf(
          row
        )};${curElem}" data-is-taken="false"></div>`;
        curElem === 2 ? (curElem = 0) : curElem++;
      }
    }

    boardContainer.insertAdjacentHTML('afterbegin', boardHTML);
  };

  const renderNames = function (name1, name2, finish = false) {
    if (finish) {
      player1.innerText = 'Player 1';
      player2.innerText = 'Player 2';
      return;
    }
    player1.innerText = name1;
    player2.innerText = name2;
  };

  const renderCell = function (player, e) {
    if (player === 1) {
      e.target.insertAdjacentHTML(
        'afterbegin',
        `
      <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="game__circle"
    >
      <title>circle</title>
      <path
        d="M11.5,3C16.75,3 21,7.25 21,12.5C21,17.75 16.75,22 11.5,22C6.25,22 2,17.75 2,12.5C2,7.25 6.25,3 11.5,3M11.5,4C6.81,4 3,7.81 3,12.5C3,17.19 6.81,21 11.5,21C16.19,21 20,17.19 20,12.5C20,7.81 16.19,4 11.5,4Z"
      />
    </svg>
      `
      );
    } else if (player === 2) {
      e.target.insertAdjacentHTML(
        'afterbegin',
        `
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="game__cross"
      >
        <title>close</title>
        <path
          d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
        />
      </svg>
      `
      );
    }
  };

  return { renderBoard, renderNames, renderCell };
})();

const gameControl = (function () {
  // Current player;

  curPlayer = 1;

  // Control game flow;

  // Start game;

  function startGame() {
    // Listen to start button

    startBtn.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('.inputs')?.remove();
      home.insertAdjacentHTML(
        'afterbegin',
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

  function refreshGame(explicit = false) {
    if (explicit) {
      displayControl.renderBoard(gameBoard.board);
      if (player1Obj.playerName) {
        player1Obj.currentMoves.clear();
        player2Obj.currentMoves.clear();
      }
    } else {
      refreshBtn.addEventListener('click', function () {
        displayControl.renderBoard(gameBoard.board);
        if (player1Obj.playerName) {
          player1Obj.currentMoves.clear();
          player2Obj.currentMoves.clear();
        }
      });
    }
  }

  // Listen to submit names button

  function submitNames() {
    // Submit names.

    document.addEventListener('click', function (e) {
      e.preventDefault();
      if (e.target.classList.contains('inputs__button')) {
        const nameOne = document.querySelector('.input__player1-name').value;
        const nameTwo = document.querySelector('.input__player2-name').value;
        if (nameOne === '' || nameTwo === '') return;
        displayControl.renderNames(nameOne, nameTwo);
        player1Obj = createPlayer(nameOne);
        player2Obj = createPlayer(nameTwo);
        document.querySelector('.inputs').classList.add('disappear');
        setTimeout(function () {
          document.querySelector('.inputs')?.remove();
        }, 490);
      }
    });
  }

  // Make moves.

  // Currently here!!!
  function makeGameMove() {
    document.addEventListener('click', function (e) {
      // Check if it is a cell and if players are registered.

      if (e.target.dataset.isTaken && player1Obj.playerName) {
        // Chgeck if cell can be taken.

        if (e.target.dataset.isTaken === 'true') return;

        if (curPlayer === 1) {
          // Logic for player 1

          displayControl.renderCell(curPlayer, e);
          e.target.dataset.isTaken = 'true';
          player1Obj.makePlayerMove(e.target.dataset.coordinates);
        } else {
          // Logic for player 2

          displayControl.renderCell(curPlayer, e);
          e.target.dataset.isTaken = 'true';
          player2Obj.makePlayerMove(e.target.dataset.coordinates);
        }
        curPlayer = curPlayer === 1 ? (curPlayer = 2) : (curPlayer = 1);
        checkEnd();
      }
    });

    // Check for end of game.

    function checkEnd() {
      for (let win of WINS) {
        let counterFirstPlayer = 0;
        let counterSecondPlayer = 0;
        for (move of player1Obj.currentMoves) {
          if (win.has(move)) {
            counterFirstPlayer++;
          }
        }

        for (move of player2Obj.currentMoves) {
          if (win.has(move)) {
            counterSecondPlayer++;
          }
        }

        if (counterFirstPlayer === 3) {
          home.insertAdjacentHTML(
            'afterbegin',
            `
          <div class="winner">
          <h1 class="winner__name winner__name--1">${player1Obj.playerName} wins!</h1>
          <button class="winner__button button">Close</button>
        </div>
          `
          );

          curPlayer = 1;
          gameControl.refreshGame(true);

          document
            .querySelector('.winner__button')
            .addEventListener('click', function () {
              document.querySelector('.winner').classList.add('disappear');
              setTimeout(function () {
                document.querySelector('.winner').remove();
              }, 490);
            });
        }

        if (counterSecondPlayer === 3) {
          home.insertAdjacentHTML(
            'afterbegin',
            `
          <div class="winner">
          <h1 class="winner__name winner__name--2">${player2Obj.playerName} wins!</h1>
          <button class="winner__button button">Close</button>
        </div>
          `
          );

          curPlayer = 1;
          gameControl.refreshGame(true);

          document
            .querySelector('.winner__button')
            .addEventListener('click', function () {
              document.querySelector('.winner').classList.add('disappear');
              setTimeout(function () {
                document.querySelector('.winner').remove();
              }, 490);
            });
        }
      }
    }
  }

  function finishGame() {
    finishBtn.addEventListener('click', function () {
      entireGame.classList.add('rotate');
      setTimeout(function () {
        entireGame.classList.remove('rotate');
      }, 2000);
      player1Obj = {};
      player2Obj = {};
      displayControl.renderNames('_', '_', true);
      init();
    });
  }

  return { startGame, submitNames, makeGameMove, refreshGame, finishGame };
})();

function createPlayer(name) {
  // Start creating factory function for players.

  const currentMoves = new Set();

  function makePlayerMove(coords) {
    currentMoves.add(coords);
  }

  return {
    playerName: name,
    currentMoves,
    makePlayerMove,
  };
}

function init() {
  displayControl.renderBoard(gameBoard.board);
  gameControl.startGame();
  gameControl.submitNames();
  gameControl.makeGameMove();
  gameControl.refreshGame();
  gameControl.finishGame();
}

init();
