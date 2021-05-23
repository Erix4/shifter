export default class Grouper{
    constructor(game){
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        //
        this.game = game;
        this.inSize = this.game.inSize;
        this.outSize = this.game.outSize;
        this.inCap = this.game.inCap;
        this.outCap = this.game.outCap;
        //
        this.unit = this.game.artist.unit;
        this.xStart = this.game.artist.xStart;
        this.yStart = this.game.artist.yStart;
        //
        this.groups = new Array();
        //
        this.selectedGroup = this.inSize;
        this.groupStart = 0;
    }
    //
    draw(ctx){
        //console.log(this.groups);
        //
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        //
        this.identify();
        //
        if(this.game.viewMode == 0){//rows
            this.groups.forEach((element, i) => {
                if(i != this.selectedGroup){
                    ctx.beginPath();
                    ctx.rect(this.xStart + (element[1] * this.unit), this.yStart + ([element[0]] * this.unit),
                    this.inSize * this.unit, 1 * this.unit);
                    ctx.stroke();
                }
            });
            //
            if(this.selectedGroup != this.inSize){
                //console.log("selected: " + this.selectedGroup + ", groups: " + this.groups);
                var selec = this.groups[this.selectedGroup];
                ctx.strokeStyle = "#F0FC03";
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.rect(this.xStart + (selec[1] * this.unit), this.yStart + (selec[0] * this.unit),
                this.inSize * this.unit, 1 * this.unit);
                ctx.stroke();
            }
        }else{//columns
            this.groups.forEach((element, i) => {
                if (i != this.selectedGroup){
                    ctx.beginPath();
                    ctx.rect(this.xStart + (element[0] * this.unit), this.yStart + ([element[1]] * this.unit),
                    1 * this.unit, this.inSize * this.unit);
                    ctx.stroke();
                }
            });
            //
            if(this.selectedGroup != this.inSize){
                var selec = this.groups[this.selectedGroup];
                ctx.strokeStyle = "#F0FC03";
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.rect(this.xStart + (selec[0] * this.unit), this.yStart + (selec[1] * this.unit),
                1 * this.unit, this.inSize * this.unit);
                ctx.stroke();
            }
        }
        //
    }
    //
    update(deltaTime){
        //
    }
    //
    identify(){//find the groups of cells (rows and columns)
        if(this.game.moving == this.inSize){
            this.groups = [];
            //
            var i;
            if(this.game.viewMode == 0){//rows
                for (i = 0; i < this.outSize; i++){//cycle rows (change y axis)
                    var line = false;
                    var build = 0;
                    var grStart = 0;
                    var cellList = [];
                    for (var n = 0; n < this.outSize; n++){//cycle cells in row (change x axis)
                        if(this.game.map[(this.outSize * i) + n] != this.inCap){
                            if(line == false){//new group started
                                line = true;
                                grStart = n;//set group start
                            }
                            cellList.push(this.game.map[(this.outSize * i) + n]);
                            build++;
                        }else if(line == true){//line finished
                            if(build == this.inSize){//full 6 cell group
                                this.groups.push([i, grStart].concat(cellList));//add group to list [row, cell start]
                                build = 0;
                                break;
                            }else{//more or less than 6, move on
                                break;
                            }
                        }
                    }
                    if(build == this.inSize){//full 6 cell group
                        this.groups.push([i, grStart].concat(cellList));//add group to list [row, cell start, cells]
                    }
                }
            }else{//columns
                for (i = 0; i < this.outSize; i++){//cycle columns (change x axis)
                    var line = false;
                    var build = 0;
                    var grStart = 0;
                    var cellList = [];
                    for (var n = 0; n < this.outSize; n++){//cycle cells in column (change y axis)
                        if(this.game.map[(this.outSize * n) + i] != this.inCap){
                            if(line == false){//new group started
                                line = true;
                                grStart = n;//set group start
                            }
                            build++;
                            cellList.push(this.game.map[(this.outSize * n) + i]);
                        }else if(line == true){//line finished
                            if(build == this.inSize){//full 6 cell group
                                this.groups.push([i, grStart].concat(cellList));//add group to list [column, cell start]
                                build = 0;
                                break;
                            }else{//more or less than 6, move on
                                break;
                            }
                        }
                    }
                    if(build == this.inSize){//full 6 cell group
                        this.groups.push([i, grStart].concat(cellList));//add group to list [row, cell start]
                    }
                }
            }
        }
    }
    //
    selectGroup(event){//identify group beneath cursor
        //console.log("Reselecting group, viewmode: " + this.game.viewMode);
        //console.log("y input: " + event.offsetY);
        this.selectedGroup = this.inSize;
        if(this.game.viewMode == 0){//rows
            this.groups.some((element, i) => {
                let left = element[1] * this.unit + this.xStart;
                let right = left + (this.inSize * this.unit);
                let top = element[0] * this.unit + this.yStart;
                let bottom = top + this.unit;
                if(event.offsetX > left &&
                    event.offsetX < right &&
                    event.offsetY > top &&
                    event.offsetY < bottom)
                {
                    this.selectedGroup = i;
                    return true;
                }
            });
        }else{//columns
            this.groups.some((element, i) => {
                let left = element[0] * this.unit + this.xStart;
                let right = left + this.unit;
                let top = element[1] * this.unit + this.yStart;
                let bottom = top + (this.inSize * this.unit);
                if(event.offsetX > left &&
                    event.offsetX < right &&
                    event.offsetY > top &&
                    event.offsetY < bottom)
                {
                    this.selectedGroup = i;
                    //console.log("Successful: " + i);
                    return true;
                }
            });
        }
        //
    }
}