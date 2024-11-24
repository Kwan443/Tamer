import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; 
import Map from './map.js';
import { ObjectMap } from './object_map.js';
import * as OBJ from './object.js';
export function willCollide(x, y,objectMap,num,collisionAreawidth,collisionAreaheight=collisionAreawidth) {
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
export function willCollideWithTree(x, y,objectMap){
    return willCollide(x, y ,objectMap,OBJ.Object_name.TREE1,1)||willCollide(x, y ,objectMap,OBJ.Object_name.TREE2,1)||willCollide(x, y ,objectMap,OBJ.Object_name.ICE_CRYSTAL,1);
}
function deleteobj(y,x,objmap,sprite,app){
    objmap.removeObject(x,y);
    sprite = null;
}
class Point {
    constructor(x, y,ID) {
        this.x = x;
        this.y = y;
        this.ID=ID;
    }

    add(point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    subtract(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    assign(point) {
        this.x = point.x;
        this.y = point.y;
    }
}
const app = express();
app.use(cors());
app.use(cors({
    origin: ['http://localhost:5500']
}));

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: ['http://localhost:5500'],
        methods:["GET","POST"],
    },
});

const map = new Map();
map.mapData = map.generateMapData(800, 800);

const objectMap = new ObjectMap(800, 800, app);
objectMap.generateObjects(map);

const numOfEachAnimal = {
    Dog: 100,
    Cow: 100,
    Pig: 100,
    Rabbit: 100,
    Sheep: 100,
    SoulFox: 1,
    Player:0
};

const animalMap = new ObjectMap(800, 800, app);
animalMap.generateAnimal(numOfEachAnimal, map);
const rows = 800;
const cols = 800;
let number_of_animal=0;
let number_of_player=0;



const animal_sprite = new Array(rows);
for (let i = 0; i < rows; i++) {
    animal_sprite[i] = new Array(cols);
}
for (let y = 0; y < 800; y++) {
    for (let x = 0; x < 800; x++) {
        if(animalMap.map[y][x]){
            animal_sprite[y][x] = new Point(x*20+animalMap.map[y][x].x_adding, y*20+animalMap.map[y][x].y_adding,++number_of_animal);
        }
        else{
            animal_sprite[y][x] =null;
        }   
}}
let time_count = 0;
function updateAnimalMovement() {
    let new_position = Array(rows);
    for (let i = 0; i < rows; i++) {
        new_position[i] = new Array(cols);
    }
    time_count++;
for (let i = 0; i < 800; i++) {
    for (let j = 0; j < 800; j++) {
        if (animal_sprite[i][j]&&animalMap.map[i][j]&&animalMap.map[i][j].number!=OBJ.Object_name.PLAYER) {
            
            if (map.mapData[i]&&map.mapData[i][j] == 2) {
                animalMap.map[i][j].hp--;
            }
            if(animalMap.map[i]&&animalMap.map[i][j].hp<=0){
                console.log("animal",animal_sprite[i][j].ID,"is dead");
                deleteobj(i,j,animalMap,animal_sprite[i][j],app);
                continue;
            }
            let { moveX, moveY } =  animalMap.map[i][j].normal_movement(map.mapData,animalMap.map,objectMap.map,animal_sprite); 


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
            
            if(willCollideWithTree(animal_sprite[i][j].x, animal_sprite[i][j].y, objectMap)){
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
                
                    new_position[i][j]=new Point(newX,newY,animal_sprite[i][j].ID);
                    animalMap.moveObject(j,i, Math.floor(newX / 20), Math.floor(newY / 20));
                    animal_sprite[Math.floor(newY / 20)][Math.floor(newX / 20)]=animal_sprite[i][j];
                    animal_sprite[i][j]=null;
                    animal_sprite[Math.floor(newY / 20)][Math.floor(newX / 20)].x = newX;
                    animal_sprite[Math.floor(newY / 20)][Math.floor(newX / 20)].y = newY;
                }
                else if((Math.floor(newY / 20)==i&&Math.floor(newX / 20)==j)){
                    animal_sprite[i][j].x = newX;
                    animal_sprite[i][j].y = newY;
                    
                    new_position[i][j]=new Point(newX,newY,animal_sprite[i][j].ID);
                }
                else {
                    animalMap.map[i][j].change_move();
                    newX=animal_sprite[i][j].x;
                    newY=animal_sprite[i][j].y;
                    
                    new_position[i][j]=new Point(newX,newY,animal_sprite[i][j].ID);
                }
            }else {
                animalMap.map[i][j].change_move();
                newX=animal_sprite[i][j].x;
                newY=animal_sprite[i][j].y;
                
                new_position[i][j]=new Point(newX,newY,animal_sprite[i][j].ID);
            }
        }
        else if(animal_sprite[i][j]&&animalMap.map[i][j]&&animalMap.map[i][j].number==OBJ.Object_name.PLAYER){
            new_position[i][j]=new Point(animal_sprite[i][j].x,animal_sprite[i][j].y,animal_sprite[i][j].ID);
        }
    }
}
return new_position;
}
app.get('/', (req, res) => {
    res.send("hello")
});
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('mapData', map.mapData);
    socket.emit('animalMapData', animalMap.mapdata);
    socket.emit('animalIDMapData', animal_sprite);

    socket.emit('objectMapData', objectMap.mapdata);
    socket.on('addPlayer', (data) => {
        socket.emit("set_ID",number_of_animal+ ++number_of_player);
        
        let updated_animal;
        while(animal_sprite[Math.floor(data.y / 20)][Math.floor(data.x / 20)]!=null){
            updated_animal = updateAnimalMovement();
            app.get('/updated_animal', (req, res) => {
                res.json(updated_animal);
            });
        }
        animal_sprite[Math.floor(data.y / 20)][Math.floor(data.x / 20)]=new Point(data.x,data.y,number_of_animal+number_of_player);
        animalMap.addObject(new OBJ.Player(Math.floor(data.x / 20),Math.floor(data.y / 20)));
        console.log("new player have join",animal_sprite[Math.floor(data.y / 20)][Math.floor(data.x / 20)]);
        io.emit("addPlayer", animal_sprite[Math.floor(data.y / 20)][Math.floor(data.x / 20)]);
    });
    socket.on('playerMove', (data) => {
        outerLoop: for(let i=0;i<800;i++){
            for(let j=0;j<800;j++){
                if(animal_sprite[i][j]&&animal_sprite[i][j].ID==data.ID){
                    let newX=data.x;
                    let newY=data.y;
                    if(animal_sprite[Math.floor(data.y / 20)][Math.floor(data.x / 20)]==null){
                            animalMap.moveObject(j,i, Math.floor(newX / 20), Math.floor(newY / 20));
                            animal_sprite[Math.floor(newY / 20)][Math.floor(newX / 20)]=animal_sprite[i][j];
                            animal_sprite[i][j]=null;
                            animal_sprite[Math.floor(newY / 20)][Math.floor(newX / 20)].x = newX;
                            animal_sprite[Math.floor(newY / 20)][Math.floor(newX / 20)].y = newY;
                        }
                        else if(animal_sprite[Math.floor(data.y / 20)][Math.floor(data.x / 20)].ID==data.ID){
                            if (animal_sprite[i] && animal_sprite[i][j]) {
                            animal_sprite[i][j].x = newX;
                            animal_sprite[i][j].y = newY;
                            } else {
                                console.error(`Error: animal_sprite[${i}][${j}] is undefined.`);
                            }
                        }
                    io.emit("playerMove",animal_sprite[Math.floor(data.y / 20)][Math.floor(data.x / 20)]);

                    break outerLoop;
                }
            }
        }
        
    });
    socket.on('hit_animal', (data) => {
        
    for (let i = 0; i < 800; i++) {
    for (let j = 0; j < 800; j++) {
        if(animal_sprite[i][j]){
        if(animal_sprite[i][j].ID==data.ID){
            animalMap.map[i][j].hp=data.hp;
            console.log("hit_animal");
            if(data.hp<=0){
                deleteobj(i,j,animalMap,animal_sprite[i][j],app);
                console.log("animal",animal_sprite[i][j].ID,"is dead");
            }
        }
    }
    }};
    io.emit('hit_animal',{ID:data.ID,hp:data.hp})
    });
    socket.on('tame_animal', (data) => {
        console.log("tamed_animal");
        
        for (let i = 0; i < 800; i++) {
        for (let j = 0; j < 800; j++) {
            if(animal_sprite[i][j]){
            if(animal_sprite[i][j].ID==data.ID){
                animalMap.map[i][j].follow_id=data.playerID;
                animalMap.map[i][j].state=OBJ.State_id.FOLLOW;
                console.log(animalMap.map[i][j]);
                console.log("tamed_animal_for_sure");
            }
        }
        }}
        io.emit('tame_animal',{ID:data.ID,playerID:data.playerID})
        });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

});

server.listen(3000, () => {
    console.log('Server running on port 3000 (HTTP)');
    
    let updated_animal;
    setInterval(() => {
        updated_animal = updateAnimalMovement();
        app.get('/updated_animal', (req, res) => {
            res.json(updated_animal);
        });
    }, 100);
    
});