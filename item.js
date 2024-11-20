
export const Item_name = {
    WOOD: 1,
    BERRY:2,
    LEAVES:3,
    COCONUT:4,
    CARROT:5,
    POTATO:6,
    WHEAT:7,
    FRUIT:8
};
export class Item {
    constructor(number = 0,texture,size,x_adding,y_adding) {
        this.number = number;
        this.texture=texture;
        this.size=size;
        this.x_adding=x_adding;
        this.y_adding=y_adding;
    }
}export class Wood extends Item {
    constructor() {
        super(Item_name.WOOD,'images/wood.png',40,0,0);
    }
}export class Berry extends Item {
    constructor() {
        super(Item_name.BERRY,'images/berry.png',30,0,0);
    }
}export class Leaves extends Item {
    constructor() {
        super(Item_name.LEAVES,'images/leaves.png',20,0,0);
    }
}export class Coconut extends Item {
    constructor() {
        super(Item_name.COCONUT,'images/coconut.png',30,0,0);
    }
}export class Carrot extends Item {
    constructor() {
        super(Item_name.CARROT,'images/carrot.png',30,0,0);
    }
}export class Potato extends Item {
    constructor() {
        super(Item_name.POTATO,'images/potato.png',30,0,0);
    }
}export class Wheat extends Item {
    constructor() {
        super(Item_name.WHEAT,'images/wheat.png',30,0,0);
    }
}export class Fruit extends Item {
    constructor() {
        super(Item_name.WHEAT,'images/fruit.png',60,0,0);
    }
}