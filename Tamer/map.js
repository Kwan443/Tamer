import * as PIXI from './pixi/pixi.mjs';

class PerlinNoise {
    constructor() {
        this.p = [];
        for (let i = 0; i < 256; i++) {
            this.p[i] = Math.floor(Math.random() * 256);
        }
        this.perm = this.p.concat(this.p);
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }

    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = this.fade(x);
        const v = this.fade(y);
        const A = this.perm[X] + Y;
        const B = this.perm[X + 1] + Y;
        return this.lerp(
            this.lerp(this.grad(this.perm[A], x, y), this.grad(this.perm[B], x - 1, y), u),
            this.lerp(this.grad(this.perm[A + 1], x, y - 1), this.grad(this.perm[B + 1], x - 1, y - 1), u),
            v
        );
    }
}

class Map {
    constructor(app) {
        this.app = app;
        this.mapContainer = new PIXI.Container();
        this.app.stage.addChild(this.mapContainer);

        this.perlin = new PerlinNoise();

        // Generate the map
        this.mapData = []
        this.mapData = this.generateMapData(800, 800);
        this.createMap(this.mapData);
    }

    generateMapData(width, height) {
        const mapData = [];
        const noiseScale = 0.1;

        for (let y = 0; y < height; y++) {
            mapData[y] = [];
            for (let x = 0; x < width; x++) {
                const noiseValue = this.perlin.noise(x * noiseScale, y * noiseScale);
                let tileType;

                if (noiseValue < 0.3) {
                    tileType = 0; 
                } else {
                    tileType = 1; 
                }

                mapData[y][x] = tileType;
            }
        }

        return mapData;
    }
    getMapData(){
        return this.mapData;
    }
    createMap(mapData) {
        const tileSize = 20;

        for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
                const tileType = mapData[y][x];
                let color;
                let map_detail = Math.random() < 0.1 ? 1 : 0;

                switch (tileType) {
                    case 0:
                        color =map_detail == 0?0x5c8852:0x888888; //grass
                        break;
                    case 1:
                        color = 0x4e82ff; // water
                        break;
                    case 2:
                        color = 0xe6b668; // sand
                        break;
                    case 3:
                        color =map_detail == 0?0x8c8c8c:0xffffff; //stone
                        break;
                    default:
                        color = 0xffffff; // Default color
                        break;
                }

                const tile = new PIXI.Graphics();
                tile.beginFill(color);
                tile.drawRect(x * tileSize, y * tileSize, tileSize, tileSize);
                tile.endFill();

                this.mapContainer.addChild(tile);
            }
        }
    }
}

export default Map;