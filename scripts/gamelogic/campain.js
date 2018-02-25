class Campain{
    constructor(){
        //init game
        this.heroes = [];
        this.zombies = [];
        this.rooms = [];
        this.turnNumber = 1;
        this.actorTurn = null;
        this.doors = [];
        this.walls = [];
        this.objectives = [];
    }
    addHero(hero){

    }

    spawnZombies(){
        
    }

    finishHerosTurn(){

    }

    finishZombiesTurn(){
        this.turnNumber++;
    }

    openDoor(door){

    }

}
Door.prototype.doorId = -1;
class Door{
    constructor(){
        this.id = Door.prototype.doorId
        Door.prototype.doorId++;
        this.opened = false;
        this.fromTile = {x:-1,y:-1};
        this.toTile = {x:-1,y:-1};
    }
}