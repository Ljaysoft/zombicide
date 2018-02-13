class NavMenu {
  constructor(controller) {
    this._controller = controller;
  }
  onButtonClicked(e) {
    switch (e.id) {
      case "startGame":
        this._controller.startGame();
        break;
      case "resetGame":
        this._controller.stopGame();
        break;
      case "nextTurn":
        this._controller.nextTurn();
        break;
      default:
        break;
    }
  }
}
