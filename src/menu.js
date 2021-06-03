export default class Menu {
    constructor(game){
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        //
        this.game = game;
        //
        this.fontSize = this.game.artist.width / 10;
        //
        this.boundLeft = 0;
        this.boundRight = 0;
        this.boundTop = 0;
        this.boundBottom = 0;
    }
    //
    drawWon(ctx){
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.rect(this.gameWidth / 3, this.gameHeight / 3,
            this.gameWidth / 3, this.gameHeight / 3);
        ctx.fill();
        //
        ctx.font = "bold 25px 'Verdana'";
        var txt = "Congratulations!";
        //
        let x0 = (this.gameWidth / 2) - (ctx.measureText(txt).width / 2);
        let x1 = (this.gameWidth / 2) + (ctx.measureText(txt).width / 2);
        var gradient = ctx.createLinearGradient(x0, 0, x1, 0);
        gradient.addColorStop("0", "blue");
        gradient.addColorStop("1", "red");
        ctx.fillStyle = gradient;
        ctx.fillText(txt, x0, this.gameHeight / 2 - 20);
        //
        txt = "You Won!"
        x0 = (this.gameWidth / 2) - (ctx.measureText(txt).width / 2);
        x1 = (this.gameWidth / 2) + (ctx.measureText(txt).width / 2);
        gradient = ctx.createLinearGradient(x0, 0, x1, 0);
        gradient.addColorStop("0", "blue");
        gradient.addColorStop("1", "red");
        ctx.fillStyle = gradient;
        ctx.fillText(txt, (this.gameWidth / 2) - (ctx.measureText(txt).width / 2), this.gameHeight / 2 + 20);
    }
    //
    drawMenu(ctx){
        ctx.font = "bold 25px 'Verdana'";
        ctx.fillStyle = "black";
        var txt = "Next Level";
        this.boundLeft = (this.gameWidth / 2) - (ctx.measureText(txt).width / 2);
        this.boundRight = this.boundLeft + ctx.measureText(txt).width;
        this.boundTop = this.gameHeight / 2 - (this.fontSize / 2);
        this.boundBottom = this.boundTop + this.fontSize;
        ctx.fillText(txt, this.boundLeft, this.gameHeight / 2);
    }
    //
    drawStart(ctx){
        ctx.font = `bold ${this.fontSize}px 'Verdana'`;
        ctx.fillStyle = "black";
        var txt = "Start!";
        this.boundLeft = (this.gameWidth / 2) - (ctx.measureText(txt).width / 2);
        this.boundRight = this.boundLeft + ctx.measureText(txt).width;
        this.boundTop = this.gameHeight / 2 - (this.fontSize / 2);
        this.boundBottom = this.boundTop + this.fontSize;
        ctx.fillText(txt, this.boundLeft, this.gameHeight / 2);
    }
    //
    update(deltaTime){
        //
    }
    //
    checkNext(event){
        var bounds = {};
        bounds.left = this.boundLeft;
        bounds.right = this.boundRight;
        bounds.top = this.boundTop;
        bounds.bottom = this.boundBottom;
        //console.table(bounds);
        //console.log(`X: ${event.offsetX}, Y: ${event.offsetY}`);
        if((event.offsetX > this.boundLeft &&
            event.offsetX < this.boundRight &&
            event.offsetY > this.boundTop &&
            event.offsetY < this.boundBottom)
            || this.game.gamestate > 1){
            this.game.level++;
            if(this.game.gameMode == 1){
                document.cookie = `level=${this.game.level}`;
                console.log(`Cookie set, level: ${this.game.level}`);
            }
            console.log(`Bounds successful, level: ${this.game.level}`);
            this.game.loadLevel(this.game.level);
        }
    }
}