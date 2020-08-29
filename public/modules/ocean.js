import Token from "./token.js"

class Ocean extends Token {
    constructor(x, y, size) {
        super(x, y, size);
    }

    draw(p5) {
        if (this._visible) {
            p5.push();
            p5.fill(this._color);
            p5.noStroke();
            p5.ellipse(this._pos.x * p5.width, this._pos.y * p5.height, this._size);
            p5.pop(); 
        }
    }
}

export default Ocean;