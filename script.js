function storageController() {
  const store = (value) => {
    let scores = JSON.parse(localStorage.getItem("score")) || [];
    scores.push(value);
    localStorage.setItem("score", JSON.stringify(scores));
  };

  const getStoredValues = () => {
    const scores = JSON.parse(localStorage.getItem("score")) || [];
    return scores;
  };

  const getBestScore = () => {
    const scores = getStoredValues();

    return scores.reduce((min, current) => {
      return current < min ? current : min;
    }, scores[0]);
  };

  const getAverage = () => {
    const scores = getStoredValues();

    return scores.length
      ? scores.reduce((sum, current) => sum + current, 0) / scores.length
      : 0;
  };

  return {
    store,
    getStoredValues,
    getBestScore,
    getAverage,
  };
}

function displayController(boardArray, storage) {
  const container = document.querySelector(".bar-container");
  const newGameBtn = document.querySelector(".new-game-btn");
  let counterP = document.querySelector(".move-counter");
  container.innerHTML = "";
  let counter = 0;
  counterP.textContent = "Nombre de coups joués : " + counter;
  actualiseStats();
  newGameBtn.addEventListener("click", () => {
    newGame(storage);
  });
  let barArray = boardArray.map((element, index) => {
    const bar = document.createElement("div");
    bar.classList.add("bar", "bar--active");
    switch (element) {
      case -1:
        bar.addEventListener("click", (e) => {
          if (e.target.classList.contains("bar--active")) {
            incrementTurnCounter();
            removeLeftSide(index);
          }
        });
        break;
      case 0:
        bar.addEventListener("click", (e) => {
          if (e.target.classList.contains("bar--active")) {
            incrementTurnCounter();
            handleWin(index);
          }
        });
        break;
      case 1:
        bar.addEventListener("click", (e) => {
          if (e.target.classList.contains("bar--active")) {
            incrementTurnCounter();
            removeRightSide(index);
          }
        });
        break;
    }
    container.appendChild(bar);
    return bar;
  });

  function incrementTurnCounter() {
    counter++;
    counterP.textContent = "Nombre de coups joués : " + counter;
  }

  function removeLeftSide(index) {
    for (let i = 0; i <= index; i++) {
      barArray[i].classList.remove("bar--active");
    }
  }

  function removeRightSide(index) {
    for (let i = 99; i >= index; i--) {
      barArray[i].classList.remove("bar--active");
    }
  }

  function handleWin(index) {
    removeRightSide(index);
    removeLeftSide(index);
    barArray[index].classList.add("bar--won");
    storage.store(counter);
    actualiseStats();
  }

  function actualiseStats() {
    document.querySelector(".stats__best").textContent = storage.getBestScore();
    document.querySelector(".stats__average").textContent =
      Math.round(storage.getAverage() * 100) / 100;
  }
}

function createBoardArray() {
  const numberToFind = Math.floor(Math.random() * 100);
  let boardArray = [];
  for (let i = 0; i < 100; i++) {
    boardArray.push(Math.sign(i - numberToFind));
  }
  return boardArray;
}

function newGame(storage) {
  const game = displayController(createBoardArray(), storage);
}

document.addEventListener("DOMContentLoaded", () => {
  storage = storageController();
  newGame(storage);
});
