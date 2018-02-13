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
        let xtile = Math.floor(e.offsetX / _this.map.tsize)
        let ytile = Math.floor(e.offsetY / _this.map.tsize)
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
      $gameboard.on('mousewheel', function(event) {        
          if (event.originalEvent.wheelDelta >= 0) {
              zoomValue*=1.15;
          }
          else {
              zoomValue/=1.15;
          }
          $gameboard.css("transform", 'rotateX(-60deg) rotateZ(-45deg)'
                          +'scale(' + zoomValue + ', '+ zoomValue + ')');
      });
    }

    showActors(){
      $('.hero').show();
      $('.zombie').show();
      $('.gameObject').click(function(e){
        let selection = e.currentTarget;
        console.log('selected :'+selection.id);
        gameController.selectedObject = selection;
      })
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