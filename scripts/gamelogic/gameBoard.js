class GameBoard {
    constructor(){
      var _this = this;
      this.tileImg = new Image();
      this.tileImg.onload = function(){
        _this.init();
      }
      this.tileImg.src = 'assets/tiles.png';
      this.mapPossition = {};
      _this.startOffset = -200;
      this.map = {
        cols: getGlobalCssProperty('tilesx'),
        rows: getGlobalCssProperty('tilesy'),
        tsize: getGlobalCssProperty('tilesize').slice(0,-2),// removes px from variable
        tiles: [
          1, 1, 3, 1, 1, 3, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 2, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 2, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 2, 1, 1, 1, 1,
          1, 1, 1, 1, 2, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1
        ],
        getTile(col, row) {
          return this.tiles[row * this.cols + col];
        }
      };
    }
    init() {
      var canvas = document.getElementById('tilemap');
      canvas.width = this.map.cols * this.map.tsize;
      canvas.height = this.map.rows * this.map.tsize;
      const ctx = canvas.getContext('2d');
      for (let c = 0; c < this.map.cols; c++) {
        for (let r = 0; r < this.map.rows; r++) {
          const tile = this.map.getTile(c, r);
          if (tile !== 0) { // 0 => empty tile
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
      this.setMapPosition(0,this.startOffset);
      this.initZoomListener(this);
      this.onWindowResize(this);
    }

    initSelectTileListener(_this){
      $('canvas').click(function(e){
        let xtile = Math.ceil(e.offsetX / _this.map.tsize)
        let ytile = Math.ceil(e.offsetY / _this.map.tsize)
        let tiletype = _this.map.getTile(xtile,ytile);
        let selection = e.currentTarget;
        if(gameController.selectedObject){
          console.log('Unselecting: '+ gameController.selectedObject.id);
          gameController.selectedObject = undefined;
        }        
        console.log('Clicked canvas. Pos: x: '+xtile+" y: "+ytile+", tileType: "+tiletype);
      })
    }

    initDragMapListener(_this){
      var mousePos = {};
      var mapPos = {};
      var dragging = false;
      $('.gameboard').mousedown(function(e) {
        e.preventDefault();
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
        mapPos.x = _this.mapPossition.x;
        mapPos.y = _this.mapPossition.y;
        dragging = true;
        $(this).addClass('move');
      }).mousemove(function(e) {
        e.preventDefault();
        if(dragging){
          _this.setMapPosition(mapPos.x + (e.pageX - mousePos.x), mapPos.y + (e.pageY - mousePos.y));
        }
      }).mouseup(function(e) {
        dragging = false;
        $(this).removeClass('move');
      }).mouseleave(function(e) {
        dragging = false;
        //$(this).removeClass('move');
      });
    }

    initZoomListener(_this){
      var zoomValue = 1;
      var $gameboard = $('.gameboard');
      var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
      $gameboard.on(mousewheelevt, function(e) {
          e.preventDefault();
          var delta = e.originalEvent ? e.originalEvent.wheelDelta : -e.detail;
          if (delta >= 0) {
              zoomValue*=1.15;
          }
          else {
              zoomValue/=1.15;
          }
          $gameboard.css("transform", 'rotateX(-60deg) rotateZ(-45deg)'
                          +'scale('+ zoomValue + ')');
      });
    }

    showActors(){
      var _this = this;
      $('.hero').show();
      $('.zombie').show();
      $('.gameObject').each(function(index,actor){
        _this.calcZindex($(actor));
      });
      $('.gameObject').click(function(e){
        let selection = e.currentTarget;
        console.log('selected :'+selection.id);
        gameController.selectedObject = selection;
      });
    }

    move(actor, command) {
      if (!actor) {
        console.log("No Actor selected.");
      } else {
        let direction = command.substr(4).toLowerCase();
        let $actor = $(actor);
        let xPos = $actor.css("grid-column-start")*1;
        let yPos = $actor.css("grid-row-start")*1;
        let offsetHeight = $actor.prop("offsetHeight");
        let offsetWidth = $actor.prop("offsetHeight");
        let newPos;
        switch (direction) {
          case "up":
            if (yPos > 1 && this.canMoveTo(xPos,yPos-1)) {
              yPos--;
              newPos = yPos + "/auto";
              $actor.css("grid-row", newPos);
            }
            break;
          case "down":
            if (yPos < getGlobalCssProperty("tilesy") &&
            this.canMoveTo(xPos,yPos+1)) {
              yPos++;
              newPos = yPos + "/auto";
              $actor.css("grid-row", newPos);
            }
            break;
          case "left":
            if (xPos > 1 && this.canMoveTo(xPos-1,yPos)) {
              xPos--;
              newPos = xPos + "/auto";
              $actor.css("grid-column", newPos);
            }
            break;
          case "right":
            if (xPos < getGlobalCssProperty("tilesx") &&
                this.canMoveTo(xPos+1,yPos)) {
              xPos++;
              newPos = xPos + "/auto";
              $actor.css("grid-column", newPos);             
            }
            break;
          default:
            break;
        }
        if (newPos) {
          this.calcZindex($actor);
          console.log(
            "Moved " + actor.id + " " + direction + " to (" + xPos + ", " + yPos + ')'
          );
        } else {
          console.log("Can't Move " + actor.id + " " + direction + ".");
        }
      }
    }

    canMoveTo(xTo,yTo){
      var canMove = true;
      $('.gameObject').each(function(index, actor){
        let x = $(actor).css('grid-column-start');
        let y = $(actor).css('grid-row-start');
        if ( (x == xTo && y == yTo))
          canMove = false;
      });
      return canMove;
    }

    calcZindex($actor){      
      let xPos = $actor.css("grid-column-start")*1;
      let yPos = $actor.css("grid-row-start")*1;
      //let sign = xPos != yPos ? yPos*1 < xPos*1 : 
      $actor.css('z-index', 20 + (yPos*10 - (this.map.cols*1 + xPos*1)));
    }

    stopGame(){
      $('.hero').hide();
      $('.hero').unbind("click");
      $('.zombie').hide();
      $('.zombie').unbind("click");
    }

    nextTurn(){
        console.log("nextTurn");
    }

    onWindowResize(_this){
      $(window).resize(function(event) {
        _this.setMapPosition(0,_this.startOffset);
      });
    }

    setMapPosition(x,y,animate){
      this.mapPossition.x = x;
      this.mapPossition.y = y;
    
      var $el = $('.gameboard');
      $el[(animate)? 'animate' : 'css']({
        left: ((window.innerWidth/2) - $el.width()/2) + x,
        top: ((window.innerHeight/2) - $el.height()/2) + y
      });
    }
  };