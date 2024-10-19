
const Item_name = {
    WOOD: 1,
    BERRY:2
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
}