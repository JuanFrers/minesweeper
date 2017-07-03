((apiClient, boardComponent) => {
  function getOption(option) {
    let value;
    switch(option) {
      case 'columns':
        value = document.getElementById('columns-setting').value;
        break;
      case 'rows':
        value = document.getElementById('rows-setting').value;
        break;
      case 'mines':
        value = document.getElementById('mines-setting').value;
    }
    return parseInt(value, 10);
  }

  const gameContainer = document.getElementById('game');

  function startNewGame(event, restore = false) {
    const columns = getOption('columns');
    const rows = getOption('rows');
    const mines = getOption('mines');
    if (mines >= rows * columns) {
      alert('Mines cannot exceed fields count');
      return;
    }
    return apiClient.startGame(columns, rows, mines, restore)
      .then((response) => {
        if (response.success) {
          if (response.boardStatus) { //There is a previous game
            boardComponent.initializeBoard(gameContainer, response.columns, response.rows, response.mines);
            boardComponent.renderBoardState(response.boardStatus);
          } else {
            boardComponent.initializeBoard(gameContainer, columns, rows, mines);
          }
        } else {
          throw new Error('Server could not initialize game');
        }
      })
      .catch(() => alert(`Start game error: ${err}`));
  }

  function flag(event) {
    return apiClient.flag(event.detail.x, event.detail.y)
      .then(result => {
        const fieldData = Object.assign(result, {x: event.detail.x, y: event.detail.y});
        boardComponent.renderBoardState([fieldData]);
      })
      .catch(err => alert(`Position could not flagged: ${err} ${err.stack}`));
  }

  function revealElement(event) {
    apiClient.reveal(event.detail.x, event.detail.y)
      .then(result => {
        boardComponent.renderBoardState(result.revealResult);
        //Let application render
        setTimeout(() => {
          if (result.gameFinished) {
            boardComponent.stopTimer();
            const message = result.gameWon ? 'You win!' : 'You loose';
            alert(message);
          }
        }, 0);
      })
      .catch(err => alert(`Position could not be revealed: ${err} ${err.stack}`));
  }

  gameContainer.addEventListener(boardComponent.events.START_BUTTON_PRESSED_EVENT, startNewGame);
  gameContainer.addEventListener(boardComponent.events.FLAG_BUTTON_PRESSED_EVENT, flag);
  gameContainer.addEventListener(boardComponent.events.ELEMENT_REVEALED_EVENT, revealElement);

  startNewGame(null, true);

})(apiClient, boardComponent);
