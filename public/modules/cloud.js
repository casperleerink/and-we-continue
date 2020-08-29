import Token from "./token.js"

class Cloud extends Token {
    constructor(x, y, size, p) {
        super(x, y, size);
        this._colors = [];
        this._positions = [];
        for (let i = 0; i < 5; i++) {
            this._colors.push(p.random(0.3, 1.0));
            this._positions.push({
                x: p.random(-1, 1),
                y: p.random(-1, 1),
            });
        }
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
                    this._color[3] * this._colors[i],
                );
                p5.ellipse(this._positions[i].x * this._size, this._positions[i].y * this._size, this._size, this._size);
            }
            p5.pop();
        }
    }
}

export default Cloud;