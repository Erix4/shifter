import Game from "/src/game";

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = window.innerWidth - 30;
const GAME_HEIGHT = window.innerHeight - 30;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

let game = new Game(GAME_WIDTH, GAME_HEIGHT);
game.start();

ctx.clearRect(0, 0, 800, 800);

let lastTime = 0;

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

requestAnimationFrame(gameLoop);