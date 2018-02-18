class GameObject {
  constructor(type, name) {
    GameObject.prototype.lastId++;
    this.id = GameObject.prototype.lastId;
    this.type = type;
    this.name = name;
    this.position = { x: -1, y: -1 };
    this.imgSrc = this.getSrcImg();
    this.animation = {};
    this.$object = this.getTemplate();
  }

  //
  //  object functions
  //
  //
  getSrcImg() {
    return "assets/" + this.type + ".png";
  }

  getTemplate() {
    let $template = $(
      '<div id="' +
        this.id +
        '" class="gameObject ' +
        this.type +
        '"><img src="' +
        this.imgSrc +
        '" />' +
        '<span class="tooltiptext">' +
        this.name +
        "</span>" +
        "</div>"
    );
    switch (this.type) {
      case "zombie":
        break;
      case "hero":
        break;
      case "item":
        break;
      case "gui":
        break;
      case "anim":
        break;
      default:
    }
    return $template.clone();
  }

  setPosition(position) {
    this.position = position;
  }

  addToBoard(gameController) {
    gameController.addObject(this);
  }

  removeFromBoard(gameController) {
    gameController.removeObject(this);
  }

  move(gameController) {
    gameController.moveObject(this, position);
  }

  setAnimation(animation){
    this.animation = animation;
  }

  getElement(){
    return $('.gameObject#'+this.id);
  }

  animate() {
    this.isAnimated = true;
    let _this = this;
    let options = {
      'complete':function(){
        _this.animation.callback();
        _this.isAnimated = false;
      },
      'duration':'1s'
    }
    $('.gameObject#' + this.id + "").animate(this.animation.animation,options);
  }

  //
  //  Class functions
  //
  //
  static newObject(type, name) {
    return new GameObject(type, name);
  }

  static resetIds(id) {
    GameObject.prototype.lastId = id ? id : -1;
  }
}

GameObject.prototype.lastId = -1;
