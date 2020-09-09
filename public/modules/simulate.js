import Token from "./token.js"

class Simulate extends Token {
    constructor(x, y, size, p, type, socket) {
        super(x, y, size, p, type);
        this._visible = true;
        this._velocity = {
            x: 0.0,
            y: 0.0,
        }
        this._friction = 0.05; //0 = no friction 1=full friction (immediate stop)
        this._isActive = false;
        this._following = undefined;
        this._followingCloseness = 0.0;

        //socket
        this._socket = socket;
        this._socketConnected = false;

        //event listeners
        this._socket.on('connect', () => {
            console.log(socket.io.engine.id);
            if (!this._socketConnected) {
                this._socket.emit('newClient', JSON.stringify({
                    type,
                    x, 
                    y,
                    visible: true
                }));
            }
            this._socketConnected = true;
        });
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

    get isActive() {
        return this._isActive;
    }
    set isActive(b) {
        this._isActive = b;
        this._color[1] = b ? 150 : 90;
        this._size = b ? 8 : 5;
    }

    get following() {
        return this._following;
    }
    set following(other) {
        this._following = other;
    }

    get followingCloseness() {
        return this._followingCloseness;
    }
    set followingCloseness(f) {
        if (f >= -1.0 && f <= 0.0) {
            this._followingCloseness = f;
        } else {
            console.error('following closeness should be a number between -1 and 0');
        }
    }
    get socket() {
        return this._socket;
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
     * Pushes me toward a point.
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
        if (this._velocity.x > -0.0001 && this._velocity.x < 0.0001) {
            this._velocity.x = 0.0;
        }
        if (this._velocity.y > -0.0001 && this._velocity.y < 0.0001) {
            this._velocity.y = 0.0;
        }
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
        if (this._visible) {
            this.moveStep(); //renew position
            super.draw(p5);
        }
        // if (this.isMoving() && this._socketConnected) {
        //     this._socket.emit('updatePosition', JSON.stringify(this._pos));
        // }
    }
    //called inside sketch draw if following someone else
    follow(p5, x, y) {
        const closeness = this._followingCloseness * (p5.sin(p5.frameCount * 0.03) * 0.02 + 1.0);
        const d = p5.dist(this._pos.x, this._pos.y, x, y);
        const angle = p5.atan2(y-this._pos.y, x-this._pos.x);
        const magnitude = p5.map(d, 0.0, 1.0, closeness, 1.0) * 0.03;
        this._velocity.x = p5.cos(angle) * magnitude * p5.random(0.9, 1);
        this._velocity.y = p5.sin(angle) * magnitude;
    }

    // onClick(x, y, p5, callback) {
    //     super.onClick(x, y, p5, callback);
    //     this._socket.emit('clicked', JSON.stringify({
    //         x, y
    //     }));
    // }
}


export default Simulate;