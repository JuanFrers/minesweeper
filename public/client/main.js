((apiClient, boardComponent) => {
    const columns = 5;
    const rows = 5;
    const mines = 3;

    const gameContainer = document.getElementById('game');

    function startNewGame() {
        return apiClient.startGame(columns, rows, mines)
            .then((response) => {
                if (response.success) {
                    boardComponent.initializeBoard(gameContainer, columns, rows, mines);

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

    startNewGame();

})(apiClient, boardComponent);
