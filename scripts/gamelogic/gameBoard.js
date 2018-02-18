class GameBoard {
  constructor() {
    var _this = this;
    this.tileImg = new Image();
    this.tileImg.onload = function() {
      _this.init();
    };
    this.tileImg.src = "assets/tiles.png";
    this.mapPossition = {};
    _this.startOffset = -200;
    this.gameObjects = [];
    this.map = {
      cols: getGlobalCssProperty("tilesx"),
      rows: getGlobalCssProperty("tilesy"),
      tsize: getGlobalCssProperty("tilesize").slice(0, -2), // removes px from variable
      tiles: [
        1,
        1,
        3,
        1,
        1,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      getTile(col, row) {
        return this.tiles[row * this.cols + col];
      }
    };
  }
  init() {
    var canvas = document.getElementById("tilemap");
    canvas.width = this.map.cols * this.map.tsize;
    canvas.height = this.map.rows * this.map.tsize;
    const ctx = canvas.getContext("2d");
    for (let c = 0; c < this.map.cols; c++) {
      for (let r = 0; r < this.map.rows; r++) {
        const tile = this.map.getTile(c, r);
        if (tile !== 0) {
          // 0 => empty tile
          ctx.drawImage(
            this.tileImg, // image
            (tile - 1) * this.map.tsize, // source x
            0, // source y
            this.map.tsize, // source width
            this.map.tsize, // source height
            c * this.map.tsize, // target x
            r * this.map.tsize, // target y
            this.map.tsize, // target width
            this.map.tsize // target height
          );
        }
      }
    }

    this.initSelectTileListener(this);
    this.initDragMapListener(this);
    this.setMapPosition(0, this.startOffset);
    this.initZoomListener(this);
    this.onWindowResize(this);
  }

  initSelectTileListener(_this) {
    $("canvas").click(function(e) {
      let xtile = Math.ceil(e.offsetX / _this.map.tsize);
      let ytile = Math.ceil(e.offsetY / _this.map.tsize);
      let tiletype = _this.map.getTile(xtile, ytile);
      let selection = e.currentTarget;
      if (gameController.selectedObjectId>=0) {
        console.log("Unselecting: " + _this.gameObjects[gameController.selectedObjectId].name);
        gameController.selectedObjectId = -1;
      }
      console.log("Clicked canvas. Pos: x: " + xtile + " y: " + ytile + ", tileType: " + tiletype);
    });
  }

  initDragMapListener(_this) {
    var mousePos = {};
    var mapPos = {};
    var dragging = false;
    $(".gameBoard")
      .mousedown(function(e) {
        e.preventDefault();
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
        mapPos.x = _this.mapPossition.x;
        mapPos.y = _this.mapPossition.y;
        dragging = true;
        $(this).addClass("move");
      })
      .mousemove(function(e) {
        e.preventDefault();
        if (dragging) {
          _this.setMapPosition(mapPos.x + (e.pageX - mousePos.x), mapPos.y + (e.pageY - mousePos.y));
        }
      })
      .mouseup(function(e) {
        dragging = false;
        $(this).removeClass("move");
      })
      .mouseleave(function(e) {
        dragging = false;
        //$(this).removeClass('move');
      });
  }

  initZoomListener(_this) {
    var zoomValue = 1;
    var $gameboard = $(".gameBoard");
    var mousewheelevt = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel";
    $gameboard.on(mousewheelevt, function(e) {
      e.preventDefault();
      var delta = e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -e.detail;
      if (delta >= 0) {
        zoomValue *= 1.15;
      } else {
        zoomValue /= 1.15;
      }
      $gameboard.css("transform", "rotateX(-60deg) rotateZ(-45deg)" + "scale(" + zoomValue + ")");
    });
  }

  showActors() {
    var _this = this;
    var bob = GameObject.newObject("hero", "bob");
    bob.setPosition({ x: 1, y: 1 });       
    this.gameObjects.push(bob);
    $(".gameBoard").append(bob.$object.clone());

    var marcel = GameObject.newObject("zombie", "marcel");
    marcel.setPosition({ x: 5, y: 4 });
    this.gameObjects.push(marcel);
    $(".gameBoard").append(marcel.$object.clone());
    
    this.gameObjects.forEach(element => {
      let $element = element.getElement();
      this.place(element);
      _this.calcZindex($element);
      $element.click(function(e) {
        let selection = e.currentTarget.id;
        console.log("selected :" + _this.gameObjects[selection].name);
        gameController.selectedObjectId = selection;
      });
    });
  }

  place(gameObject, position) {
    let $object = gameObject.getElement();
    let pos = position ? position : gameObject.position;
    if (position) gameObject.setPosition(pos);
    $object.css({
      "display":"grid",
      "grid-column": pos.y + "/auto",
      "grid-row": pos.x + "/auto"
    });
  }

  move(objectId, command) {
    if (objectId<0) {
      console.log("No Actor selected.");
    } else {
      let direction = command.substr(4).toLowerCase();
      let $object = $(".gameObject#" + objectId);
      let curPos = {
        x: $object.css("grid-column-start") * 1,
        y: $object.css("grid-row-start") * 1
      };
      let newPos = false;
      switch (direction) {
        case "up":
          if (curPos.y > 1 && this.canMoveTo(curPos.x, curPos.y - 1)) {
            // using grid
            curPos.y--;
            newPos = true;
          }
          break;
        case "down":
          if (curPos.y < getGlobalCssProperty("tilesy") && this.canMoveTo(curPos.x, curPos.y + 1)) {
            curPos.y++;
            newPos = true;
          }
          break;
        case "left":
          if (curPos.x > 1 && this.canMoveTo(curPos.x - 1, curPos.y)) {
            curPos.x--;
            newPos = true;
          }
          break;
        case "right":
          if (curPos.x < getGlobalCssProperty("tilesx") && this.canMoveTo(curPos.x + 1, curPos.y)) {
            curPos.x++;
            newPos = true;
          }
          break;
        default:
          break;
      }
      if (newPos) {
        gameController.moveObject(this.gameObjects[objectId],curPos);
        this.calcZindex($object);
        console.log("Moved " + objectId + " " + direction + " to (" + curPos.x + ", " + curPos.y + ")");
      } else {
        console.log("Can't Move " + objectId + " " + direction + ".");
      }
    }
  }

  canMoveTo(xTo, yTo) {
    var canMove = true;
    $(".gameObject").each(function(index, actor) {
      let x = $(actor).css("grid-column-start");
      let y = $(actor).css("grid-row-start");
      if (x == xTo && y == yTo) canMove = false;
    });
    return canMove;
  }

  calcZindex($actor) {
    let pos = {
      x: $actor.css("grid-column-start") * 1,
      y: $actor.css("grid-row-start") * 1
    };
    //let sign = pos.x != pos.y ? pos.y*1 < pos.x*1 :
    $actor.css("z-index", 20 + (pos.y * 10 - (this.map.cols * 1 + pos.x * 1)));
  }

  stopGame() {
    $(".hero").remove();
    $(".zombie").remove();
    this.gameObjects = [];
    GameObject.resetIds();
  }

  nextTurn() {
    console.log("nextTurn");
  }

  onWindowResize(_this) {
    $(window).resize(function(event) {
      _this.setMapPosition(0, _this.startOffset);
    });
  }

  setMapPosition(x, y, animate) {
    this.mapPossition.x = x;
    this.mapPossition.y = y;

    var $el = $(".gameBoard");
    $el[animate ? "animate" : "css"]({
      left: window.innerWidth / 2 - $el.width() / 2 + x,
      top: window.innerHeight / 2 - $el.height() / 2 + y
    });
  }
}
