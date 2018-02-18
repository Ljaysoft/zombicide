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
    this._gameBoard.move(this._selectedObjectId, command);
  }
  get selectedObjectId() {
    return this._selectedObjectId;
  }
  set selectedObjectId(id) {
    this._selectedObjectId = id;
    if (id>=0) {
      let object = this._gameBoard.gameObjects[id];
      $('.gameObject').removeClass("selected");
      $('.gameObject#'+id).addClass("selected");
      $("#selectedText").text(object.name);
    } else {
      $(".gameObject").removeClass("selected");
      $("#selectedText").text("Nothing Selected");
    }
  }

  moveObject(gameObject, position) {
    if (gameObject.isAnimated) {
      return;
    }
    let startPos = gameObject.position;
    let animation = {
      top: (position.y - 1) * this._gameBoard.map.tsize + "px",
      left: (position.x - 1) * this._gameBoard.map.tsize + "px"
    };
    let $originalObject = gameObject.getElement();
    $originalObject.css({
      "grid-column": "unset",
      "grid-row": "unset",
      top: (startPos.y - 1) * this._gameBoard.map.tsize + "px",
      left: (startPos.x - 1) * this._gameBoard.map.tsize + "px"
    });
    //$originalObject.hide();
    gameObject.setAnimation({
      animation: animation,
      callback: function() {
        gameObject.setPosition(position);
        var css = {
          "grid-row": gameObject.position.y + "/auto",
          "grid-column": gameObject.position.x + "/auto",
          top: 'unset',
          left: 'unset'
        }
        gameObject.getElement().css(css);
        //$originalObject.show();
      }
    });
    gameObject.animate();
  }
}
