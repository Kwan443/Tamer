import Map from './map.js';
import * as PIXI from './pixi/pixi.mjs';
import { ObjectMap } from './object_map.js';
import * as OBJ from './object.js';
import * as ITEM from './item.js';
import { ItemBox } from './item_box.js';
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
function willCollide(x, y,objectMap,num,collisionAreawidth,collisionAreaheight=collisionAreawidth) {
    const x_new = Math.floor(x / 20);
    const y_new = Math.floor(y / 20);


    for (let i = -collisionAreawidth; i <= collisionAreawidth; i++) {
        for (let j = -collisionAreaheight; j <= collisionAreaheight; j++) {
            const currentX = x_new + i;
            const currentY = y_new + j;
            if (objectMap.map[currentY] && objectMap.map[currentY][currentX] && objectMap.map[currentY][currentX].number === num) {
                return true;
            }
        }
    }

    return false; 
}
function willCollideWithTree(x, y,objectMap){
    return willCollide(x, y ,objectMap,OBJ.Object_name.TREE1,1)||willCollide(x, y ,objectMap,OBJ.Object_name.TREE2,1);
}
function willCollideWithAnimal(x, y,objectMap){
    for(let i=OBJ.Object_name.DOG;i<OBJ.Object_name.PLAYER; i++){
        if(willCollide(x, y ,objectMap,i,0))
            return true;
    }
    return false;
}
function willCollideWithObject(x, y, objectMap) {

    const x_new = Math.floor(x / 20);
    const y_new = Math.floor(y / 20);


    if (objectMap.map[y_new] && objectMap.map[y_new][x_new]) {
        return objectMap.map[y_new][x_new].getting_item_id[Math.floor(Math.random()*objectMap.map[y_new][x_new].getting_item_number)];
    }
    return null;
}
async function get_item(started, mouseX, mouseY, objectMap, item_box, item_sprite, window, all_items,app) {
    let item_id=willCollideWithObject(mouseX, mouseY, objectMap);
    if (item_id) {
        const test = item_box.setValue(all_items[item_id]);
        if(test>-1&&test<10) {
            item_sprite[test] = await drawobj(window.innerWidth / 4 - 200 + test * 50, window.innerHeight / 2 - 65, all_items[item_id].texture, all_items[item_id].size, app);
        }
    }

    started = 0;
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
    objectMap.generateObjects(map); 
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
                obj_sprite[y][x] = await drawobj(x*20+objectMap.map[y][x].x_adding, y*20+objectMap.map[y][x].y_adding, objectMap.map[y][x].texture, objectMap.map[y][x].size, app);
            if(animalMap.map[y][x])
                animal_sprite[y][x] = await drawobj(x*20+animalMap.map[y][x].x_adding, y*20+animalMap.map[y][x].y_adding, animalMap.map[y][x].texture, animalMap.map[y][x].size, app);
        }
    }
    
    while(willCollideWithTree(player.x, player.y ,objectMap)||willCollideWithAnimal(player.x, player.y,animalMap)){
        player.x = Math.random() * 800 * 20;
        player.y = Math.random() * 800 * 20;
    }
    
    animalMap.addObject(new OBJ.Player(Math.floor(player.x / 20), Math.floor(player.y / 20)));


    // make an item bar
    const itemBar = await drawobj(window.innerWidth / 4, window.innerHeight/2 - 40, 'images/item_bar.png', 1, app);
    itemBar.anchor.set(0.5, 1);
    itemBar.scale.set(0.3)
    const item_box= new ItemBox;
    const item_sprite = new Array(36).fill(null);
    for(let i = 0; i < 9; i++){
        if (item_box.items[i]){
            item_sprite[i] = await drawobj(window.innerWidth / 4 - 200 + i * 50, window.innerHeight / 2 - 65, item_box.items[i].texture, item_box.items[i].size, app);
        }
    }
    const itemAmountTexts = [];
    for (let i = 0; i < 9; i++) {
        const text = new PIXI.Text('', { fontFamily: 'fantasy', fontSize: 14, fill: 0x000000 }); // Adjust font properties as needed
        text.anchor.set(0.5);
        app.stage.addChild(text);
        itemAmountTexts.push(text);
    }
    const all_item = new Array(36).fill(null);

    all_item[ITEM.Item_name.WOOD] = new ITEM.Wood();
    all_item[ITEM.Item_name.BERRY] = new ITEM.Berry();
    all_item[ITEM.Item_name.LEAVES] = new ITEM.Leaves();
    all_item[ITEM.Item_name.COCONUT] = new ITEM.Coconut();
    all_item[ITEM.Item_name.CARROT] = new ITEM.Carrot();
    all_item[ITEM.Item_name.POTATO] = new ITEM.Potato();
    all_item[ITEM.Item_name.WHEAT] = new ITEM.Wheat();


    // keyboard control
    const keys = {};
    const keyW = 87;
    const keyA = 65;
    const keyS = 83;
    const keyD = 68;
    let mouseX = 0;
    let mouseY = 0;
    let started = 0;
    window.addEventListener('mousemove', (event) => {
    });
    window.addEventListener('click', (event) => {
        mouseX = Math.floor(((event.clientX - window.innerWidth / 2)/2 + player.x)/ 20)*20; // Adjust mouseX using the offset
        mouseY = Math.floor(((event.clientY - window.innerHeight / 2)/2 + player.y)/ 20)*20; // Adjust mouseY using the offset
        started = 1;
    });
    
    window.addEventListener('keydown', (event) => {
        const keyCode = event.keyCode;
    
        if ([keyW, keyA, keyS, keyD].includes(keyCode)) {
            keys[keyCode] = true;
        }
    });
    
    window.addEventListener('keyup', (event) => {
        const keyCode = event.keyCode;
        if ([keyW, keyA, keyS, keyD].includes(keyCode)) {
            keys[keyCode] = false;
        }
    });
    let speed = 10;
    player.rotation=0;
    let players_float=1;
    let time_count=0;
    app.ticker.add(async () => {
        let targetRotation = player.rotation;
        if (willCollide(player.x, player.y, objectMap, 4, 1)) {
            speed = 1; 
        }
        if (map.mapData[Math.floor(player.y / 20)][Math.floor(player.x / 20)]==1){
            speed /= 2; 
        }
        if(started==1){
            get_item(started, mouseX, mouseY, objectMap, item_box, item_sprite, window, all_item,app);
            started=0;

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
        if (map.mapData[Math.floor(player.y / 20)][Math.floor(player.x / 20)] == 1&&newY!=player.y) {
            if (time_count === 20) {
                players_float *= -1;
                time_count = 0;
            }
            newX += Math.sin(time_count * 0.1) * players_float; 
        }else if (map.mapData[Math.floor(player.y / 20)][Math.floor(player.x / 20)] == 1) {
            if (time_count === 20) {
                players_float *= -1;
                time_count = 0;
            }
            newY += Math.sin(time_count * 0.1) * players_float ; 
        }
        if (
            willCollideWithTree(player.x, newY, objectMap) || 
            willCollideWithAnimal(player.x, newY, animalMap) 
        ) {
            newY=player.y;
        }
        if (
            willCollideWithTree(newX, player.y, objectMap) || 
            willCollideWithAnimal(newX, player.y, animalMap)  
        ) {
            newX=player.x;
        }
        if (
            (newX >= 0 && newX < 800 * 20 && 
            newY >= 0 && newY < 800 * 20 && 
            !willCollideWithTree(newX, newY, objectMap) && 
            !willCollideWithAnimal(newX, newY, animalMap) )&&(
                newX!=player.x||newY!=player.y)
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
        
        for (let i = 0; i < 9; i++) {
            if (item_sprite[i]) {
                item_sprite[i].x = itemBar.x - 200 + i * 50; 
                item_sprite[i].y = itemBar.y - 25;
                itemAmountTexts[i].text = item_box.items_amount[i];
                if(item_box.items_amount[i]>999){
                    itemAmountTexts[i].text=999;  
                }if(item_box.items_amount[i]>99){
                    itemAmountTexts[i].x = item_sprite[i].x + 10;
                    itemAmountTexts[i].y = item_sprite[i].y + 15;  
                }else if(item_box.items_amount[i]>9){
                    itemAmountTexts[i].x = item_sprite[i].x + 14;
                    itemAmountTexts[i].y = item_sprite[i].y + 15;  
                }else{
                    itemAmountTexts[i].x = item_sprite[i].x + 17;
                    itemAmountTexts[i].y = item_sprite[i].y + 15;  
                }
            }
        }
        speed = 10;
        for (let i = 0; i < 800; i++) {
            for (let j = 0; j < 800; j++) {
                if (animal_sprite[i][j]) {
                    let { moveX, moveY } =  animalMap.map[i][j].move(); 
                    if (map.mapData[i][j] == 1) {
                        moveX/=1.5; 
                        moveY/=1.5; 
                    }
                    let newX = animal_sprite[i][j].x +moveX;
                    let newY = animal_sprite[i][j].y +moveY;
                    if (map.mapData[i][j] == 1&&newY!=animal_sprite[i][j].y) {
                        if (time_count == 20+i*5+j*3) {
                            players_float *= -1;
                            time_count = i*5+j*3;
                        }
                        newX += Math.sin(time_count * 0.1) * players_float; 
                    }else if (map.mapData[i][j] == 1) {
                        if (time_count === 20+i*5+j*3) {
                            players_float *= -1;
                            time_count = i*5+j*3;
                        }
                        newY += Math.sin(time_count * 0.1) * players_float ; 
                    }
                    if (
                        newX >= 0 && newX < 800 * 20 && 
                        newY >= 0 && newY < 800 * 20 
                    ) {
                        if (animalMap.map[Math.floor(newY / 20)]&&(Math.floor(newY / 20)!=i||Math.floor(newX / 20)!=j)&&animalMap.map[Math.floor(newY / 20)][Math.floor(newX / 20)]==null) {
                            animalMap.moveObject(j,i, Math.floor(newX / 20), Math.floor(newY / 20));
                            animalMap.map[Math.floor(newY / 20)][Math.floor(newX / 20)].x=newX;
                            animalMap.map[Math.floor(newY / 20)][Math.floor(newX / 20)].y=newY;
                            animal_sprite[Math.floor(newY / 20)][Math.floor(newX / 20)]=animal_sprite[i][j];
                            animal_sprite[i][j]=null;
                            animal_sprite[Math.floor(newY / 20)][Math.floor(newX / 20)].x = newX;
                            animal_sprite[Math.floor(newY / 20)][Math.floor(newX / 20)].y = newY;
                        }
                        else if((Math.floor(newY / 20)==i&&Math.floor(newX / 20)==j)){
                            animal_sprite[i][j].x = newX;
                            animal_sprite[i][j].y = newY;
                        }
                        else {
                            animalMap.map[i][j].change_move();
                        }
                    }else {
                        animalMap.map[i][j].change_move();
                    }
                }
            }
        }

        time_count++;
        
    });
    
})();
