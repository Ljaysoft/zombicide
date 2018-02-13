class GameBoard {
    constructor(){
      var _this = this;
      this.tileImg = new Image();
      this.tileImg.onload = function(){
        _this.init();
      }
      this.tileImg.src = 'assets/tiles.png';
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
      var _this = this;
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
  };