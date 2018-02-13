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
    let actor = this._selectedObject;
    if (!actor) {
      console.log("No Actor selected.");
    } else {
      let direction = command.substr(4).toLowerCase();
      let $actor = $(actor);
      let xPos = $actor.css("grid-column-start");
      let yPos = $actor.css("grid-row-start");
      let offsetHeight = $actor.prop("offsetHeight");
      let offsetWidth = $actor.prop("offsetHeight");
      let tileSize = getGlobalCssProperty("tilesize").slice(0, -2);
      let newPos;
      switch (direction) {
        case "up":
          if (yPos > 1) {
            yPos--;
            newPos = yPos + "/auto";
            $actor.css("grid-row", newPos);
          }
          break;
        case "down":
          if (yPos < getGlobalCssProperty("tilesy")) {
            yPos++;
            newPos = yPos + "/auto";
            $actor.css("grid-row", newPos);
          }
          break;
        case "left":
          if (xPos > 1) {
            xPos--;
            newPos = xPos + '/auto';
            $actor.css("grid-column", newPos);
          }
          break;
        case "right":
          if (xPos < getGlobalCssProperty("tilesx")) {
            xPos++;
            newPos = xPos + "/auto"
            $actor.css("grid-column", newPos);
          }
          break;
        default:
          break;
      }
      if (newPos) {
        console.log(
          "Moved " + actor.id + " " + direction + " to x:" + xPos + " y:" + yPos
        );
      } else {
        console.log("Can't Move" + actor.id + " " + direction + ".");
      }
    }
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
