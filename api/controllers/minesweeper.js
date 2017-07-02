const Minesweeper = require('../helpers/minesweeper-core');
let minesweeper;

function start(req, res) {
  try {
    const gameOptions = req.swagger.params.gameOptions.value;
    minesweeper = new Minesweeper(gameOptions.rows, gameOptions.columns, gameOptions.mines);
    res.json({success: true});
  } catch(e) {
    console.error(e);
    res.json({success: false});
  }

}

function reveal(req, res) {
  const column = req.swagger.params.column.value;
  const row = req.swagger.params.row.value;
  const revealResult = minesweeper.reveal(column, row);
  const result = {
    revealResult,
    gameFinished: minesweeper.gameFinished,
    gameWon: minesweeper.gameWon
  };
  res.json(result);
}

function flag(req, res) {
  const column = req.swagger.params.column.value;
  const row = req.swagger.params.row.value;
  const result = minesweeper.flag(column, row);
  res.json(result);
}

module.exports = {
  start,
  reveal,
  flag
};
