export default class Artist{
    constructor(game){
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        //
        this.game = game;
        this.inSize = this.game.inSize;
        this.outSize = game.outSize;
        this.inCap = game.inCap;
        this.outCap = game.outCap;
        this.offset = game.offset;
        //
        this.xStart = 0;
        this.yStart = 0;
        this.width = this.gameWidth;
        //
        if(this.gameWidth > this.gameHeight){
            this.xStart = (this.gameWidth - this.gameHeight) / 2;
            this.width = this.gameHeight;
        }else{
            this.yStart = (this.gameHeight - this.gameWidth) / 2;
        }
        //
        this.unit = this.width / this.outSize;
        console.log("outsize: " + this.outSize + ", unit: " + this.unit);
        //
    }
    //
    draw(ctx){
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000"
        //
        this.game.cells.forEach(element => {
            ctx.beginPath();
            ctx.rect(this.xStart + (element.x * this.unit), this.yStart + (element.y * this.unit),
            this.unit, this.unit);
            switch(element.state){
                case 0:
                    ctx.fillStyle = "gray";
                    break;
                case 1:
                    ctx.fillStyle = "blue";
                    break;
                case 2:
                    ctx.fillStyle = "red";
                    break;
                case 3:
                    ctx.fillStyle = "purple";
                    break;
            }
            ctx.fill();
            //ctx.font = '20px "Arial"';
            //ctx.fillStyle = "black";
            //ctx.fillText(`${element.valIndex.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}, ${element.locIndex}`, this.xStart + (element.x * this.unit) + 10, this.yStart + ((element.y + 1) * this.unit) - 20);
        });
        //
        ctx.beginPath();
        ctx.moveTo(this.xStart, this.yStart);
        ctx.lineTo(this.xStart, this.yStart + this.width);
        ctx.stroke();
        //
        ctx.beginPath();
        ctx.moveTo(this.xStart + this.width, this.yStart);
        ctx.lineTo(this.xStart + this.width, this.yStart + this.width);
        ctx.stroke();
        //
        ctx.beginPath();
        ctx.moveTo(this.xStart, this.yStart);
        ctx.lineTo(this.xStart + this.width, this.yStart);
        ctx.stroke();
        //
        ctx.beginPath();
        ctx.moveTo(this.xStart, this.yStart + this.width);
        ctx.lineTo(this.xStart + this.width, this.yStart + this.width);
        ctx.stroke();
        //
        var i;
        for (i = 1; i < this.outSize; i++){
            ctx.beginPath();
            ctx.moveTo(this.xStart + (i * this.unit), this.yStart);
            ctx.lineTo(this.xStart + (i * this.unit), this.yStart + this.width);
            ctx.stroke();
        }
        //
        for (i = 1; i < this.outSize; i++){
            ctx.beginPath();
            ctx.moveTo(this.xStart, this.yStart + (i * this.unit));
            ctx.lineTo(this.xStart + this.width, this.yStart + (i * this.unit));
            ctx.stroke();
        }
        //
        ctx.lineWidth = this.offset;
        //
        ctx.beginPath();
        ctx.rect(this.xStart + (this.offset * this.unit), this.yStart + (this.offset * this.unit),
        this.inSize * this.unit, this.inSize * this.unit);
        ctx.stroke();
        //
    }
    //
    update(deltaTime){
        //
    }
}