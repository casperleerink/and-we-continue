const mse = (me, others, part) => {
    let accum = 0.0;
    let amt = 0;
    others.forEach(token => {
        accum += (me.pos.x - token.pos.x)**2;
        accum += (me.pos.y - token.pos.y)**2;
        amt++;
    });
    if (amt > 0) {
        const result = Math.sqrt(accum/amt);
        return result;
    } else {
        return 1.0;
    }
}


export const updatePosition = (me, others, part) => {
    if (part === 1) {
        me.socket.emit('updatePosition', {
            x: me.pos.x,
            y: me.pos.y,
            z: 1,
            c: me.clickDensity,
        });
    } else {
        me.socket.emit('updatePosition', {
            x: me.pos.x,
            y: me.pos.y,
            z: mse(me, others, part),
            c: me.clickDensity,
        });
    }
}

export const heatEffect = (me, others, amount, p) => {
    others.forEach(token => {
        const dist = p.dist(me.pos.x, me.pos.y, token.pos.x, token.pos.y);
        if (dist < amount) {
            const angle = p.atan2(token.pos.y-me.pos.y, token.pos.x-me.pos.x);
            const magnitude = (0.0005 * amount) / dist;
            me.velocity.x -= (p.cos(angle) * magnitude);
            me.velocity.y -= (p.sin(angle) * magnitude);
        }
    });
}

export const gravityEffect = (me, gravity) => {
    me.velocity.y += gravity;
}


export const centerEffect = (me, amount, p) => {
    const dist = p.dist(me.pos.x, me.pos.y, 0.5, 0.5); //distance to center
    const angle = p.atan2(0.5-me.pos.y, 0.5-me.pos.x);
    const magnitude = dist * amount;
    me.velocity.x += p.cos(angle) * magnitude;
    me.velocity.y += p.sin(angle) * magnitude;
}

export const getAveragePosition = (me, others) => {
    let totalX = me.pos.x;
    let totalY = me.pos.y;
    others.forEach(token => {
        totalX += token.pos.x;
        totalY += token.pos.y;
    });
    const position = {
        x: totalX/(others.size+1),
        y: totalY/(others.size+1)
    }
    if (position.x > 0.8) {
        position.x = 0.8;
    }
    if (position.x < 0.2) {
        position.x = 0.2;
    }
    if (position.y > 0.9) {
        position.y = 0.9;
    }
    if (position.y < 0.1) {
        position.y = 0.1;
    }
    return position;
}

export const helpText = (p, part, timeDiff) => {
    switch (part) {
        case 1:
            if (timeDiff < 8000) {
                p.push();
                p.fill(0, 0, 0, (1 - (timeDiff / 8000)) * 255);
                p.textSize(18);
                p.text("Guide your blue dot by clicking on the screen", 0.5*p.width, 0.5*p.height);
                p.pop();
            }
            break;
        case 2:
            if (timeDiff < 8000) {
                p.push();
                p.fill(0, 0, 0, (1 - (timeDiff / 8000)) * 255);
                p.textSize(18);
                p.text("Approach others", 0.5*p.width, 0.5*p.height);
                p.pop();
            }
            break;
        default:
            break;
    }
}
