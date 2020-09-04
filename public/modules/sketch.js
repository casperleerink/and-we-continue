import Me from './me.js'
import Story from './story.js'
import Token from './token.js'

const sketchContainer = document.getElementById('sketch-container');
export const socket = io();

//The Sketch!
export const sketch = (p) => {
    const userID = socket.io.engine.id;
    let part = 1;
    let following;
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
                    otherIDs.forEach(id => {
                        others[id].onClick(p.mouseX/p.width, p.mouseY/p.height, p, () => {
                            following = others[id];
                        });
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
        if (me) {
            me.draw(p, img);
            me.onHover(p.mouseX/p.width, p.mouseY/p.height, p, story, part);
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
                others[id].onHover(p.mouseX/p.width, p.mouseY/p.height, p, story, part);
            });
        }
    }
};