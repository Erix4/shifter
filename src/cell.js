export default class Cell{
    constructor(game, valIndex){
        //
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        //
        this.game = game;
        this.valIndex = valIndex;//indentity by goal location
        this.inSize = game.inSize;//game's inner size
        this.outSize = game.outSize;//game's outer size
        this.inCap = game.inCap;//total # of inner cells
        this.outCap = game.outCap;//total # of outer cells
        this.offset = game.offset;//offset of puzzle in grid
        //
        this.iy = Math.floor(valIndex / this.inSize);//inner x
        this.ix = valIndex - (this.inSize * this.iy);//inner y
        //
        this.y = this.iy + this.offset;//current x
        this.x = this.ix + this.offset;//current y
        this.locIndex = (this.outSize * this.y) + this.x;//location index on entire grid
        this.orx = this.x;//starting x
        this.ory = this.y;//starting y
        //
        switch(game.pattern){
            case 0:
                this.state = Math.floor(this.iy / 2) - (game.colors * Math.floor(this.iy / (2 * game.colors)));
                break;
            case 1:
                this.state = this.iy - (game.colors * Math.floor(this.iy / game.colors));
                break;
            case 2:
                this.state = Math.floor(this.ix / 2) - (game.colors * Math.floor(this.ix / (2 * game.colors)));
                break;
            case 3:
                this.state = this.ix - (game.colors * Math.floor(this.ix / game.colors));
                break;
            case 4:
                this.state = this.valIndex - (game.colors * Math.floor(this.valIndex / game.colors));
                break;
            case 5:
                this.state = (valIndex - (2 * Math.floor(valIndex / 2))) + (2 * (this.iy - (2 * Math.floor(this.iy / 2))));
                break;
        }
        //
    }
    //
    move(cx, cy){
        this.y = this.ory + cy;//calc new y (move origin y plus change y)
        this.x = this.orx + cx;//calc new x (move origin x plus change x)
        //
        this.game.map[this.locIndex] = this.inCap;//set old map location as default
        this.locIndex = (this.outSize * this.y) + this.x;//find new location index
        this.game.map[this.locIndex] = this.valIndex;//set new map location as cell value
    }
    //
    resetOrigin(){
        this.ory = this.y;//reset starting location for y group shift
        this.orx = this.x;//reset starting location for x group shift
    }
    //
    setLocation(locIndex){
        this.locIndex = locIndex;
        //
        this.y = Math.floor(locIndex / this.outSize);
        this.x = locIndex - (this.outSize * this.y);
        this.resetOrigin();
    }
}