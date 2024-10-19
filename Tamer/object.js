import * as PIXI from './pixi/pixi.mjs';
const Object_name = {
    TREE1: 1,
    TREE2: 2,
    GRASS: 3,
    BERRYBUSH: 4,
    DOG: 5,
    COW: 6,
    PIG: 7,
    RABBIT: 8,
    SHEEP: 9,
    SOUL_FOX: 10,
    PLAYER: 11
};
const FoodID = {
    BONES: 1,
    GRASS: 2,
    MUSHROOM: 3,
    CARROTS: 4,
    SOULS: 5
};

export class MapObject {
    constructor(number = 0, x, y,texture,size,x_adding,y_adding) {
        this.number = number;
        this.x = x;
        this.y = y;
        this.texture=texture;
        this.size=size;
        this.x_adding=x_adding;
        this.y_adding=y_adding;
    }

    update() {
        // Add any update logic for MapObject here
    }
}

export class Tree1 extends MapObject {
    constructor(x, y) {
        super(Object_name.TREE1, x, y,'images/tree1.png',150,15,0);
    }
}

export class Tree2 extends MapObject {
    constructor(x, y) {
        super(Object_name.TREE2, x, y,'images/tree2.png',150,0,0);
    }
}

export class Grass extends MapObject {
    constructor(x, y) {
        super(Object_name.GRASS, x, y,'images/grass1.png',20,10,0);
    }
}

export class BerryBush extends MapObject {
    constructor(x, y) {
        super(Object_name.BERRYBUSH, x, y,'images/burrybush.png',60,15,0);
    }
}
export class Animal extends MapObject {
    constructor(number = 0, x, y, texture,size,x_adding,y_adding, foodID = [],speed) {
        super(number, x, y, texture,size,x_adding,y_adding);
        this.foodID = foodID;
        this.movement=0;
        this.speed = speed;
    }

    move() {
        let moveX=0, moveY=0;
        if(this.movement==1){
            moveY= -this.speed;
        }
        else if(this.movement==2){
            moveX= +this.speed;
            moveY = -this.speed;
        }else if(this.movement==3){
            moveX= this.speed;
        }else if(this.movement==4){
            moveX= this.speed;
            moveY= this.speed;
        }else if(this.movement==5){
            moveY= this.speed;
        }else if(this.movement==6){
            moveX= -this.speed;
            moveY= this.speed;
        }else if(this.movement==7){
            moveX= -this.speed;
        }else if(this.movement==0){
            moveX= -this.speed;
            moveY= -this.speed;
        }
        
        const randomNumber = Math.random(); 
        if (randomNumber > 0.8) {
            this.movement= Math.floor(Math.random() * 8); 
        }
        return { moveX, moveY };
    }
}
export class Dog extends Animal {
    constructor( x, y) {
        super(Object_name.DOG, x, y, 'images/dog.png',40,0,0,  [FoodID.BONES],3);
    }

}

export class Cow extends Animal {
    constructor(x, y) {
        super(Object_name.COW, x, y, 'images/cow.png',80,0,0, [FoodID.GRASS],3);
    }

}

export class Pig extends Animal {
    constructor(x, y) {
        super(Object_name.PIG, x, y, 'images/pig.png',60,0,0, [FoodID.MUSHROOM],3);
    }

}

export class Rabbit extends Animal {
    constructor(x, y) {
        super(Object_name.RABBIT, x, y, 'images/rabbit.png',20,0,0, [FoodID.CARROTS],3);
    }

}

export class Sheep extends Animal {
    constructor(x, y) {
        super(Object_name.SHEEP, x, y, 'images/sheep.png',60,0,0, [FoodID.GRASS],3);
    }

}

export class SoulFox extends Animal {
    constructor(x, y) {
        super(Object_name.SOUL_FOX, x, y, 'images/soul_fox.png',100,0,0, [FoodID.SOULS],3);
    }

}
export class Player extends Animal{
    constructor(x, y) {
        super(Object_name.PLAYER, x, y,'images/player.png',100,0,0, [],3);
    }
}
