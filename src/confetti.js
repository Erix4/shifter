export default class Confetto{
    constructor(game, mode){
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        //
        this.game = game;
        //
        this.size = {width: 30, height: 10};//dimensions of the confetto
        this.hs = {w: this.size.width / 2, h: this.size.height / 2};//half the dimension (for offsetting to the center)
        //
        this.spin = getRandom(-180, 180);
        //
        if(mode == 0){
            this.position = {x: this.gameWidth / 2, y: this.gameHeight / 2};
            this.direction = getRandom(-this.game.confAng, this.game.confAng);
            //
            this.speed = {d: getRandom(700, 900), angle: getRandom(-100, 100)};//pixels per second
            this.accel = 0;//-250;//pixels per second per second (angle doesn't accelerate)
        }else{
            this.position = {x: getRandom(0, this.gameWidth), y: -this.size.width};
            this.direction = 180;
            //
            this.speed = {d: getRandom(20, 80), angle: getRandom(-100, 100)};
            this.accel = 0;
        }
        //
        this.toBeDeleted = false;
        //
        this.cN = Math.floor(getRandom(0,4.5));
        switch(this.cN){
            case 0:
                this.color = "red";
                break;
            case 1:
                this.color = "blue";
                break;
            case 2:
                this.color = "green";
                break;
            case 3:
                this.color = "orange";
                break;
            case 4:
                this.color = "purple";
                break;
        }
        //
        //console.log(`Confetto init at ${this.position.x}, ${this.position.y}`);
    }
    //
    draw(ctx){
        //
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(toRadians(this.spin));
        ctx.translate(-this.position.x, -this.position.y);
        ctx.beginPath();
        ctx.rect(this.position.x - this.hs.w, this.position.y - this.hs.h, this.size.width, this.size.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(-toRadians(this.spin));
        ctx.translate(-this.position.x, -this.position.y);
        //
    }
    //
    update(deltaTime){
        if(this.position.y > this.gameHeight + this.hs.w || (this.mode == 0 && this.position.y < -this.hs.w)){
            this.toBeDeleted = true;
        }
        //
        this.speed.d += this.accel * deltaTime / 1000;
        this.spin += this.speed.angle * deltaTime / 1000;
        //
        this.position.x += this.speed.d * Math.sin(toRadians(this.direction)) * deltaTime / 1000;
        this.position.y -= this.speed.d * Math.cos(toRadians(this.direction)) * deltaTime / 1000;
    }
}

function getRandom(min, max){
    return (Math.random() * (max - min)) + min;
}

function toRadians(deg){
    return deg * Math.PI / 180;
}

function fixAngle(angle){
    if(angle > 180){
        angle -= 360;
    }else if(angle < -180){
        angle += 360;
    }
    return angle;
}