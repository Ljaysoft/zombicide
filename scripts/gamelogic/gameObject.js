class GameObject {
  constructor(type, name, position, imgSrc, $object) {
    GameObject.prototype.lastId++;
    this.id = GameObject.prototype.lastId;
    this.type = type ? type : GameObject.getTypes().UNDEFINED;
    this.name = name ? name : "UnKnownEntity";
    this.position = position
      ? position
      : {
          xTile: -1,
          yTile: -1
        };
    this.imgSrc = imgSrc ? imgSrc : "assets/unkownEntity.png";
    this.$object = $object ? $object : GameObject.getTemplate(this);
  }

  static getTemplate(gameobject) {
    let $template = $('<div class="gameObject' + gameobject.type + '><img src="' + gameobject.imgSrc + '" /></div>');
    let types = GameObject.getTypes();
    switch (gameobject.type) {
      case types.HERO:
        break;
      case types.ZOMBIE:
        break;
      default:
    }
    return $template.clone();
  }

  static newObject(type, name, position, imgSrc, $object) {
    return new GameObject(type, name, position, imgSrc, $object);
  }

  static getTypes() {
    return {
      UNDEFINED: "",
      HERO: "hero",
      ZOMBIE: "zombie"
    };
  }
}

GameObject.prototype.lastId = 0;
