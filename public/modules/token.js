import {clip} from "./util.js";

class Token {
    constructor(x, y, size, p, type) {
        this._pos = {
            x,
            y,
        }
        this._size = size;
        this._type = type;
        this._color = [6, 90, 150, 255];
        this._visible = false;

        //for ice and river only
        this._tilt = p.random(0.0, p.TWO_PI);

        //for cloud only
        this._colors = [];
        this._positions = [];
        for (let i = 0; i < 5; i++) {
            this._colors.push(p.random(0.2, 0.7));
            this._positions.push({
                x: p.random(-1, 1),
                y: p.random(-1, 1),
            });
        }
    }
    get pos() {
        return this._pos;
    }
    set pos(pos) {
        this._pos = {
            x: clip(pos.x, 0., 1.),
            y: clip(pos.y, 0., 1.),
        };
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
    get type() {
        return this._type;
    }
    set type(t) {
        if (t !== this._type) {
            this._type = t;
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

    draw(p5) {
        if (this._visible) {
            switch (this._type) {
                case "ICE":
                    //Draw the shape in position
                    p5.push();
                    p5.translate(this._pos.x * p5.width, this._pos.y * p5.height);
                    p5.rotate(this._tilt);
                    p5.fill(this._color);
                    p5.noStroke();
                    p5.beginShape();
                    for (let a = 0; a < p5.TWO_PI; a += p5.TWO_PI/6) {
                        const sx = p5.cos(a) * (this._size*0.7);
                        const sy = p5.sin(a) * (this._size*0.7);
                        p5.vertex(sx, sy);
                    }
                    p5.endShape(p5.CLOSE);
                    p5.pop();
                    break;
                case "CLOUD":
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
                    break;
                case "PRECIPITATION":
                    p5.push();
                    p5.translate(this._pos.x * p5.width, this._pos.y * p5.height);
                    for (let i = 0; i < 5; i++) {
                        p5.fill(
                            this._color[0], 
                            this._color[1], 
                            this._color[2], 
                            this._color[3]*p5.random(0.3, 0.9)
                        );
                        p5.ellipse(p5.random(-this._size, this._size), p5.random(-this._size, this._size), this._size/2, this._size/2);
                    }
                    p5.pop();
                    break;
                case "RIVER":
                    p5.push();
                    p5.translate(this._pos.x * p5.width, this._pos.y * p5.height);
                    p5.rotate(this._tilt);
                    p5.stroke(this._color);
                    p5.noFill();
                    p5.strokeWeight(this._size*0.2);
                    p5.bezier(-this._size, -this._size, this._size, 0, -this._size, this._size, this._size, this._size);
                    p5.pop();
                    break;
                case "OCEAN":
                    p5.push();
                    p5.fill(this._color);
                    p5.noStroke();
                    p5.ellipse(this._pos.x * p5.width, this._pos.y * p5.height, this._size*1.35);
                    p5.pop();
                    break;
                case "AQUIFER":
                    p5.push();
                    p5.translate(this._pos.x * p5.width, this._pos.y * p5.height);
                    p5.fill(this._color);
                    p5.rect(0, 0, this._size*1.7778, this._size);
                    p5.pop();
                    break;
                default:
                    p5.push();
                    p5.fill(this._color);
                    p5.noStroke();
                    p5.ellipse(this._pos.x * p5.width, this._pos.y * p5.height, this._size*1.35);
                    p5.pop();
                    break;
            }
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
    onHover(x, y, p5, callback) {
        if (this._visible) {
            if (this.isWithinBox(x, y, p5)) {
                this._size = p5.sin(p5.frameCount * 0.06) * 1.5 + p5.width*0.005;
                if (typeof callback === 'function') {
                    callback();
                }
            } 
        }
    }

    onClick(x, y, p5, callback) {
        if (this.isWithinBox(x, y, p5)) {
            if (typeof callback === 'function') {
                callback();
            }
        }
    }

    localText(p, text, fade) {
        p.push();
        p.noStroke();
        const color = [...this._color];
        color[3] *= fade;
        p.fill(color);
        p.textSize(p.width * 0.015);
        p.text(text, this._pos.x*p.width, this._pos.y*p.height-this._size-10);
        p.pop();
    }

    part3Text(p, data, time) {
        p.push();
        p.noStroke();
        p.textSize(p.width * 0.015);
        data.forEach(l => {
            //only show the line at the right time
            if (time >= l.s && time <= l.e) {
                let fade = 1;
                const fadeTime = (l.e - l.s) / 3;
                const timeFromStart = time - l.s;
                const timeTillEnd = l.e - time;
                if (timeFromStart < fadeTime) {
                    fade = timeFromStart / fadeTime
                } else if (timeTillEnd < fadeTime) {
                    fade = timeTillEnd / fadeTime;
                }
                const color = [...this._color];
                color[3] *= fade;
                p.fill(color);
                p.text(l.text, this._pos.x*p.width, this._pos.y*p.height-this._size-10);
            }
        });
        p.pop();
    }
}

export default Token;