import Token from "./token.js"

class River extends Token {
    constructor(x, y, size, p) {
        super(x, y, size);
        this._tilt = p.random(0.0, p.TWO_PI);
    }

    draw(p5) {
        if (this._visible) {
            p5.push();
            p5.translate(this._pos.x * p5.width, this._pos.y * p5.height);
            p5.rotate(this._tilt);
            p5.stroke(this._color);
            p5.noFill();
            p5.strokeWeight(this._size*0.5);
            p5.bezier(-this._size, -this._size, this._size, 0, -this._size, this._size, this._size, this._size);
            p5.pop();
        }
    }
}

export default River;