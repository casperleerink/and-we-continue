import Token from "./token.js"

class Me extends Token {
    constructor(x, y, size, type) {
        super(x, y, size);
        this._type = type;
        this._velocity = {
            x: 0.0,
            y: 0.0,
        }
        this._friction = 0.05; //0 = no friction 1=full friction (immediate stop)
        this._visibleToOthers = true;
    }

    get type() {
        return this._type;
    }

    get visibleToOthers() {
        return this._visibleToOthers;
    }

    set visibleToOthers(b) {
        this._visibleToOthers = b;
    }

    get velocity() {
        return this._velocity;
    }
    /**
     * Sets velocity directly.
     * @method setVelocity
     * @param {Number}  x value between 0 and 1
     * @param {Number}  y value between 0 and 1
     */
    setVelocity(x, y) {
        if (x > 0.0 && x < 1.0) {
            this._velocity.x = x;
        } else {
            console.error('y has to be a number between 0. and 1.')
        }
        if (y > 0.0 && y < 1.0) {
            this._velocity.y = y;
        }
        else {
            console.error('x has to be a number between 0. and 1.')
        }
    }

    isMoving() {
        if (this._velocity.x === 0.0 && this._velocity.y === 0.0) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Pushes ice toward a point.
     * The force is added to the current velocity.
     *
     * @method attractionPoint
     * @param {Number}  scale Scalar speed to add 1 = full distance 0= no distance
     * @param {Number}  pointX Direction x coordinate
     * @param {Number}  pointY Direction y coordinate
     */
    attractionPoint(scale, pointX, pointY, p5) {
        const dist = p5.dist(this._pos.x, this._pos.y, pointX, pointY);
        const magnitude = dist * scale;
        const angle = p5.atan2(pointY-this._pos.y, pointX-this._pos.x);
        this._velocity.x += p5.cos(angle) * magnitude;
        this._velocity.y += p5.sin(angle) * magnitude;
    };

    //helper for the draw function that handles all the movement based on velocity and friction.
    moveStep() {
        this._pos.x += this._velocity.x;
        this._pos.y += this._velocity.y;
        this._velocity.x *= 1.0-this._friction;
        this._velocity.y *= 1.0-this._friction;
        this.borderCheck();
        if (this._velocity.x > -0.0001 && this._velocity.x < 0.0001) {
            this._velocity.x = 0.0;
        }
        if (this._velocity.y > -0.0001 && this._velocity.y < 0.0001) {
            this._velocity.y = 0.0;
        }
    }
    borderCheck() {
        if (this._pos.x > 0.95 || this._pos.x < 0.05) {
            this._velocity.x *= -1;
        }
        if (this._pos.y > 0.95 || this._pos.y < 0.05) {
            this._velocity.y *= -1;
        }
    }

    //This method should be called inside p5 draw function
    draw(p5, img) {
        if (this._visible) {
            this.moveStep(); //renew position
            const currentSize = this._size * this._sizeMult;
            p5.push();
            p5.fill(this._color);
            p5.ellipse(this._pos.x*p5.width, this._pos.y*p5.height, currentSize*4, currentSize*4);
            p5.image(img, this._pos.x*p5.width, this._pos.y*p5.height, currentSize*4, currentSize*3.5);
            p5.pop();
        }
    }

    follow(p5, x, y, closeness) {
        const d = p5.dist(this._pos.x, this._pos.y, x, y);
        const angle = p5.atan2(y-this._pos.y, x-this._pos.x);
        const magnitude = p5.map(d, 0.0, 1.0, closeness, 1.0) * 0.03;
        this._velocity.x = p5.cos(angle) * magnitude;
        this._velocity.y = p5.sin(angle) * magnitude;
    }
}

export default Me;