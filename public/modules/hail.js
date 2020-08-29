import Token from "./token.js"

class Hail extends Token {
    constructor(x, y, size) {
        super(x, y, size);
    }

    draw(p5) {
        if (this._visible) {
            p5.push();
            p5.translate(this._pos.x * p5.width, this._pos.y * p5.height);
            for (let i = 0; i < 5; i++) {
                p5.fill(
                    this._color[0], 
                    this._color[1], 
                    this._color[2], 
                    this._color[3]*p5.random(0.6, 1)
                );
                p5.ellipse(p5.random(-this._size, this._size), p5.random(-this._size, this._size), this._size/2, this._size/2);
            }
            p5.pop();
        }
    }
}

export default Hail;