import Ice from './ice.js'
import Ocean from './ocean.js'
import Cloud from './cloud.js'
import Rain from './rain.js'
import Hail from './hail.js'
import River from './river.js'
import Aquifer from './aquifer.js'
import Me from './me.js'
import Story from './story.js'

const sketchContainer = document.getElementById('sketch-container');
export const socket = io();

//The Sketch!
export const sketch = (p) => {
    const userID = socket.io.engine.id;
    let following;
    let cnv;
    let img;
    let me;
    let story;
    //implement object with userID as keys and token as values
    const types = ["ICE", "CLOUD", "RAIN", "HAIL", "OCEAN", "RIVER", "AQUIFER"];
    const others = {};
    p.preload = () => {
        img = p.loadImage('./arctic-me.png');
    }
    p.setup = () => {
        //create canvas with width and height of container
        const containerPos = sketchContainer.getBoundingClientRect();
        cnv = p.createCanvas(containerPos.width, containerPos.height);
        p.frameRate(25);
        //when a user presses anywhere on the canvas
        cnv.mousePressed(() => {
            if (me) {
                me.onClick(p.mouseX/p.width, p.mouseY/p.height, p, () => {
                    story.nextLine();
                    // me.attractionPoint(0.02, p.random(), p.random(), p);
                });
            }
            const otherIDs = Object.keys(others);
            if (otherIDs.length > 0) {
                otherIDs.forEach(id => {
                    others[id].onClick(p.mouseX/p.width, p.mouseY/p.height, p, () => {
                        following = others[id];
                    });
                });
            }
        });
        p.textSize(14);
        p.rectMode(p.CENTER);
        p.imageMode(p.CENTER);
        p.textAlign(p.CENTER);

        //socket io setup// all event listeners for received messages
        //receive all clients initial data
        socket.on('clients', (data) => {
            const parsed = JSON.parse(data);
            Object.entries(parsed).forEach(entry => {
                const [id, userData] = entry;
                if (id === userID) {
                    if (!me) {
                        me = new Me(userData.x, userData.y, 5, userData.type);
                        story = new Story(me.type);
                    }
                } else {
                    if (!others[id]) {
                        others[id] = createNewToken(userData, p);
                        // others[id].visible = userData.visible;
                        console.log(others[id]);
                    }
                }
            });
        });
        socket.on('updatedPosition', data => {
            const parsed = JSON.parse(data);
            others[parsed.id].pos = {
                x: parsed.x,
                y: parsed.y
            }
        });
        socket.on('removeClient', id => {
            delete others[id];
        });
        socket.emit('getClients'); //get info from clients at setup, also sends to everyone else.
    }

    //resize canvas
    p.windowResized = () => {
        //when window changes (fullscreen etc..) resize the canvas again
        const containerPos = sketchContainer.getBoundingClientRect();
        p.resizeCanvas(containerPos.width, containerPos.height);
    }

    //draw happens ±30 times per second
    p.draw = () => {
        p.clear();
        p.background(0, 0);
        p.noStroke();
        if (me) {
            me.draw(p, img);
            me.onHover(p.mouseX/p.width, p.mouseY/p.height, p, story.line);
            if (following) {
                me.follow(p, following.pos.x, following.pos.y, -0.05);
            }
            if (me.visibleToOthers) {
                if (me.isMoving()) {
                    socket.emit('updatePosition', me.pos);
                }
            }
        }
        const otherIDs = Object.keys(others);
        if (otherIDs.length > 0) {
            otherIDs.forEach(id => {
                others[id].draw(p);
                others[id].onHover(p.mouseX/p.width, p.mouseY/p.height, p, story.line);
            });
        }
    }
};
function createNewToken(data, p5) {
    switch (data.type) {
        case "ICE":
            return new Ice(data.x, data.y, 5, p5);
        case "CLOUD":
            return new Cloud(data.x, data.y, 5, p5);
        case "RAIN":
            return new Rain(data.x, data.y, 5);
        case "HAIL":
            return new Hail(data.x, data.y, 5);
        case "OCEAN":
            return new Ocean(data.x, data.y, 5);
        case "RIVER":
            return new River(data.x, data.y, 5, p5);
        case "AQUIFER":
            return new Aquifer(data.x, data.y, 5);
        default:
            return new Ocean(data.x, data.y, 5);
    }
}