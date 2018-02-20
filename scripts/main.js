var game;
var gameController;
var navMenu;
var gamePadMenu;

window.onload = function() {
  initPlugins();
  if (!$("div:last").hasClass("gamePadMenu")) $("div:last").remove();
  game = new GameBoard();
  gameController = new GameController(game);
  navMenu = new NavMenu(gameController);
  gamePadMenu = new GamePadMenu(gameController);
};
