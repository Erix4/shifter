import Game from "/src/game";

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = window.innerWidth - 22;
const GAME_HEIGHT = window.innerHeight - 22;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

let game = new Game(GAME_WIDTH, GAME_HEIGHT);
game.start();

ctx.clearRect(0, 0, 800, 800);

let lastTime = 0;

let whRatio = GAME_WIDTH / GAME_HEIGHT;

let StartBt = document.getElementById("start");
let title = document.getElementById("title");
let menu = document.getElementById("menu");

if(whRatio > 1.3){//horizontal
    title.style.top = "-10%";
    title.style.fontSize = (GAME_WIDTH * .12) + "px"; 
StartBt.style.fontSize = (GAME_WIDTH * .07) + "px";
}else{//vertical
    let divWidth = (whRatio * -70) + 135;
    let divLeft = (100 - divWidth) / 2;
    //
    title.style.top = "-15%";
    menu.style.left = divLeft + "%";
    menu.style.width = divWidth + "%";
    //
    title.style.fontSize = (GAME_WIDTH * .004 * divWidth) + "px"; 
    StartBt.style.fontSize = (GAME_WIDTH * .002 * divWidth) + "px";
}

function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    //
    game.update(deltaTime);
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    game.draw(ctx);
    //
    requestAnimationFrame(gameLoop);
}

export function startGame(){
    game.level++;
    console.log(`Starting game`);
    game.loadLevel(this.game.level);
    menu.style.visibility = "hidden";
}

requestAnimationFrame(gameLoop);