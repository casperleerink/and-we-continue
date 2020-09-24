import Me from './me.js'
import Story from './story.js'
import Token from './token.js'
import {updatePosition, helpText, heatEffect, gravityEffect, centerEffect} from './util.js'

const sketchContainer = document.getElementById('sketch-container');
export const socket = io();

//The Sketch!
export const sketch = (p) => {
    const userID = socket.io.engine.id;
    let part = 1;
    let timeSincePart = 0.0;
    let timeLastClicked = -5001;
    let cnv;
    let me;
    let story;

    let heat = 0.0;
    let gravity = 0.0;
    let toCenter = 0.0;
    //implement object with userID as keys and token as values
    const types = ["ICE", "CLOUD", "PRECIPITATION", "OCEAN", "RIVER", "AQUIFER"];
    const others = new Map();

    p.setup = () => {

        //create canvas with width and height of container
        const containerPos = sketchContainer.getBoundingClientRect();
        cnv = p.createCanvas(containerPos.width, containerPos.height); //the canvas!

        //set up canvas standards
        p.frameRate(30); //draw is called around 30 times/second
        p.textSize(14);
        p.rectMode(p.CENTER);
        p.imageMode(p.CENTER);
        p.textAlign(p.CENTER);


        //mouse click on canvas event
        cnv.mousePressed(() => {
            const timeSinceLastClicked = p.millis() - timeLastClicked;
            if (timeSinceLastClicked > 1000) {
                console.log("click!");
                timeLastClicked = p.millis();

                
                const relMouse = {
                    x: p.mouseX/p.width,
                    y: p.mouseY/p.height,
                }
                socket.emit('clicked', relMouse);
                me.following = {
                    pos: {
                        x: relMouse.x,
                        y: relMouse.y,
                    }
                }
                me.onClick(relMouse.x, relMouse.y, p, () => {
                    if (part === 1) {
                        const storyEnded = story.nextLine();
                        if (storyEnded) {
                            me.socket.emit('visible', true);
                        }
                    }
                });
            }
        });

        //socket io setup// all event listeners for received messages

        //receive all clients initial data (is called everytime a new client enters)
        socket.on('gameState', (data) => {
            //most important message, updates the state of everything every frame rate

            //first update all clients
            const clients = new Map(data.clients); //JS map of all clients and their props
            clients.forEach((client, id) => {
                //only update other clients not yourself
                if (id !== userID) {
                    //if id then update the props
                    if (others.has(id)) {
                        const current = others.get(id);
                        current.pos = { x: client.x, y: client.y};
                        current.visible = client.visible;
                    } 
                    //else create a new token
                    else {
                        others.set(id, new Token(client.x, client.y, 5, p, client.type));
                    }
                } else {
                    if (!me) {
                        //my token!
                        me = new Me(client.x, client.y, 5, p, client.type, socket);
                        story = new Story(me.type);
                    }
                }
            }); //end updating clients
            if (data.part !== part) {
                part = data.part;
                console.log(`Part: ${part}`);
            }
            timeSincePart = data.timeSincePart;
            if (data.storyLine !== story.currentLine) {
                story.currentLine = data.storyLine;
                //maybe do something only when the text changes?
            }
            heat = data.heat;
            gravity = data.gravity;
            toCenter = data.center;

        });
        //when client leaves clean up data event
        socket.on('removeClient', id => {
            if (others.has(id)) {
                others.delete(id);
            }
        });
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
        helpText(p, part, timeSincePart);
        if (me) {
            me.follow(p); //set velocity to follow a certain position or other
            if (part > 2) {
                heatEffect(me, others, heat, p); //when heat increases particles can't come close each other
                gravityEffect(me, gravity);
                centerEffect(me, toCenter, p);
            }
            me.draw(p);
            me.onHover(p.mouseX/p.width, p.mouseY/p.height, p, story, part);
            updatePosition(me, others, part);
        }
        others.forEach((token) => {
            token.draw(p);
            token.onHover(p.mouseX/p.width, p.mouseY/p.height, p, story, part);
        });

    }
};
