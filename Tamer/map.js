class Map {
    constructor(app) {
        this.app = app;
        this.mapContainer = new PIXI.Container();
        this.app.stage.addChild(this.mapContainer);

        // Generate the map
        const mapData = this.generateMapData(800, 800);
        this.createMap(mapData);

    }

    generateMapData(width, height) {
        const mapData = [];
        for (let y = 0; y < height; y++) {
            mapData[y] = [];
            for (let x = 0; x < width; x++) {
                const tileType = Math.random() < 0.1 ? 1 : 0;
                mapData[y][x] = tileType;
            }
        }
        return mapData;
    }

    createMap(mapData) {
        const tileSize = 20;
    
        for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
                const tileType = mapData[y][x];
    
                const tile = new PIXI.Graphics();
                let color;
                if (tileType === 0) {
                    color = 0x5c8852; //green
                } else {
                    color = 0x888888; // grey
                }
                tile.beginFill(color);
                tile.drawRect(x * tileSize, y * tileSize, tileSize, tileSize);
                tile.endFill();
    
                this.mapContainer.addChild(tile); 
            }
        }
    }

}

export default Map;