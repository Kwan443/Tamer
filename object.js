import { Item_name } from './item.js';
export const State_id={
    STOP: 0 ,
    FIND_FOOD: 1 ,
    FIND_WATER: 2,
    FOLLOW: 3,
    RUN_AWAY: 4,
    FIND_SAME_ANIMAL: 5,
    RANDOM_MOVE: 6
}
export const Object_name = {
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
export const FoodID = {
    BONES: 1,
    GRASS: 2,
    MUSHROOM: 3,
    CARROTS: 4,
    SOULS: 5
};

export class Object {
    constructor(number = 0, x, y,texture,size,x_adding,y_adding,full_hp=100,hp=full_hp) {
        this.number = number;
        this.x = x;
        this.y = y;
        this.texture=texture;
        this.size=size;
        this.x_adding=x_adding;
        this.y_adding=y_adding;
        this.full_hp=full_hp;
        this.hp=hp;
    }

}
export class Material extends Object {
    constructor(number = 0, x, y, texture,size,x_adding,y_adding,getting_item_id= [],getting_item_number,full_hp=100) {
        super(number, x, y, texture,size,x_adding,y_adding,full_hp);
        this.getting_item_id=getting_item_id;
        this.getting_item_number=getting_item_number
    }
}

export class Tree1 extends Material {
    constructor(x, y) {
        super(Object_name.TREE1, x, y,'images/tree1.png',150,15,0,[Item_name.WOOD,Item_name.COCONUT],2);
    }
}

export class Tree2 extends Material {
    constructor(x, y) {
        super(Object_name.TREE2, x, y,'images/tree2.png',150,0,0,[Item_name.WOOD,Item_name.LEAVES],2);
    }
}

export class Grass extends Material {
    constructor(x, y) {
        super(Object_name.GRASS, x, y,'images/grass1.png',20,10,0,[Item_name.CARROT,Item_name.POTATO,Item_name.WHEAT],3);
    }
}

export class BerryBush extends Material {
    constructor(x, y) {
        super(Object_name.BERRYBUSH, x, y,'images/burrybush.png',60,15,0,[Item_name.BERRY],1);
    }
}
export class Animal extends Object {
    constructor(number = 0, x, y, texture,size,x_adding,y_adding, foodID = [],speed,full_hp=100) {
        super(number, x, y, texture,size,x_adding,y_adding,full_hp);
        this.foodID = foodID;
        this.movement=0;
        this.speed = speed;
        this.target_x=-1;
        this.target_y=-1;
        this.state = State_id.RANDOM_MOVE;
        this.path=[];
        this.index=0;
        this.changed=false;
    }
    search_target(map,animal_map,obj_map){
        const rows = map.length;
        const cols = map[0].length;
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        const queue = [{ x: this.x, y: this.y, distance: 0 }];
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1], 
            [-1, -1], [-1, 1], [1, -1], [1, 1] 
        ];
        while (queue.length > 0) {
            const current = queue.shift();
            if (this.state==State_id.FIND_FOOD&&obj_map[current.y][current.x]==Object_name.GRASS
                ||this.state==State_id.FIND_FOOD&&map[current.y][current.x]==1
                ||this.state==State_id.FIND_SAME_ANIMAL&&animal_map[current.y][current.x]==this.number) {
                this.target_x=current.x;
                this.target_y=current.y ;
                return true;
            }
            visited[current.x][current.y] = true;
            for (const [dx, dy] of directions) {
                const newX = current.x + dx;
                const newY = current.y + dy;
                let can_go=true;
                for(let i=-1;i<1;i++){
                for(let j=-1;j<1;j++){
                    if(obj_map[current.y]&&obj_map[current.y][current.x]){
                        if(obj_map[current.y][current.x]==Object_name.TREE1||obj_map[current.y][current.x]==Object_name.TREE2){
                            can_go=false;
                        }
                    }
                    if(map[current.y]&&map[current.y][current.x]){
                        if(map[current.y][current.x]==2){
                            can_go=false;
                        }
                    }
                }
                }
                if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && !visited[newX][newY] &&can_go) {
                    queue.push({ x: newX, y: newY, distance: current.distance + 1 });
                    visited[newX][newY] = true;
                }
            }
        }

        return false;
    }
    normal_movement(){
        if(this.state == State_id.RANDOM_MOVE){
            const randomNumber = Math.random(); 
            if (randomNumber > 0.99) {
                this.movement= Math.floor(Math.random() * 9); 
            } 
        }
    }
    change_move(){
        if(this.state == State_id.RANDOM_MOVE){
            this.movement= Math.floor(Math.random() * 9); 
        }
    }
    change_state(){
        this.state= Math.floor(Math.random() * 6); 
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
        }else if(this.movement==8){
            moveX= -this.speed;
            moveY= -this.speed;
        }
        this.normal_movement();
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
