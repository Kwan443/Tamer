import Map from './map.js';
import * as PIXI from './pixi/pixi.mjs';
import { Tree1, Tree2, Grass, BerryBush } from './object.js';
import { ObjectMap } from './object_map.js';
(async () => {
    // make background of whloe game
    const app = new PIXI.Application();
    await app.init({ background: '#000000', resizeTo: window });
    document.body.appendChild(app.view);
    const grassContainer = new PIXI.Container();
    app.stage.addChild(grassContainer);

  
    

    //make a map
    const map = new Map(app);
    
    // make a player
    const texture = await PIXI.Assets.load('images/bunny.png');
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    const sprite = PIXI.Sprite.from(texture);
    sprite.anchor.set(0.5);
    //random go to the map
    sprite.x = Math.random() * 800 * 20;
    sprite.y = Math.random() * 800 * 20;
    sprite.interactive = true;

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
    app.ticker.add(() => {
        if(sprite.x>=0&&sprite.y>=0&&sprite.x<=800*20&&sprite.y<=800*20){ //prevent go out of the map
            if (keys[keyW]) {
                sprite.y -= speed;
            }
            if (keys[keyA]) {
                sprite.x -= speed;
            }
            if (keys[keyS]) {
                sprite.y += speed;
            }
            if (keys[keyD]) {
                sprite.x += speed;
            }
        }
        else if(sprite.x<0){
            sprite.x += speed;
        }
        else if(sprite.y<0){
            sprite.y += speed;
        }
        else if(sprite.x>800*20){
            sprite.x -= speed;
        }
        else if(sprite.y>800*20){
            sprite.y -= speed;
        }
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.pivot.x = sprite.x;
        app.stage.pivot.y = sprite.y;
        app.stage.position.x = app.screen.width / 2;
        app.stage.position.y = app.screen.height / 2;
    });

    app.stage.addChild(sprite);

    //make a object map
    const objectMap = new ObjectMap(800, 800, app);
    objectMap.generateObjects();
    for (let y = 0; y < 800; y++) {
        for (let x = 0; x < 800; x++) {
            if (objectMap.map[y][x]==1) {
                const obj_texture = await PIXI.Assets.load('images/tree1.png');
                obj_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                const obj_sprite = PIXI.Sprite.from(obj_texture);
                obj_sprite.scale.set(150/obj_sprite.width); 
                obj_sprite.anchor.set(0.5);
                obj_sprite.x = x*20+15;
                obj_sprite.y = y*20-obj_sprite.height/2+20;
                obj_sprite.interactive = true;
                app.stage.addChild(obj_sprite);
            } else if (objectMap.map[y][x]==2) {
                const obj_texture = await PIXI.Assets.load('images/tree2.png');
                obj_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                const obj_sprite = PIXI.Sprite.from(obj_texture);
                obj_sprite.scale.set(150/obj_sprite.width); 
                obj_sprite.anchor.set(0.5);
                obj_sprite.x = x*20;
                obj_sprite.y = y*20-obj_sprite.height/2+20;
                obj_sprite.interactive = true;
                app.stage.addChild(obj_sprite);
            }else if (objectMap.map[y][x]==3) {
                const obj_texture = await PIXI.Assets.load('images/grass1.png');
                obj_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                const obj_sprite = PIXI.Sprite.from(obj_texture);
                obj_sprite.scale.set(20/obj_sprite.width); 
                obj_sprite.anchor.set(0.5);
                obj_sprite.x = x*20+10;
                obj_sprite.y = y*20-obj_sprite.height/2+20;
                obj_sprite.interactive = true;
                app.stage.addChild(obj_sprite);
            }else if (objectMap.map[y][x]==4) {
                const obj_texture = await PIXI.Assets.load('images/burrybush.png');
                obj_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                const obj_sprite = PIXI.Sprite.from(obj_texture);
                obj_sprite.scale.set(60/obj_sprite.width); 
                obj_sprite.anchor.set(0.5);
                obj_sprite.x = x*20+15;
                obj_sprite.y = y*20-obj_sprite.height/2+20;
                obj_sprite.interactive = true;
                app.stage.addChild(obj_sprite);
            }
        }
    }



})();