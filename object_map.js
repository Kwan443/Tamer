import * as OBJ from './object.js';

export class ObjectMap {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.map = this.createEmptyMap();
		this.mapdata=Array(this.height).fill().map(() => Array(this.width).fill(0));

	}
	createEmptyMap() {
		return Array(this.height).fill().map(() => Array(this.width).fill(null));
	}
	generateObjects(base_map) {
		const mapData = base_map.getMapData();
	
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const tileType = mapData[y][x];
				
				this.mapdata[y][x]=0;
				if (tileType === 0) {
					const random_num = Math.random();
					if (random_num < 0.001) {
						this.addObject(new OBJ.Tree1(x, y));
						this.mapdata[y][x]=OBJ.Object_name.TREE1;
					} else if (random_num < 0.002) {
						this.addObject(new OBJ.Tree2(x, y));
						this.mapdata[y][x]=OBJ.Object_name.TREE2;
					} else if (random_num < 0.003) {
						this.addObject(new OBJ.BerryBush(x, y));
						this.mapdata[y][x]=OBJ.Object_name.BERRYBUSH;
					} else if (random_num < 0.01) {
						this.addObject(new OBJ.Grass(x, y));
						this.mapdata[y][x]=OBJ.Object_name.GRASS;
					}
				}
				else if(tileType === 5){
					const random_num = Math.random();
					if (random_num < 0.005) {
						this.addObject(new OBJ.Cactus(x, y));
						this.mapdata[y][x]=OBJ.Object_name.CACTUS;
					}
				}else if(tileType === 6){
					const random_num = Math.random();
					if (random_num < 0.005) {
						this.addObject(new OBJ.Ice_crystal(x, y));
						this.mapdata[y][x]=OBJ.Object_name.ICE_CRYSTAL;
					}
				}
			}
		}
	}
	generateObjects_by_mapData(){
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.mapdata[y][x]==OBJ.Object_name.TREE1) {
					this.addObject(new OBJ.Tree1(x, y));
				} else if (this.mapdata[y][x]==OBJ.Object_name.TREE2) {
					this.addObject(new OBJ.Tree2(x, y));
				} else if (this.mapdata[y][x]==OBJ.Object_name.BERRYBUSH) {
					this.addObject(new OBJ.BerryBush(x, y));
				} else if (this.mapdata[y][x]==OBJ.Object_name.GRASS) {
					this.addObject(new OBJ.Grass(x, y));
				}else if (this.mapdata[y][x]==OBJ.Object_name.CACTUS) {
					this.addObject(new OBJ.Cactus(x, y));
				}else if (this.mapdata[y][x]==OBJ.Object_name.ICE_CRYSTAL) {
					this.addObject(new OBJ.Ice_crystal(x, y));
				}
			}
		}
	}generateAnimal_by_mapData(){
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.mapdata[y][x]==OBJ.Object_name.DOG) {
					this.addObject(new OBJ.Dog(x, y));
				} else if (this.mapdata[y][x]==OBJ.Object_name.COW) {
					this.addObject(new OBJ.Cow(x, y));
				} else if (this.mapdata[y][x]==OBJ.Object_name.PIG) {
					this.addObject(new OBJ.Pig(x, y));
				} else if (this.mapdata[y][x]==OBJ.Object_name.RABBIT) {
					this.addObject(new OBJ.Rabbit(x, y));
				}else if (this.mapdata[y][x]==OBJ.Object_name.SHEEP) {
					this.addObject(new OBJ.Sheep(x, y));
				}else if (this.mapdata[y][x]==OBJ.Object_name.SOUL_FOX) {
					this.addObject(new OBJ.SoulFox(x, y));
				}else if (this.mapdata[y][x]==OBJ.Object_name.PLAYER) {
					this.addObject(new OBJ.Player(x, y));
					console.log("make player")
				}
			}
		}
	}
	generateAnimal(numOfEachAnimal,base_map) {
		const mapData = base_map.getMapData();
		const animals = [
			OBJ.Dog,
			OBJ.Cow,
			OBJ.Pig,
			OBJ.Rabbit,
			OBJ.Sheep,
			OBJ.SoulFox,
			OBJ.Player
		];
	
		animals.forEach(animalClass => {
			const numToGenerate = numOfEachAnimal[animalClass.name] || 0;
			for (let i = 0; i < numToGenerate; i++) {
				while (true) {
					const x = Math.floor(Math.random() * this.width);
					const y = Math.floor(Math.random() * this.height);
					const tileType = mapData[y][x];
					if (this.map[y][x] === null&&tileType!=2) {
						this.addObject(new animalClass(x, y));
						break;
					}
				}
			}
		});
	}

	addObject(gameObject) {
		this.map[gameObject.y][gameObject.x] = gameObject;
		this.mapdata[gameObject.y][gameObject.x] = gameObject.number
		if (this.mapdata[gameObject.y][gameObject.x]==OBJ.Object_name.PLAYER) {
			console.log("make player")
		}
	}

	removeObject(x, y) {
		const gameObject = this.map[y][x];
		if (gameObject) {
			this.map[y][x] = null;
		}
	}
	moveObject(x, y,newX,newY){
		const gameObject = this.map[y][x];
		if (gameObject) {
			this.map[newY][newX] = this.map[y][x];
			this.mapdata[newY][newX] = this.mapdata[y][x];
			this.map[y][x] = null;
			this.mapdata[y][x]=null;
			this.map[newY][newX].x=newX;
			this.map[newY][newX].y=newY;
		}
	}
}