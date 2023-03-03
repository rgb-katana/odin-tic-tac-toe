const boardContainer = document.querySelector('.game__board');

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
    let boardHTML = '';
    let curElem = 0;
    for (row of curBoardArr) {
      for (cell of row) {
        boardHTML += `<div class="board__cell" data-coordinates="${curBoardArr.indexOf(
          row
        )};${curElem}" data-is-taken="false"></div>`;
        console.log(`CUR ELEM`, curElem);
        curElem === 2 ? (curElem = 0) : curElem++;
      }
    }

    boardContainer.insertAdjacentHTML('afterbegin', boardHTML);
  };

  return { renderBoard };
})();

function createPlayer(name) {
  // Start creating factory function for players.

  return {
    playerName: name,
  };
}

console.log(displayControl);
displayControl.renderBoard(gameBoard.board);
console.log(gameBoard);
console.log(gameBoard.board);
