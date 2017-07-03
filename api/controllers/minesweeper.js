const Minesweeper = require('../helpers/minesweeper-core');
let minesweeperUsersGames = {};

function getSessionId(req) {
  return req.session.id;
}

function setSessionId(session) {
  function makeid() {
    let id = '';
    const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i += 1) {
      id += keys.charAt(Math.floor(Math.random() * keys.length));
    }
    return id;
  }
  sessionIds = Object.keys(minesweeperUsersGames);
  let sessionId = makeid();
  while (sessionIds.indexOf(sessionId) > -1) {
    sessionId = makeid();
  }
  session.id = sessionId;
}

function getUserGame(req) {
  const sessionId = getSessionId(req);
  if (sessionId) {
    return minesweeperUsersGames[sessionId];
  }
}

function setUserGame(req, minesweeperInstance) {
  const sessionId = getSessionId(req);
  if (sessionId) {
    return minesweeperUsersGames[sessionId] = minesweeperInstance;
  }
}

function start(req, res) {
  try {
    const gameOptions = req.swagger.params.gameOptions.value;
    if (!req.session.id) {
      setSessionId(req.session);
    }
    let userGame;
    if (gameOptions.restore === true) {
      userGame = getUserGame(req);
    }
    if (!userGame) {
      if (gameOptions.mines >= gameOptions.rows * gameOptions.columns) {
        throw new Error('Mines cannot exceed fields count');
      }
      const minesweeper = new Minesweeper(gameOptions.rows, gameOptions.columns, gameOptions.mines);
      setUserGame(req, minesweeper);
      res.json({success: true});
    } else {
      const boardStatus = userGame.getBoardStatus();
      res.json({
        success: true,
        boardStatus,
        columns: userGame.columns,
        rows: userGame.rows,
        mines: userGame.mines
      });
    }
  } catch(e) {
    console.error(e);
    res.json({success: false});
  }
}

function reveal(req, res) {
  const column = req.swagger.params.column.value;
  const row = req.swagger.params.row.value;
  const minesweeper = getUserGame(req);
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
  const minesweeper = getUserGame(req);
  const result = minesweeper.flag(column, row);
  res.json(result);
}

module.exports = {
  start,
  reveal,
  flag
};
