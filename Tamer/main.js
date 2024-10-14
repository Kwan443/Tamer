import Map from './map.js';
import * as PIXI from './pixi/pixi.mjs';
import { ObjectMap } from './object_map.js';
import * as OBJ from './object.js';
async function drawobj(x, y, textureSrc, scale,app) {
    const obj_texture = await PIXI.Assets.load(textureSrc);
    obj_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    const obj_sprite = PIXI.Sprite.from(obj_texture);
    obj_sprite.scale.set(scale / obj_sprite.width);
    obj_sprite.anchor.set(0.5);
    obj_sprite.x = x;
    obj_sprite.y = y - obj_sprite.height / 2 + 20;;
    obj_sprite.interactive = true;
    app.stage.addChild(obj_sprite);
    return obj_sprite;
}
// function logMapDataNearPlayer(playerX, playerY, mapData, radius) {
//     const mapSize = mapData.length;
//     const startX = Math.max(0, playerX - radius);
//     const endX = Math.min(mapSize - 1, playerX + radius);
//     const startY = Math.max(0, playerY - radius);
//     const endY = Math.min(mapSize - 1, playerY + radius);

//     console.log('Map data near player:');
//     console.log('start');
//     for (let y = startY; y <= endY; y++) {
//         let row = '';
//         for (let x = startX; x <= endX; x++) {
//             if(mapData[y][x]!=null)
//                 row += mapData[y][x].number + ' ';
//             else    row += 0 + ' ';
//         }
//         console.log(y+':'+row);
//     }
//     console.log('end');
// }
function willCollide(x, y,objectMap,num,collisionAreaSize) {
    const player_x = Math.floor(x / 20);
    const player_y = Math.floor(y / 20);


    for (let i = -collisionAreaSize; i <= collisionAreaSize; i++) {
        for (let j = -collisionAreaSize; j <= collisionAreaSize; j++) {
            const currentX = player_x + i;
            const currentY = player_y + j;
            if (objectMap.map[currentY] && objectMap.map[currentY][currentX] && objectMap.map[currentY][currentX].number === num) {
                return true;
            }
        }
    }

    return false; // No collision detected
}
function willCollideWithTree(x, y,objectMap){
    return willCollide(x, y ,objectMap,1,1)||willCollide(x, y ,objectMap,2,1);
}
function willCollideWithAnimal(x, y,objectMap){
    return willCollide(x, y ,objectMap,5,0)||willCollide(x, y ,objectMap,6,0)||willCollide(x, y ,objectMap,7,0)||willCollide(x, y ,objectMap,8,0)||willCollide(x, y ,objectMap,9,0)||willCollide(x, y ,objectMap,10,0);
}
(async () => {
    const app = new PIXI.Application({
        width: window.innerWidth*1.5 ,
        height: window.innerHeight*1.5,
        resolution: 10,
    });
    app.stage.scale.set(2);
    await app.init({ background: '#000000', resizeTo: window });
    document.body.appendChild(app.view);
    const grassContainer = new PIXI.Container();
    app.stage.addChild(grassContainer);
    
    const map = new Map(app);
    
    // make a players
    const player = await drawobj(Math.random() * 800 * 20, Math.random() * 800 * 20, 'images/player.png', 60, app); 

    //Math.random() * 800 * 20, Math.random() * 800 * 20
   
    //make a object map
    const objectMap = new ObjectMap(800, 800, app);
    const animalMap = new ObjectMap(800, 800, app);
    objectMap.generateObjects(); 
    const numOfEachAnimal = {
        Dog: 100,
        Cow: 100,
        Pig: 100,
        Rabbit: 100,
        Sheep: 100,
        SoulFox: 1
    };
    
    animalMap.generateAnimal(numOfEachAnimal);
    const obj_sprite = new Array(800).fill(null).map(() => new Array(800).fill(null));
    
    const animal_sprite = new Array(800).fill(null).map(() => new Array(800).fill(null));
    for (let y = 0; y < 800; y++) {
        for (let x = 0; x < 800; x++) {
            if(objectMap.map[y][x])
                animal_sprite[y][x] = await drawobj(x*20+objectMap.map[y][x].x_adding, y*20+objectMap.map[y][x].y_adding, objectMap.map[y][x].texture, +objectMap.map[y][x].size, app);
            if(animalMap.map[y][x])
                animal_sprite[y][x] = await drawobj(x*20+animalMap.map[y][x].x_adding, y*20+animalMap.map[y][x].y_adding, animalMap.map[y][x].texture, +animalMap.map[y][x].size, app);
        }
    }
    
    while(willCollideWithTree(player.x, player.y ,objectMap)||willCollideWithAnimal(player.x, player.y,animalMap)){
        player.x = Math.random() * 800 * 20;
        player.y = Math.random() * 800 * 20;
    }
    
    animalMap.addObject(new OBJ.Player(Math.floor(player.x / 20), Math.floor(player.y / 20)));
    console.log(animalMap.map[Math.floor(player.y / 20)][Math.floor(player.x / 20)].number);
    // make an item bar
    const itemBar = await drawobj(window.innerWidth / 4, window.innerHeight/2 - 40, 'images/item_bar.png', 1, app);
    itemBar.anchor.set(0.5, 1);
    itemBar.scale.set(0.3)
    // keyboard control
    const keys = {};
    const keyW = 87;
    const keyA = 65;
    const keyS = 83;
    const keyD = 68;
    window.addEventListener('keydown', (event) => {
        keys[event.keyCode] = true;
    });
    window.addEventListener('keyup', (event) => {
        keys[event.keyCode] = false;
    });
    let speed = 3;
    player.rotation=0;
    
    app.ticker.add(() => {
        let targetRotation = player.rotation;
        if (willCollide(player.x, player.y - speed, objectMap, 4, 1)) {
            speed = 1; 
        }
        
        let newX = player.x;
        let newY = player.y;
        
        if (keys[keyW]) {
            newY -= speed;
            targetRotation = keys[keyD] ? Math.PI / 4 : 0;
        } 
        if (keys[keyA]) {
            newX -= speed;
            targetRotation = keys[keyW] ? -Math.PI / 4 : -Math.PI / 2;
        } 
        if (keys[keyS]) {
            newY += speed;
            targetRotation = keys[keyA] ? -3 * Math.PI / 4 : Math.PI;
        } 
        if (keys[keyD]) {
            newX += speed;
            targetRotation = keys[keyS] ? 3 * Math.PI / 4 : keys[keyW] ? Math.PI / 4 : Math.PI / 2;
        }
        
        if (
            newX >= 0 && newX < 800 * 20 && 
            newY >= 0 && newY < 800 * 20 && 
            !willCollideWithTree(newX, newY, objectMap) && 
            !willCollideWithAnimal(newX, newY, animalMap) 
        ) {
            if (!animalMap.map[Math.floor(newY / 20)][Math.floor(newX / 20)]) {
                animalMap.moveObject(Math.floor(player.x / 20), Math.floor(player.y / 20), Math.floor(newX / 20), Math.floor(newY / 20));
            }
            
            player.x = newX;
            player.y = newY;
        
        }
            let delta = targetRotation - player.rotation;
            if (delta > Math.PI) {
                delta -= 2 * Math.PI;
            } else if (delta < -Math.PI) {
                delta += 2 * Math.PI;
            }
            const rotationSpeed = 0.05; 
            player.rotation += delta * rotationSpeed;

        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.pivot.x = player.x;
        app.stage.pivot.y = player.y;
        app.stage.position.x = app.screen.width / 2;
        app.stage.position.y = app.screen.height / 2;
        itemBar.x = player.x ;
        itemBar.y = player.y + window.innerHeight/4-40; 
        speed = 3;
    });

})();
