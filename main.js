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
async function deleteobj(obj,sprite,app){
    obj=null;
    app.stage.removeChild(sprite);
    sprite = null;
}
function logMapDataNearPlayer(playerX, playerY, mapData, radius) {
    const mapSize = mapData.length;
    const startX = Math.max(0, playerX - radius);
    const endX = Math.min(mapSize - 1, playerX + radius);
    const startY = Math.max(0, playerY - radius);
    const endY = Math.min(mapSize - 1, playerY + radius);

    console.log('Map data near player:');
    console.log('start');
    for (let y = startY; y <= endY; y++) {
        let row = '';
        for (let x = startX; x <= endX; x++) {
            if(mapData[y][x]!=null)
                row += mapData[y][x].number + ' ';
            else    row += 0 + ' ';
        }
        console.log(y+':'+row);
    }
    console.log('end');
}
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
async function get_item(mouseX, mouseY, objectMap, item_box, item_sprite, window, all_items,app,open_bag) {
    let item_id=willCollideWithObject(mouseX, mouseY, objectMap);
    if (item_id) {
        const test = item_box.setValue(all_items[item_id]);
        if(test=>0&&test<9) {
            item_sprite[test] = await drawobj(-1000,-1000, all_items[item_id].texture, all_items[item_id].size, app);
            return true;
        }
        if(open_bag==true&&test>9&&test<36){
            item_sprite[test] = await drawobj(-1000,-1000, all_items[item_id].texture, all_items[item_id].size, app);
            return true;
        }
        return true;
    }
    return false;

}
function createHPBar(currentHP, maxHP) {
    const barWidth = 200;
    const barHeight = 30;

    const greenColor = 0x00FF00;
    const redColor = 0xFF0000;

    const hpBar = new PIXI.Graphics();

    const greenWidth = (currentHP / maxHP) * barWidth;

    // Draw red background bar
    hpBar.beginFill(redColor);
    hpBar.drawRect(0, 0, barWidth, barHeight);
    hpBar.endFill();

    // Draw green HP bar
    hpBar.beginFill(greenColor);
    hpBar.drawRect(0, 0, greenWidth, barHeight);
    hpBar.endFill();

    return hpBar;
}
function updateHPBar(hpBar, currentHP, maxHP) {
    currentHP=Math.max(currentHP,0);
    const barWidth = 200;
    const greenWidth = (currentHP / maxHP) * barWidth;

    hpBar.clear(); 
    hpBar.beginFill(0xFF0000); 
    hpBar.drawRect(0, 0, barWidth, 30);
    hpBar.endFill();

    hpBar.beginFill(0x00FF00); 
    hpBar.drawRect(0, 0, greenWidth, 30);
    hpBar.endFill();
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
    
    animalMap.generateAnimal(numOfEachAnimal,map);
    const obj_sprite = new Array(800).fill(null).map(() => new Array(800).fill(null));
    
    const animal_sprite = new Array(800).fill(null).map(() => new Array(800).fill(null));
    
    for (let y = 0; y < 800; y++) {
        for (let x = 0; x < 800; x++) {
            if(animalMap.map[y][x])
                animal_sprite[y][x] = await drawobj(x*20+animalMap.map[y][x].x_adding, y*20+animalMap.map[y][x].y_adding, animalMap.map[y][x].texture, animalMap.map[y][x].size, app);
    }}
    for (let y = 0; y < 800; y++) {
        for (let x = 0; x < 800; x++) {
            if(objectMap.map[y][x])
                obj_sprite[y][x] = await drawobj(x*20+objectMap.map[y][x].x_adding, y*20+objectMap.map[y][x].y_adding, objectMap.map[y][x].texture, objectMap.map[y][x].size, app);
        }
    }
    
    while(willCollideWithTree(player.x, player.y ,objectMap)||willCollideWithAnimal(player.x, player.y,animalMap)||map.mapData[Math.floor(player.y / 20)][Math.floor(player.x / 20)] == 2){
        player.x = Math.random() * 800 * 20;
        player.y = Math.random() * 800 * 20;
    }
    let play_obj=new OBJ.Player(Math.floor(player.x / 20), Math.floor(player.y / 20));
    animalMap.addObject(play_obj);

    // make an item bar
    const itemBar = await drawobj(window.innerWidth / 4, window.innerHeight/2 - 40, 'images/item_bar.png', 1, app);
    itemBar.anchor.set(0.5, 1);
    itemBar.scale.set(0.3);
    const item_bag = new Array(3).fill(null);
    const item_box= new ItemBox;
    const item_sprite = new Array(36).fill(null);
    for(let i = 0; i < 9; i++){
        if (item_box.items[i]){
            item_sprite[i] = await drawobj(window.innerWidth / 4 - 200 + i * 50, window.innerHeight / 2 - 65, item_box.items[i].texture, item_box.items[i].size, app);
        }
    }
    const item_text_sprite = new Array(36).fill(null);
    for (let i = 0; i < 9; i++) {
            item_text_sprite[i] = new PIXI.Text('', { fontFamily: 'fantasy', fontSize: 14, fill: 0x000000 }); // Adjust font properties as needed
            item_text_sprite[i].anchor.set(0.5);
            app.stage.addChild(item_text_sprite[i]);
    }
    const all_item = new Array(36).fill(null);

    all_item[ITEM.Item_name.WOOD] = new ITEM.Wood();
    all_item[ITEM.Item_name.BERRY] = new ITEM.Berry();
    all_item[ITEM.Item_name.LEAVES] = new ITEM.Leaves();
    all_item[ITEM.Item_name.COCONUT] = new ITEM.Coconut();
    all_item[ITEM.Item_name.CARROT] = new ITEM.Carrot();
    all_item[ITEM.Item_name.POTATO] = new ITEM.Potato();
    all_item[ITEM.Item_name.WHEAT] = new ITEM.Wheat();


    // make a hp bar
    
    const player_hpBar = createHPBar(play_obj.hp, play_obj.full_hp);
    app.stage.addChild(player_hpBar);

    // keyboard control
    const keys = {};
    const keyW = 87;
    const keyA = 65;
    const keyS = 83;
    const keyD = 68;
    const keyE = 69;
    const keyM = 77;
    let mouseX = 0;
    let mouseY = 0;
    let started = 0;
    window.addEventListener('mousemove', (event) => {
        mouseX = Math.floor(((event.clientX - window.innerWidth / 2)/2 + player.x)/ 20)*20; // Adjust mouseX using the offset
        mouseY = Math.floor(((event.clientY - window.innerHeight / 2)/2 + player.y)/ 20)*20; // Adjust mouseY using the offset
    });
    window.addEventListener('click', (event) => {
        started = 1;
    });
    let click=true;
    let open_bag=false;
    let open_map=false;
    let tile = new PIXI.Graphics();
    let player_point = new PIXI.Graphics();
    
    
    let first_time_gen_map=true;
    window.addEventListener('keydown', async (event) => {
        const keyCode = event.keyCode;
    
        if ([keyW, keyA, keyS, keyD].includes(keyCode)) {
            keys[keyCode] = true;
        }if (keyCode == keyE&&click==true&&open_bag==false) {
            for(let i=-1;i<=1;i++){
                item_bag[i+1] = await drawobj(window.innerWidth / 4, window.innerHeight/4 + i * 50, 'images/item_bar.png', 1, app);
                item_bag[i+1].anchor.set(0.5, 1);
                item_bag[i+1].scale.set(0.3);
            }
            for(let i = 9; i < 36; i++){
                if (item_box.items[i]){
                    item_sprite[i] = await drawobj(window.innerWidth / 4 - 200 + (i % 9) * 50, window.innerHeight / 4 + Math.floor(i / 9)* 50, item_box.items[i].texture, item_box.items[i].size, app);
                }
            }
            for (let i = 9; i < 36; i++) {
                item_text_sprite[i] = new PIXI.Text('', { fontFamily: 'fantasy', fontSize: 14, fill: 0x000000 }); // Adjust font properties as needed
                item_text_sprite[i].anchor.set(0.5);
                app.stage.addChild(item_text_sprite[i]);
            }
            click=false;
            open_bag=true;
        }else if(keyCode == keyE&&click==true&&open_bag==true){
            for (let i = -1; i <= 1; i++) {
                if (item_bag[i+1]) {
                    app.stage.removeChild(item_bag[i+1]);
                    item_bag[i+1] = null;
                }
            }
        
            for (let i = 9; i < 36; i++) {
                if (item_sprite[i]) {
                    app.stage.removeChild(item_sprite[i]);
                    item_sprite[i] = null;
                }
            }
        
            for (let i = 9; i < 36; i++) {
                app.stage.removeChild(item_text_sprite[i]);
            }
            click=false;
            open_bag=false;
        }
        if (keyCode == keyM && click == true && open_map == false) {
            const tileSize = 0.8;
            
        
            for (let y = 0; y < map.mapData.length; y++) {
                for (let x = 0; x < map.mapData[y].length; x++) {
                    const tileType = map.mapData[y][x];
                    let color;
        
                    switch (tileType) {
                        case 0:
                            color = Math.random() > 0.1 ? 0x5c8852 : 0x80735a; // grass
                            break;
                        case 1:
                            color = 0x4e82ff; // water
                            break;
                        case 2:
                            color = 0xffa500; // lava
                            break;
                        case 3:
                            color = 0x8c8c8c; // stone
                            break;
                        case 4:
                            color = 0x300542; // obsidian
                            break;
                        default:
                            color = 0xffffff; // Default color
                            break;
                    }
        
                    tile.beginFill(color, 0.75);
                    tile.drawRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    tile.endFill();
                }
            }
            player_point.beginFill(0x00FF00); // Green color
            player_point.drawCircle(0, 0, 5); // Draw a circle with radius 5
            player_point.endFill();
            
            player_point.x = player.x*1.04-400*0.8; 
            player_point.y = player.y*1.04-400*0.8; 
            
            if(first_time_gen_map){
                app.stage.addChild(tile);
                app.stage.addChild(player_point);
                first_time_gen_map=false;
            }
            click=false;
            open_map=true;
        }else if (keyCode == keyM &&click==true&&open_map==true){
            player_point.clear(); 
            tile.clear(); 
            click=false;
            open_map=false;
        }
    });
    
    window.addEventListener('keyup', (event) => {
        const keyCode = event.keyCode;
        if ([keyW, keyA, keyS, keyD].includes(keyCode)) {
            keys[keyCode] = false;
        }if (keyCode == keyE||keyCode == keyM) {
            click=true;
        }
    });
    let speed = 10;
    player.rotation=0;
    let time_count=0;
    let move_item = new Array(800).fill(false).map(() => new Array(800).fill(false));
    let start_time = new Array(800).fill(-1).map(() => new Array(800).fill(-1));
    let player_hitting=false;
    app.ticker.add(async () => {
        //slow down speed when go to some area
        let targetRotation = player.rotation;
        if (willCollide(player.x, player.y, objectMap, 4, 1)) {
            speed = 1; 
        }
        if (map.mapData[Math.floor(player.y / 20)][Math.floor(player.x / 20)]==1){
            speed /= 2; 
        }
        //get item
        if (started == 1 && player_hitting == false&&
            Math.floor(mouseX / 20) >= Math.floor(player.x / 20) - 6 &&
            Math.floor(mouseX / 20) <= Math.floor(player.x / 20) + 6 &&
            Math.floor(mouseY / 20) >= Math.floor(player.y / 20) - 6 &&
            Math.floor(mouseY / 20) <= Math.floor(player.y / 20) + 6) {
            get_item(mouseX, mouseY, objectMap, item_box, item_sprite, window, all_item, app,open_bag)
                .then((getted) => {
                    if (getted) {
                        move_item[Math.floor(mouseY / 20)][Math.floor(mouseX / 20)] = true;
                        player_hitting = true;
                        const angle = Math.atan2(Math.floor(mouseY/20) - Math.floor(player.y/20), Math.floor(mouseX/20) - Math.floor(player.x/20));
                        player.rotation = angle + Math.PI/2;
                        while(player.rotation<0||player.rotation>2*Math.PI){
                            if(player.rotation<0){
                                player.rotation+=2*Math.PI;
                            }
                            else{
                                
                                player.rotation-=2*Math.PI;
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error occurred while getting item:", error);
                });

            
        }
        started = 0;
        for (let y = 0; y < move_item.length; y++) {
            for (let x = 0; x < move_item[y].length; x++) {
                if (move_item[y][x] == true) {
                    if (start_time[y][x] == -1) {
                        start_time[y][x] = time_count;
                    }
                    const time_used = time_count - start_time[y][x];
                    const duration = 50; 
        
                    if (time_used <= duration) {
                        const newX = obj_sprite[y][x].x + Math.sin(time_used); 
                        obj_sprite[y][x].x = newX;
                    } else {
                        move_item[y][x] = false;
                        start_time[y][x] = -1;
                        player_hitting=false;
                    }
                }
            }
        }
        //player movement
        if(player_hitting==false)
        {let newX = player.x;
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
            }if (map.mapData[Math.floor(player.y / 20)][Math.floor(player.x / 20)] == 2) {
                play_obj.hp--;
                updateHPBar(player_hpBar, play_obj.hp, play_obj.full_hp);
            }
            if (map.mapData[Math.floor(player.y / 20)][Math.floor(player.x / 20)] == 1&&newY!=player.y) {
                newX += Math.sin(time_count* 0.1) ; 
            }else if (map.mapData[Math.floor(player.y / 20)][Math.floor(player.x / 20)] == 1) {
                newY += Math.sin(time_count * 0.1) ; 
            }
            //logMapDataNearPlayer(Math.floor(player.x / 20),Math.floor(player.y / 20),animalMap.map,6);
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
            }
        //let the screen follow the player
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.pivot.x = player.x;
        app.stage.pivot.y = player.y;
        app.stage.position.x = app.screen.width / 2;
        app.stage.position.y = app.screen.height / 2;
        player_hpBar.x=player.x-227;
        player_hpBar.y=player.y+ window.innerHeight/4-120;
        itemBar.x = player.x ;
        itemBar.y = player.y + window.innerHeight/4-40; 
        // editing the bar item text
        
        if(player_hitting==false)
        {   for (let i = 0; i < 9; i++) {
                if (item_sprite[i]) {
                    item_sprite[i].x = itemBar.x - 200 + i * 50; 
                    item_sprite[i].y = itemBar.y - 25;
                    item_text_sprite[i].text = item_box.items_amount[i];
                    if(item_box.items_amount[i]>999){
                        item_text_sprite[i].text=999;  
                    }if(item_box.items_amount[i]>99){
                        item_text_sprite[i].x = item_sprite[i].x + 10;
                        item_text_sprite[i].y = item_sprite[i].y + 15;  
                    }else if(item_box.items_amount[i]>9){
                        item_text_sprite[i].x = item_sprite[i].x + 14;
                        item_text_sprite[i].y = item_sprite[i].y + 15;  
                    }else{
                        item_text_sprite[i].x = item_sprite[i].x + 17;
                        item_text_sprite[i].y = item_sprite[i].y + 15;  
                    }
                }
            }
            if(open_bag){
                for(let i=-1;i<=1;i++){
                    item_bag[i+1].x = player.x ;
                    item_bag[i+1].y = player.y + window.innerHeight/4 - 140 + i * 50; 
                }
                for (let i = 9; i < 36; i++) {
                    if (item_sprite[i]) {
                        item_sprite[i].x = item_bag[0].x - 200 + i%9 * 50; 
                        item_sprite[i].y = item_bag[0].y - 75 + Math.floor(i/9) * 50;
                        item_text_sprite[i].text = item_box.items_amount[i];
                        if(item_box.items_amount[i]>999){
                            item_text_sprite[i].text=999;  
                        }if(item_box.items_amount[i]>99){
                            item_text_sprite[i].x = item_sprite[i].x + 10;
                            item_text_sprite[i].y = item_sprite[i].y + 15;  
                        }else if(item_box.items_amount[i]>9){
                            item_text_sprite[i].x = item_sprite[i].x + 14;
                            item_text_sprite[i].y = item_sprite[i].y + 15;  
                        }else{
                            item_text_sprite[i].x = item_sprite[i].x + 17;
                            item_text_sprite[i].y = item_sprite[i].y + 15;  
                        }
                    }
                }
            }if(open_map==true){
                tile.x = player.x-400*0.8;
                tile.y = player.y-400*0.8;
                player_point.x = player.x*1.04-400*0.8; 
                player_point.y = player.y*1.04-400*0.8; 
            }
        }
        //animal movement
        speed = 10;
        for (let i = 0; i < 800; i++) {
            for (let j = 0; j < 800; j++) {
                if (animal_sprite[i][j]) {
                    if (map.mapData[i]&&map.mapData[i][j] == 2) {
                        animalMap.map[i][j].hp--;
                    }
                    if(animalMap.map[i]&&animalMap.map[i][j].hp==0){
                        deleteobj(animalMap.map[i][j],animal_sprite[i][j],app);
                    }
                    let { moveX, moveY } =  animalMap.map[i][j].move(); 
                    if (map.mapData[i][j] == 1) {
                        moveX/=1.5; 
                        moveY/=1.5; 
                    }
                    if (willCollide(animal_sprite[i][j].x, animal_sprite[i][j].y, objectMap, 4, 1)) {
                        moveX/=3; 
                        moveY/=3; 
                    }
                    let newX = animal_sprite[i][j].x +moveX;
                    let newY = animal_sprite[i][j].y +moveY;
                    if (map.mapData[i][j] == 1&&newY!=animal_sprite[i][j].y) {
                        newX += Math.sin((time_count+i*5+j*3) * 0.1); 
                    }else if (map.mapData[i][j] == 1) {
                        newY += Math.sin((time_count+i*5+j*3) * 0.1); 
                    }
                    
                if(willCollideWithTree(newX, newY, objectMap)){
                    if(newY>400){
                        while(willCollideWithTree(newX, newY, objectMap)){
                            newY-=20;
                        }
                    }else{
                        while(willCollideWithTree(newX, newY, objectMap)){
                            newY+=20;
                        }
                    }

                }
                    if (
                        newX >= 0 && newX < 800 * 20 && 
                        newY >= 0 && newY < 800 * 20
                    ) {
                        if (animalMap.map[Math.floor(newY / 20)]&&(Math.floor(newY / 20)!=i||Math.floor(newX / 20)!=j)&&animalMap.map[Math.floor(newY / 20)][Math.floor(newX / 20)]==null
                    &&!willCollideWithTree(newX, newY, objectMap)&&map.mapData[Math.floor(newY / 20)][Math.floor(newX / 20)] != 2) {
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
                            newX=animal_sprite[i][j].x;
                            newY=animal_sprite[i][j].y;
                        }
                    }else {
                        animalMap.map[i][j].change_move();
                        newX=animal_sprite[i][j].x;
                        newY=animal_sprite[i][j].y;
                    }
                }
            }
        }
        //counting time
        time_count++;
        if(time_count== Number.MAX_SAFE_INTEGER){
            time_count=0;
        }
        //layer editing
        if(open_map&&app.stage.getChildIndex(player_point)!=app.stage.children.length - 1){
            app.stage.setChildIndex(tile, app.stage.children.length - 1);
            app.stage.setChildIndex(player_point, app.stage.children.length - 1);
            app.renderer.render(app.stage);
        }
    });
    
})();
