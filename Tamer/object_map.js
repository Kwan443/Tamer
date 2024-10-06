import * as PIXI from './pixi/pixi.mjs';
import * as OBJ from './object.js';

export class ObjectMap {
	constructor(width, height, app) {
		this.width = width;
		this.height = height;
		this.app = app;
		this.map = this.createEmptyMap();
		this.container = new PIXI.Container();
		this.app.stage.addChild(this.container);
	}

	createEmptyMap() {
		return Array(this.height).fill().map(() => Array(this.width).fill(null));
	}

	generateObjects() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const random_num=Math.random();
				if (random_num < 0.001) {
					this.addObject(new OBJ.Tree1(x, y));
				} else if (random_num < 0.002) {
					this.addObject(new OBJ.Tree2(x, y));
				}else if (random_num < 0.003) {
					this.addObject(new OBJ.BerryBush(x, y));
				}else if (random_num < 0.01) {
					this.addObject(new OBJ.Grass(x, y));
				}
			}
		}
	}

	addObject(gameObject) {
		this.map[gameObject.y][gameObject.x] = gameObject.number;
	}

	removeObject(x, y) {
		const gameObject = this.map[y][x];
		if (gameObject) {
			this.container.removeChild(gameObject.sprite);
			this.map[y][x] = 0;
		}
	}
}