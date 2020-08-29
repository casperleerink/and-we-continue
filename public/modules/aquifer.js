import Token from "./token.js"

class Aquifer extends Token {
    constructor(x, y, size) {
        super(x, y, size);
    }

    draw(p5) {
        if (this._visible) {
            p5.push();
            p5.translate(this._pos.x * p5.width, this._pos.y * p5.height);
            p5.fill(this._color);
            p5.rect(0, 0, this._size*1.7, this._size);
            p5.pop();
        }
    }
}

export default Aquifer;