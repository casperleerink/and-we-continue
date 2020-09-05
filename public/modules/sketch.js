import Me from './me.js'
import Story from './story.js'
import Token from './token.js'

const sketchContainer = document.getElementById('sketch-container');
export const socket = io();

//The Sketch!
export const sketch = (p) => {
    const userID = socket.io.engine.id;
    let part = 1;
    let timeStamp = 0;
    let following;
    let following_closeness = -0.05;
    let cnv;
    let img;
    let me;
    let story;
    //implement object with userID as keys and token as values
    const types = ["ICE", "CLOUD", "PRECIPITATION", "OCEAN", "RIVER", "AQUIFER"];
    const others = {};
    p.preload = () => {
        img = p.loadImage('./arctic-me.png');
    }
    p.setup = () => {

        //create canvas with width and height of container
        const containerPos = sketchContainer.getBoundingClientRect();
        cnv = p.createCanvas(containerPos.width, containerPos.height); //the canvas!

        //set up canvas standards
        p.frameRate(25); //draw is called around 25 times/second
        p.textSize(14);
        p.rectMode(p.CENTER);
        p.imageMode(p.CENTER);
        p.textAlign(p.CENTER);

        //mouse click on canvas event
        cnv.mousePressed(() => {
            //change what to do based on part
            if (part === 1) {
                me.attractionPoint(0.03, p.mouseX/p.width, p.mouseY/p.height, p);
                me.onClick(p.mouseX/p.width, p.mouseY/p.height, p, () => {
                    story.nextLine();
                });
            }
            if (part === 2) {
                const otherIDs = Object.keys(others);
                if (otherIDs.length > 0) {
                    following = undefined;
                    otherIDs.forEach(id => {
                        const t = others[id];
                        if (t.type === me.type) {
                            t.onClick(p.mouseX/p.width, p.mouseY/p.height, p, () => {
                                following = others[id];
                            });
                        }
                    });
                }
            }
        });

        //socket io setup// all event listeners for received messages

        //receive all clients initial data (is called everytime a new client enters)
        socket.on('clients', (data) => {
            const parsed = JSON.parse(data);
            //store all data
            Object.entries(parsed).forEach(entry => {
                const [id, userData] = entry;
                //me
                if (id === userID) {
                    if (!me) {
                        me = new Me(userData.x, userData.y, 5, p, userData.type);
                        story = new Story(me.type);
                    }
                //others
                } else {
                    if (!others[id]) {
                        others[id] = new Token(userData.x, userData.y, 5, p, userData.type); //create the token
                        others[id].visible = userData.visible;
                    }
                }
            });
        });
        //update position of given token
        socket.on('updatedPosition', data => {
            const parsed = JSON.parse(data);
            others[parsed.id].pos = {
                x: parsed.x,
                y: parsed.y
            }
        });
        //change part [I YOU OUR WE I]
        socket.on('part', partNum => {
            part = partNum;
            timeStamp = p.millis();
            if (part === 2) {
                Object.keys(others).forEach(id => {
                    others[id].visible = true;
                });
            }
        });
        //when client leaves clean up data event
        socket.on('removeClient', id => {
            if (others[id]) {
                delete others[id];
            }
        });
        socket.emit('getClients'); //get info from clients at setup, also sends to everyone else.
    }

    //resize canvas
    p.windowResized = () => {
        //when window changes (fullscreen etc..) resize the canvas again
        const containerPos = sketchContainer.getBoundingClientRect();
        p.resizeCanvas(containerPos.width, containerPos.height);
    }

    //draw happens 25 times per second
    p.draw = () => {
        p.clear();
        p.background(0, 0);
        p.noStroke();
        helpText(p, part, timeStamp);
        if (me) {
            me.draw(p, img);
            me.onHover(p.mouseX/p.width, p.mouseY/p.height, p, story, part);
            if (following) {
                const closeness = following_closeness * (p.sin(p.frameCount * 0.03) * 0.2 + 1.0);
                me.follow(p, following.pos.x, following.pos.y, closeness);
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
                others[id].onHover(p.mouseX/p.width, p.mouseY/p.height, p, story, part);
            });
        }
    }
};


const helpText = (p, part, timeStamp) => {
    const timeDiff = p.millis() - timeStamp;
    switch (part) {
        case 1:
            if (timeDiff < 8000) {
                p.push();
                p.fill(0, 0, 0, (1 - (timeDiff / 8000)) * 255);
                p.textSize(20);
                p.text("CLICK anywhere to explore", 0.5*p.width, 0.5*p.height);
                p.pop();
            }
            break;
        case 2:
            if (timeDiff < 8000) {
                p.push();
                p.fill(0, 0, 0, (1 - (timeDiff / 8000)) * 255);
                p.textSize(20);
                p.text("FIND and click on others who are like you.", 0.5*p.width, 0.5*p.height);
                p.pop();
            }
            break;
        default:
            break;
    }
    if (part === 1) {
    }
}