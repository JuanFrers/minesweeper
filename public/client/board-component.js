var boardComponent = (function() {

  const boardElementSelectedClass = 'revealed';
  const START_BUTTON_PRESSED_EVENT = 'start-button-pressed';
  const ELEMENT_REVEALED_EVENT = 'element-revealed';
  const FLAG_BUTTON_PRESSED_EVENT = 'flag-button-pressed';
  let timeCounter;
  let timerInterval;

  function renderInformationBoard(mines, timeCounter = 0) {
    return `<div class="board-header">
            <div class="mines-counter">${mines}</div>
            <button id="start-button">Start</button>
            <div class="time-counter">${timeCounter}</div>
           </div>
    `;
  }

  function increaseTimer() {
    timeCounter += 1;
    const timeCounterElement = document.querySelectorAll('.time-counter')[0];
    timeCounterElement.innerHTML = timeCounter;
  }

  function renderGameBoard(columns, rows, mines) {
    let markup = renderInformationBoard(mines);
    for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
      for (let colIndex = 0; colIndex < columns; colIndex += 1) {
         markup += `<div class="board-element" id="${colIndex}-${rowIndex}">&nbsp;</div>`;
      }
      markup += '<br>';
    }
    return markup;
  }

  function isElementRevealed(element) {
    return element.classList.contains(boardElementSelectedClass);
  }

  function isElementFlagged(element) {
    return element.textContent === '!' || element.textContent === '?';
  }

  function renderElementState(data) {
    const field = document.getElementById(`${data.x}-${data.y}`);
    if (data.hasMine) {
      field.classList.add(boardElementSelectedClass);
      field.innerHTML = 'X';
    } else if (data.revealed) {
      field.classList.add(boardElementSelectedClass);
      if (data.adjacent > 0) {
        field.innerHTML = data.adjacent;
      } else {
        field.innerHTML = '&nbsp;';
      }
    } else {
      field.innerHTML = data.flag === '' ? '&nbsp;' : data.flag;
    }
  }

  function elementClickHandler(event) {
    const element = event.currentTarget;
    if (!isElementRevealed(element) && !isElementFlagged(element)) {
      const customEvent = new CustomEvent(ELEMENT_REVEALED_EVENT, {
        detail: {
          x: element.id.split('-')[0],
          y: element.id.split('-')[1],
        },
        bubbles: true,
        cancelable: false
      });
      element.dispatchEvent(customEvent);
    }
  }

  function elementRightClickHandler(event) {
    event.preventDefault();
    const element = event.currentTarget;
    if (!isElementRevealed(element)) {
      const customEvent = new CustomEvent(FLAG_BUTTON_PRESSED_EVENT, {
        detail: {
          x: element.id.split('-')[0],
          y: element.id.split('-')[1],
        },
        bubbles: true,
        cancelable: false
      });
      element.dispatchEvent(customEvent);
    }
    return false;
  }

  function renderBoardState(state) {
    for (const fieldData of state) {
      renderElementState(fieldData);
    }
  }

  function startButtonClickHandler(event) {
    const element = event.currentTarget;
    const customEvent = new CustomEvent(START_BUTTON_PRESSED_EVENT, {
      bubbles: true,
      cancelable: false
    });
    element.dispatchEvent(customEvent);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function initializeBoard(containerElement, columns, rows, mines) {
    containerElement.innerHTML = renderGameBoard(columns, rows, mines);

    //Append event handlers
    const boardElements = document.querySelectorAll('.board-element');
    for (let i = 0; i < boardElements.length; i+= 1) {
      const boardElement = boardElements[i];
      boardElement.addEventListener('click', elementClickHandler);
      boardElement.addEventListener('contextmenu', elementRightClickHandler);
    }
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startButtonClickHandler);

    timeCounter = 0;
    stopTimer();
    //Start timer
    timerInterval = setInterval(increaseTimer, 1000);
  }

  return {
    initializeBoard,
    renderBoardState,
    stopTimer,
    events: {
      START_BUTTON_PRESSED_EVENT,
      ELEMENT_REVEALED_EVENT,
      FLAG_BUTTON_PRESSED_EVENT
    }
  };

})();
