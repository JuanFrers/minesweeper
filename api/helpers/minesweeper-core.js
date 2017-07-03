function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Minesweeper {
  constructor(rows, columns, mines) {
    this.board = [];
    this.rows = rows;
    this.columns = columns;
    this.mines = mines;
    this.minePositions = [];
    this.gameFinished = false;
    this.gameWon = false;
    this.revealedSpotsCount = 0;
    this.initMatrix();
    this.spreadMines();
  }

  /**
   * Initializes the main structure
   * @return void
   */
  initMatrix() {
    for(let x = 0; x < this.columns; x += 1) {
      this.board[x] = [];
      for(let y = 0; y < this.rows; y += 1) {
        this.board[x][y] = {
          revealed: false,
          hasMine: false,
          flag: "",
          adjacent: 0
        };
      }
    }
  }

  /**
   * Spreads a specific number of mines in the field.
   * @return void
   */
  spreadMines() {
    let count = 0;
    while (count < this.mines) {
      const randomX = getRandomInt(0, this.columns - 1);
      const randomY = getRandomInt(0, this.rows - 1);
      if (!this.board[randomX][randomY].hasMine) {
        this.board[randomX][randomY].hasMine = true;
        this.minePositions.push({x: randomX, y: randomY});
        count += 1;
      }
    }
    for (const minePosition of this.minePositions) {
      this.setAdjacents(minePosition.x, minePosition.y);
    }
  }

  /**
   * Given a position, it calculates the adjacents neighbours coordinates.
   * @param x
   * @param y
   * @return {Array}
   */
  getAdjacentsCoordinates(x, y) {
    const coordinates = [];
    const startingX = x > 0 ? x - 1 : x;
    const startingY = y > 0 ? y - 1 : y;
    const endingX = x < this.columns - 1 ? x + 1 : x;
    const endingY = y < this.rows - 1 ? y + 1 : y;
    for(let x = startingX; x <= endingX; x += 1) {
      for(let y = startingY; y <= endingY; y += 1) {
        coordinates.push({x, y});
      }
    }
    return coordinates;
  }

  /**
   * Given a mine position, it updates the neighbour's adjacent count.
   * @param mineX
   * @param mineY
   */
  setAdjacents(mineX, mineY) {
    for(const coordinates of this.getAdjacentsCoordinates(mineX, mineY)) {
      if (!this.board[coordinates.x][coordinates.y].hasMine) {
        this.board[coordinates.x][coordinates.y].adjacent += 1;
      }
    }
  }

  /**
   * Collects all mines data.
   * @return {Array}
   */
  collectMines() {
    return this.minePositions.map(mine => {
      const mineData = this.board[mine.x][mine.y];
      mineData.revealed = true;
      return Object.assign(mineData, {x: mine.x, y: mine.y});
    });
  }

  /**
   * Reveals a selected position and possibly many of them.
   * @param x
   * @param y
   * @param result
   * @return {Array}
   */
  reveal(x, y, result = []) {
    if (this.gameFinished) {
      return result;
    }
    const boardPlace = this.board[x][y];
    if (!boardPlace.revealed) {
      if (boardPlace.hasMine) { //This can only happen for the user selected field
        this.gameFinished = true;
        this.gameWon = false;
        return this.collectMines();
      }
      boardPlace.revealed = true;
      this.revealedSpotsCount += 1;
      result.push(Object.assign(boardPlace, {x, y}));
      if (boardPlace.adjacent === 0) {
        for(const coordinates of this.getAdjacentsCoordinates(x, y)) {
          this.reveal(coordinates.x, coordinates.y, result);
        }
      }
    }
    if (this.revealedSpotsCount === this.rows * this.columns - this.mines) {
      this.gameFinished = true;
      this.gameWon = true;
    }
    return result;
  }

  /**
   * Toggles a flag in the selected position.
   * @param x
   * @param y
   * @return {Object}
   */
  flag(x, y) {
    const boardPlace = this.board[x][y];
    if (!boardPlace.revealed) {
      if (boardPlace.flag === '') {
        boardPlace.flag = '!';
      } else if (boardPlace.flag === '!') {
        boardPlace.flag = '?';
      } else {
        boardPlace.flag = '';
      }
    }
    return {flag: boardPlace.flag};
  }

  /**
   * Retrieves current board status
   * @return {Array}
   */
  getBoardStatus() {
    const boardData = [];
    for(let x = 0; x < this.columns; x += 1) {
      for(let y = 0; y < this.rows; y += 1) {
        const boardPlace = this.board[x][y];
        if (boardPlace.revealed || boardPlace.flag !== '') {
          boardData.push(Object.assign(boardPlace, {x, y}));
        }
      }
    }
    return boardData;
  }

}

module.exports = Minesweeper;
