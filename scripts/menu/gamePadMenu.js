class GamePadMenu {
  constructor(controller) {
    var Keyboard = {
      LEFT: 37,
      RIGHT: 39,
      UP: 38,
      DOWN: 40
    };

    this._controller = controller;
    var _this = this;
    $(document).on("keydown", function(e) {
      var code = e.keyCode ? e.keyCode : e.which;
      switch (code) {
        case Keyboard.LEFT:
          e.preventDefault();
          _this.move("moveLeft");
          break;
        case Keyboard.RIGHT:
          e.preventDefault();
          _this.move("moveRight");
          break;
        case Keyboard.UP:
          _this.move("moveUp");
          break;
        case Keyboard.DOWN:
          _this.move("moveDown");
          break;
        default:
          break;
      }
    });
  }

  move(id) {
    this._controller.move(id);
  }
}
