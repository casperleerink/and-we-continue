class Token {
    constructor(x, y, size) {
        this._pos = {
            x,
            y,
        }
        this._size = size;
        this._sizeMult = 1.0;
        this._color = [6, 90, 150, 255];
        this._visible = true;
    }
    get pos() {
        return this._pos;
    }
    set pos(pos) {
        if (
            pos.x>=0.0 &&
            pos.x<=1.0 &&
            pos.y>=0.0 &&
            pos.y<=1.0
        ) {
            this._pos = pos;
        } else {
            console.error('position x and y has to be a number between 0 and 1');
        }
    }
    get size() {
        return this._size;
    }
    set size(s) {
        if (typeof s === "number") {
            this._size = s;
        } else {
            console.error('size has to be a number');
        }
    }
    get color() {
        return this._color;
    }
    set color(c) {
        if (
            c.r>=0 &&
            c.r<=255 &&
            c.g>=0 &&
            c.g<=255 &&
            c.b>=0 &&
            c.b<=255 &&
            c.a>=0 &&
            c.a<=255
        ) {
            this._color = [c.r, c.g, c.b, c.a];
        } else {
            console.error('rgba all need to be between 0 and 255');
        }
    }
    get visible() {
        return this._visible;
    }
    set visible(b) {
        if (typeof b === "boolean") {
            this._visible = b;   
        } else {
            console.error('visible var should be boolean');
        }
    }

    /**
     * Check if a given coordinate is in the token
     * @method isWithinBox
     * @param {Number}  x coordinate
     * @param {Number}  y coordinate
     * @return {bool} true if within false otherwise
     */
    isWithinBox(x, y, p5) {
        const xDiff = Math.abs(x - this._pos.x);
        const yDiff = Math.abs(y - this._pos.y);
        if (xDiff <= this._size/p5.width && yDiff <= this._size/p5.height) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Add text if hovered
     * @method onHover
     * @param {Number}  x coordinate
     * @param {Number}  y coordinate
     */
    onHover(x, y, p5, line) {
        if (this.isWithinBox(x, y, p5)) {
            // p5.push();
            // p5.textSize(10);
            // p5.noStroke();
            // p5.fill(this._color);
            // p5.text("My time feels long here, longer than you.", this._pos.x*p5.width, this._pos.y*p5.height-this._size-5);
            // p5.pop();
            this._sizeMult = p5.sin(p5.frameCount * 0.03) * 0.3 + 1.0;
            if (typeof line === 'string') {
                p5.push();
                p5.noStroke();
                p5.fill(this._color);
                p5.text(line, this._pos.x*p5.width, this._pos.y*p5.height-this._size-10);
                p5.pop();
            }
        } else {
            this._sizeMult = 1.0;
        }
    }

    onClick(x, y, p5, callback) {
        if (this.isWithinBox(x, y, p5)) {
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
}

export default Token;