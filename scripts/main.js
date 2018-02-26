var game;
var gameController;
var navMenu;
var gamePadMenu;
var gameEvents;

window.onload = function() {
  initPlugins();
  if (!$("div:last").hasClass("gamePadMenu")) $("div:last").remove();
  gameboard = new GameBoard();
  gameController = new GameController(gameboard);
  navMenu = new NavMenu(gameController);
  gamePadMenu = new GamePadMenu(gameController);
  gameEvents = new GameEvents(gameController);
};
