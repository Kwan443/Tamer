import * as OBJ from './object.js';

export class ObjectMap {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.map = this.createEmptyMap();
	}

	createEmptyMap() {
		return Array(this.height).fill().map(() => Array(this.width).fill(null));
	}

	generateObjects() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const random_num = Math.random();
				if (random_num < 0.001) {
					this.addObject(new OBJ.Tree1(x, y));
				} else if (random_num < 0.002) {
					this.addObject(new OBJ.Tree2(x, y));
				} else if (random_num < 0.003) {
					this.addObject(new OBJ.BerryBush(x, y));
				} else if (random_num < 0.01) {
					this.addObject(new OBJ.Grass(x, y));
				}
			}
		}
	}

	generateAnimal(numOfEachAnimal) {
		const animals = [
			OBJ.Dog,
			OBJ.Cow,
			OBJ.Pig,
			OBJ.Rabbit,
			OBJ.Sheep,
			OBJ.SoulFox
		];
	
		animals.forEach(animalClass => {
			const numToGenerate = numOfEachAnimal[animalClass.name] || 0;
			for (let i = 0; i < numToGenerate; i++) {
				while (true) {
					const x = Math.floor(Math.random() * this.width);
					const y = Math.floor(Math.random() * this.height);
	
					if (this.map[y][x] === null) {
						this.addObject(new animalClass(x, y));
						break;
					}
				}
			}
		});
	}

	addObject(gameObject) {
		this.map[gameObject.y][gameObject.x] = gameObject;
	}

	removeObject(x, y) {
		const gameObject = this.map[y][x];
		if (gameObject) {
			this.map[y][x] = null;
		}
	}
	moveObject(x, y,newX,neY){
		const gameObject = this.map[y][x];
		if (gameObject) {
			this.map[neY][newX] = this.map[y][x];
			this.map[y][x] = null;
		}
	}
}