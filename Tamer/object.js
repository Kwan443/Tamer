import * as PIXI from './pixi/pixi.mjs';
const object_name = {
    TREE1: 1,
    TREE2: 2,
    GRASS: 3,
    BERRYBUSH: 4
};

export class MapObject {
    constructor(number = 0, x, y) {
        this.number = number;
        this.x = x;
        this.y = y;
    }

    update() {
        // Add any update logic for MapObject here
    }
}

export class Tree1 extends MapObject {
    constructor(x, y) {
        super(object_name.TREE1, x, y);
    }
}

export class Tree2 extends MapObject {
    constructor(x, y) {
        super(object_name.TREE2, x, y);
    }
}

export class Grass extends MapObject {
    constructor(x, y) {
        super(object_name.GRASS, x, y);
    }
}

export class BerryBush extends MapObject {
    constructor(x, y) {
        super(object_name.BERRYBUSH, x, y);
    }
}

