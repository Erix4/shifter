//need to rebuild this
export default class InputHandler{
    constructor(game){
        this.game = game;
        this.lastMouseEvent = null;
        //
        this.touched = false;
        this.reverb = false;//prevent second click on touch release
        document.addEventListener("mousemove", event => {
            if(this.game.gamestate == 0){
                if(this.game.moving == this.game.inSize){
                    if(!this.touched){
                        this.game.grouper.selectGroup(event);
                        //console.log("Selecting group");
                    }
                }else{
                    this.game.moveGroup(event);
                }
            }
            //console.log("offset x: " + event.offsetX);
            this.lastMouseEvent = event;
            this.touched = false;
        });
        //
        document.addEventListener("mousedown", event => {
            if(!this.reverb){
                if(this.game.gamestate > 0){
                    this.game.menu.checkNext(event);
                    //console.log("Identifying");
                    this.game.grouper.identify();
                    this.game.grouper.selectGroup(event);
                }else if(this.game.grouper.selectedGroup != this.game.inSize){
                    this.game.startGroupMove(event);
                }
            }else{
                this.reverb = false;
            }
        });
        //
        document.addEventListener("keydown", event => {
            switch (event.key){
                case " ":
                    if(this.game.gamestate == 0){
                        this.game.viewMode = (this.game.viewMode * -1) + 1;
                        //console.log(`Command registered, viewMode: ${this.game.viewMode}`);
                        //console.log("offset x: " + this.lastMouseEvent.offsetX);
                        this.game.grouper.identify();
                        this.game.grouper.selectGroup(this.lastMouseEvent);
                    }
                    break;
                case "Enter":
                    switch (this.game.gamestate){
                        case 0:
                            this.game.logInfo();
                            break;
                        case 1:
                            this.game.level++;
                            this.game.loadLevel(this.game.level);
                            this.game.grouper.identify();
                            this.game.grouper.selectGroup(this.lastMouseEvent);
                            break;
                        case 2:
                            this.game.gamestate = 1;
                            break;
                        case 3:
                            this.game.level++;
                            this.game.loadLevel(this.game.level);
                            this.game.grouper.identify();
                            this.game.grouper.selectGroup(this.lastMouseEvent);
                            break;
                    }
                    break;
                case "Backspace":
                    this.game.loadLevel(this.game.level);
                    break;
            }
        });
        //
        document.addEventListener("mouseup", event => {
            if(this.game.moving != this.game.inSize){
                this.game.stopGroupMove();
            }
        });
        //
        document.addEventListener("touchstart", event => {
            event.offsetX = event.touches[0].pageX;
            event.offsetY = event.touches[0].pageY;
            if(this.game.gamestate > 0){
                this.game.menu.checkNext(event);
                this.game.grouper.identify();
            }else{
                this.game.grouper.selectGroup(event);
                if(this.game.grouper.selectedGroup != this.game.inSize){
                    console.log("selected group: " + this.game.grouper.selectedGroup);
                    this.game.startGroupMove(event);
                }else{
                    this.game.viewMode = (this.game.viewMode * -1) + 1;
                    this.game.grouper.identify();
                    this.game.grouper.selectGroup(this.lastMouseEvent);
                }
            }
            console.log(`Touch, y:${event.offsetY}`);
            this.touched = true;
        });
        //
        document.addEventListener("touchmove", event => {
            event.offsetX = event.touches[event.touches.length - 1].pageX;
            event.offsetY = event.touches[event.touches.length - 1].pageY;
            if(this.game.gamestate == 0){
                if(this.game.moving == this.game.inSize){
                    this.game.grouper.selectGroup(event);
                }else{
                    this.game.moveGroup(event);
                }
            }
            //console.log("offset x: " + event.offsetX);
            this.lastMouseEvent = event;
            //console.log("touch moving");
        });
        //
        document.addEventListener("touchend", event => {
            if(this.game.moving != this.game.inSize){
                this.game.stopGroupMove();
            }
            event.offsetX = 0;
            event.offsetY = 0;
            this.game.grouper.selectGroup(event);
            console.log("group cleared");
            this.reverb = true;
        });
    }
    //
}