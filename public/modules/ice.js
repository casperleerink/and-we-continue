import Token from "./token.js"

class Ice extends Token {
    constructor(x, y, size, p5) {
        super(x, y, size);
        this._complexity = p5.random([3, 4, 5, 6, 7]);
        this._angle = p5.TWO_PI / this._complexity;
        this._tilt = p5.random(0.0, p5.TWO_PI);
    }

    draw(p5) {
        if (this._visible) {
            //Draw the shape in position
            p5.push();
            p5.translate(this._pos.x * p5.width, this._pos.y * p5.height);
            p5.rotate(this._tilt);
            p5.fill(this._color);
            p5.noStroke();
            p5.beginShape();
            for (let a = 0; a < p5.TWO_PI; a += this._angle) {
                const sx = p5.cos(a) * (this._size*0.7);
                const sy = p5.sin(a) * (this._size*0.7);
                p5.vertex(sx, sy);
            }
            p5.endShape(p5.CLOSE);
            p5.pop();
        }
    }
}

export default Ice;