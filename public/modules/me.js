import Token from "./token.js"

class Me extends Token {
    constructor(x, y, size, p, type, socket) {
        super(x, y, size, p, type);
        this._velocity = {
            x: 0.0,
            y: 0.0,
        }
        this._visible = true;
        this._friction = 0.0; //0 = no friction 1=full friction (immediate stop)
        this._color[1] = 150;
        this._following = undefined;
        this._socket = socket;
    }

    get friction() {
        return this._friction;
    }

    set friction(f) {
        if (f <= 1.0 && f >= 0.0) {
            this._friction = f;
        } else {
            console.error("Friction should be a number between 0. and 1.")
        }
    }
    get socket() {
        return this._socket;
    }
    get following() {
        return this._following;
    }
    set following(other) {
        this._following = other;
    }
    get velocity() {
        return this._velocity;
    }
    set velocityX(x) {
        if (x >= -1.0 && x <= 1.0) {
            this._velocity.x = x;
        } else {
            console.error('x has to be a number between -1. and 1.')
        }
    }
    set velocityY(y) {
        if (y >= -1.0 && y <= 1.0) {
            this._velocity.y = y;
        } else {
            console.error('y has to be a number between -1. and 1.')
        }
    }

    get type() {
        return super.type;
    }

    set type(t) {
        if (t !== this._type) {
            super.type = t;
            this._socket.emit('newType', t);
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
        // if (this._velocity.x > -0.0001 && this._velocity.x < 0.0001) {
        //     this._velocity.x = 0.0;
        // }
        // if (this._velocity.y > -0.0001 && this._velocity.y < 0.0001) {
        //     this._velocity.y = 0.0;
        // }
    }
    borderCheck() {
        if (this._pos.x > 1.0 || this._pos.x < 0.0) {
            this._velocity.x *= -1;
        }
        if (this._pos.y > 1.0 || this._pos.y < 0.0) {
            this._velocity.y *= -1;
        }
    }

    //This method should be called inside p5 draw function
    draw(p5) {
        this.moveStep(); //renew position
        super.draw(p5);
    }
    //called inside sketch draw if following someone else
    follow(p5) {
        if (this._following) {
            const d = p5.dist(this._pos.x, this._pos.y, this._following.pos.x, this._following.pos.y);
            const angle = p5.atan2(this._following.pos.y-this._pos.y, this._following.pos.x-this._pos.x);
            const magnitude = d * 0.03;
            this._velocity.x = p5.cos(angle) * magnitude * p5.random(0.8, 1.2);
            this._velocity.y = p5.sin(angle) * magnitude;
        }
    }
}

export default Me;
