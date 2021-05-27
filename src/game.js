import Cell from "./cell";
import Artist from "./artist";
import Grouper from "./grouper";
import InputHandler from "./input";
import Menu from "./menu";
import {levels, lvs} from "./levels";

const GAMESTATE = {
    RUNNING: 0,
    MENU: 1,
    WON: 2,
    START: 3,
    CREATE: 4
};

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }
    //
    start(){
        this.gamestate = GAMESTATE.START;
        console.log("Gamestate intialized at: 'RUNNING'");
        //
        this.inSize = 6;//puzzle size
        this.outSize = 12;//grid size, don't go within 2 cells
        this.offset = Math.floor((this.outSize - this.inSize) / 2);//offset of puzzle in grid, calculate by default
        this.colors = 3;//number of colors in puzzle
        this.pattern = 0;//0 = double row, 1 = single row, 2 = double column, 3 = single column, 4 = alternating, 5 = squares
        this.inCap = this.inSize * this.inSize;//number of tiles in the puzzle
        this.outCap = this.outSize * this.outSize;//number of cells in the grid
        //
        this.moving = this.inSize;//keep track of which group is moving, inSize if none
        this.mouseStartX = 0;//remember mouse starting position for group move, x
        this.mouseStartY = 0;//remember mouse starting position for group move, y
        //
        this.timer = 0;//timer to determine gamestate change from WON to MENU
        //
        this.level = -1;//current level
        //
        var i;
        this.map = new Array();//map of every cell in the grid
        this.goalMap = new Array();//map of the state of every cell in a winning scenario
        for(i = 0; i < this.outCap; i++){//generate default map states
            this.map.push(this.inCap);
            this.goalMap.push(this.colors);
        }
        //
        this.cells = new Array();//list of every puzzle tile with a unique identity and state
        for(i = 0; i < this.inCap; i++){//give every tile an identity and a location on the map
            this.cells.push(new Cell(this, i));
            var temp = this.cells[i];
            this.map[temp.locIndex] = i;
            this.goalMap[temp.locIndex] = temp.state;//this is fine, since the puzzle is generated in a win state by default
        }
        //
        //console.log(this.map);
        //
        this.artist = new Artist(this);//draw grid and tiles
        this.grouper = new Grouper(this);//draw and select groups
        this.gameObjects = [this.artist, this.grouper];
        //
        this.unit = this.artist.unit;//px length for each cell
        //
        new InputHandler(this);//handle key and mouse inputs
        this.menu = new Menu(this);//draw for WON and MENU gamestates
        //
        this.smallFont = this.menu.fontSize / 2;
        //
        this.viewMode = 0;//group selection mode, 0 = rows, 1 = columns (space to switch)
        //
        this.grouper.identify();//indentify tile groups
    }
    //
    draw(ctx){//draw objects
        switch(this.gamestate){
            case GAMESTATE.RUNNING:
                this.gameObjects.forEach(object => object.draw(ctx));
                ctx.font = '20px "Pixeled"';
                ctx.fillStyle = "black";
                ctx.fillText(("level: " + (this.level + 1)), 10, 20);
                break;
            //
            case GAMESTATE.WON:
                this.gameObjects.forEach(object => object.draw(ctx));
                this.menu.drawWon(ctx);
                break;
            //
            case GAMESTATE.MENU:
                this.menu.drawMenu(ctx);
                break;
            //
            case GAMESTATE.START:
                //this.menu.drawStart(ctx);
                break;
            case GAMESTATE.CREATE:
                this.gameObjects.forEach(object => object.draw(ctx));
                break;
        }
        //
    }
    //
    update(deltaTime){//update objects
        if(this.gamestate == GAMESTATE.RUNNING || this.gamestate == GAMESTATE.CREATE){
            this.gameObjects.forEach(object => object.update(deltaTime));
            this.timer = 0;
        }else{
            this.menu.update(deltaTime);
            if(this.gamestate == GAMESTATE.WON && this.timer > 2000){
                this.gamestate = GAMESTATE.MENU;
                console.log("Gamestate changed to: 'MENU'");
            }else{
                this.timer += deltaTime;
            }
        }
        //
    }
    //
    startGroupMove(event){//start moving a group, remember mouse start
        this.moving = this.grouper.selectedGroup;
        this.mouseStartX = event.offsetX;
        this.mouseStartY = event.offsetY;
        this.grouper.groupStart = this.grouper.groups[this.grouper.selectedGroup][1];
    }
    //
    stopGroupMove(){//stop moving a group, check for completion
        this.moving = this.inSize;
        var group = this.grouper.groups[this.grouper.selectedGroup]
        var i;
        for (i = 2; i < group.length; i++){
            this.cells[group[i]].resetOrigin();
        }
        if(this.checkCompletion() && this.gamestate != GAMESTATE.CREATE){
            this.gamestate = GAMESTATE.WON;
            this.grouper.selectedGroup = this.inSize;
            console.log("Gamestate changed to: 'WON'");
        }
    }
    //
    moveGroup(event){//move a selected group with the cursor's x or y
        let cx = Math.floor((event.offsetX - this.mouseStartX + (this.unit / 2)) / this.unit);
        let cy = Math.floor((event.offsetY - this.mouseStartY + (this.unit / 2)) / this.unit);
        //
        var group = this.grouper.groups[this.grouper.selectedGroup]
        //console.log(group);
        var i;
        var grStart = this.grouper.groupStart;
        //console.log(grStart);
        if(this.viewMode == 0){//rows
            //console.log(`cx, cy: ${cx}, 0`);
            if(grStart + cx + this.inSize > this.outSize){
                cx = this.outSize - this.inSize - grStart;
            }else if(grStart + cx < 0){
                cx = 0 - grStart;
            }
            //console.log(`Moving: ${group}`);
            for (i = 2; i < group.length; i++){
                this.cells[group[i]].move(cx, 0);
            }
            this.grouper.groups[this.grouper.selectedGroup][1] = grStart + cx;
        }else{//columns
            //console.log(`cx, cy: 0, ${cy}`);
            if(grStart + cy + this.inSize > this.outSize){
                cy = this.outSize - this.inSize - grStart;
            }else if(grStart + cy < 0){
                cy = 0 - grStart;
            }
            for (i = 2; i < group.length; i++){
                this.cells[group[i]].move(0, cy);
            }
            this.grouper.groups[this.grouper.selectedGroup][1] = grStart + cy;
        }
        //
        //this.grouper.identify();
    }
    //
    logInfo(){//log level info for level creation
        console.log("[" + this.inSize + ", " +
            this.outSize + ", " + 
            this.colors + ", " + 
            this.pattern + ", " + this.map + "],");
    }
    //
    loadLevel(key){//load level into grid based on level index (key)
        this.moving = this.inSize;
        /*if(key >= lvs.length){//check level exists
            console.log("Load command failed, level does not exist");
            this.level--;
        }else if(lvs[key].length < 4){//check that a map exists
            console.log("Load command failed, level is corrupted");
            this.level--;
        }else */if(this.level < 6){//6
            var level = lvs[key];//reset variables
            console.log("Load command registered, level index: " + key);
            this.inSize = level[0];//goal grid size
            this.outSize = level[1];//total grid size
            this.offset = Math.floor((this.outSize - this.inSize) / 2);//goal grid offset from top left
            this.colors = level[2];//# of colors used
            this.pattern = level[3];//pattern of colors used (passed into cell, which determines own color)
            this.inCap = this.inSize * this.inSize;
            this.outCap = this.outSize * this.outSize;
            //
            this.gamestate = GAMESTATE.RUNNING;
            console.log("Gamestate changed to: 'RUNNING'");
            //
            this.cells = [];
            this.goalMap = Array(this.outCap).fill(this.colors);//reset goal map to default values
            var i;
            for(i = 0; i < this.inCap; i++){//fill in goal values for every generated cell in the goal map
                this.cells.push(new Cell(this, i));
                this.goalMap[this.cells[i].locIndex] = this.cells[i].state;
            }
            //console.log(this.goalMap);
            //
            this.map = level.slice(4, level.length - 1);//set the current map to the saved level input
            this.map.forEach((element, i) => {//loop through map
                if(element != this.inCap){//when cell is filled it carries the index of its filler cell
                    this.cells[element].setLocation(i);//update cell object's location
                }
            });
        }else{
            //var level = lvs[key];//reset variables
            console.log("Load command registered, generating level.");
            this.inSize = 6;//goal grid size
            this.outSize = 12;//total grid size
            this.offset = Math.floor((this.outSize - this.inSize) / 2);//goal grid offset from top left
            this.colors = 3;//# of colors used
            this.pattern = 0;//pattern of colors used (passed into cell, which determines own color)
            this.inCap = this.inSize * this.inSize;
            this.outCap = this.outSize * this.outSize;
            //
            this.gamestate = GAMESTATE.RUNNING;
            console.log("Gamestate changed to: 'RUNNING'");
            //
            this.map = Array(this.outCap).fill(this.inCap);//reset map to default values
            //
            this.cells = [];
            this.goalMap = Array(this.outCap).fill(this.colors);//reset goal map to default values
            console.log("Map values reset, intializing generation loop...");
            var i;
            for(i = 0; i < this.inCap; i++){//fill in goal values for every generated cell in the goal map
                this.cells.push(new Cell(this, i));
                this.goalMap[this.cells[i].locIndex] = this.cells[i].state;
                this.map[this.cells[i].locIndex] = this.cells[i].valIndex;
            }
            //
            console.log("Complete, randomizing switches...");
            this.stopOdds = this.level;//# of loops until chances are 50/50 for stopping
            for(i = 0; Math.random() > i / (i + this.stopOdds); i++){//switch cells for a random number of loops
                var ranCell1 = this.cells[Math.floor(this.inCap * Math.random())];
                var ranCell2 = this.cells[Math.floor(this.inCap * Math.random())];
                console.log(`Switching (${ranCell1.x}, ${ranCell1.y}) and (${ranCell2.x}, ${ranCell2.y})`);
                //
                this.map[ranCell1.locIndex] = ranCell2.valIndex;
                this.map[ranCell2.locIndex] = ranCell1.valIndex;
                let sVal = ranCell2.valIndex;
                let sLoc= ranCell1.locIndex;
                this.cells[ranCell1.valIndex].setLocation(ranCell2.locIndex);
                this.cells[sVal].setLocation(sLoc);
                //console.log(this.cells);
            }
            console.log("Complete!");
            this.grouper.identify();
        }
    }
    //
    checkCompletion(){//check if puzzle is solved
        return !this.map.some((element, i) => {//check through all of map
            if(element != this.inCap){//only check if cell is occupied
                if(this.cells[element].state != this.goalMap[i]){//stop loop and return false if cell isn't in the proper state  
                    return true;//this is reverse by the ! bang operator
                }
            }
        });
    }
    //
    startCreation(){
        var level = lvs[key];
        console.log("Create command registered, entering create mode");
        this.inSize = 6;//puzzle size
        this.outSize = 12;//grid size, don't go within 2 cells
        this.offset = Math.floor((this.outSize - this.inSize) / 2);//offset of puzzle in grid, calculate by default
        this.colors = 3;//number of colors in puzzle
        this.pattern = 0;//0 = double row, 1 = single row, 2 = double column, 3 = single column, 4 = alternating, 5 = squares
        this.inCap = this.inSize * this.inSize;//number of tiles in the puzzle
        this.outCap = this.outSize * this.outSize;//number of cells in the grid
        //
        var i;
        for(i = 0; i < this.outCap; i++){//generate default map states
            this.map.push(this.inCap);//push default cell state
            this.goalMap.push(this.colors);//push goal cell color
        }
        //
        for(i = 0; i < this.inCap; i++){//give every tile an identity and a location on the map
            this.cells.push(new Cell(this, i));
            var temp = this.cells[i];
            this.map[temp.locIndex] = i;
            this.goalMap[temp.locIndex] = temp.state;//this is fine, since the puzzle is generated in a win state by default
        }
    }
}