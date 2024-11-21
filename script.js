const BAR_NUMBER = 100;

function storageController() {
  let cache = JSON.parse(localStorage.getItem("score")) || [];

  const syncWithStorage = () => {
    localStorage.setItem("score", JSON.stringify(cache));
  };

  const store = (value) => {
    cache.push(value);
    syncWithStorage();
  };

  const getStoredValues = () => {
    return [...cache];
  };

  const getBestScore = () => {
    return cache.length
      ? cache.reduce(
          (min, current) => (current < min ? current : min),
          cache[0]
        )
      : null;
  };

  const getAverage = () => {
    return cache.length
      ? cache.reduce((sum, current) => sum + current, 0) / cache.length
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

  let counter = 0;
  counterP.textContent = "Nombre de coups joués : " + counter;

  function renderBars() {
    const fragment = document.createDocumentFragment();

    boardArray.forEach((_, index) => {
      const bar = document.createElement("div");
      bar.classList.add("bar", "bar--active");
      bar.dataset.index = index;
      bar.style.setProperty("--delay", -((index / 10)) + "s");
      //bar.dataset.value = value;
      fragment.appendChild(bar);
    });

    container.replaceChildren(fragment);
  }

  container.addEventListener("click", (e) => {
    const bar = e.target;
    if (!bar.classList.contains("bar--active")) return;

    const index = parseInt(bar.dataset.index);
    //const value = parseInt(bar.dataset.value);

    incrementTurnCounter();

    if (boardArray[index] === -1) {
      removeLeftSide(index);
    } else if (boardArray[index] === 1) {
      removeRightSide(index);
    } else if (boardArray[index] === 0) {
      handleWin(index);
    }
  });

  newGameBtn.addEventListener("click", () => {
    startNewGame();
  });

  function incrementTurnCounter() {
    counter++;
    counterP.textContent = "Nombre de coups joués : " + counter;
  }

  function removeLeftSide(index) {
    for (let i = 0; i <= index; i++) {
      const bar = container.children[i];
      bar.classList.remove("bar--active");
      bar.style.setProperty("animation-play-state", "paused");
    }
  }

  function removeRightSide(index) {
    for (let i = boardArray.length - 1; i >= index; i--) {
      const bar = container.children[i];
      bar.classList.remove("bar--active");
      bar.style.setProperty("animation-play-state", "paused");
    }
  }

  function handleWin(index) {
    removeLeftSide(index);
    removeRightSide(index);
    const bar = container.children[index];
    bar.classList.add("bar--won");
    storage.store(counter);
    actualiseStats();
  }

  function actualiseStats() {
    document.querySelector(".stats__best").textContent = storage.getBestScore();
    document.querySelector(".stats__average").textContent =
      Math.round(storage.getAverage() * 100) / 100;
  }

  function startNewGame() {
    boardArray = createBoardArray();
    counter = 0;
    counterP.textContent = "Nombre de coups joués : " + counter;
    renderBars();
    actualiseStats();
  }

  renderBars();
  actualiseStats();
}

function createBoardArray() {
  const numberToFind = Math.floor(Math.random() * BAR_NUMBER);
  return Array.from({ length: BAR_NUMBER }, (_, i) =>
    Math.sign(i - numberToFind)
  );
}

function newGame(storage) {
  const boardArray = createBoardArray();
  displayController(boardArray, storage);
}

document.addEventListener("DOMContentLoaded", () => {
  const storage = storageController();
  newGame(storage);
});
