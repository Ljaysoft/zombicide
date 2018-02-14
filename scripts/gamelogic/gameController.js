class GameController {
  constructor(gameBoard) {
    this._gameBoard = gameBoard;
    this._gameStarted = false;
  }
  startGame() {
    if (!this._gameStarted) {
      console.log("Starting Game");
      this._gameBoard.showActors();
      this._gameStarted = true;
    } else {
      console.log("game already started");
    }
  }
  stopGame() {
    if (this._gameStarted) {
      console.log("Stoping Game");
      this._gameBoard.stopGame();
      this._gameStarted = false;
    } else {
      console.log("Game not started");
    }
  }
  nextTurn() {
    this._gameBoard.nextTurn();
  }
  move(command) {
    this._gameBoard.move(this._selectedObject, command);
  }
  get selectedObject() {
    return this._selectedObject;
  }
  set selectedObject(object) {
    this._selectedObject = object;
    if (object) {
      $(".gameObject").removeClass("selected");
      $(object).addClass("selected");
      $("#selectedText").text(object.id);
    } else {
      $(".gameObject").removeClass("selected");
      $("#selectedText").text("Nothing Selected");
    }
  }
}
