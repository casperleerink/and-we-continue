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
    let timeSinceLastClicked = 0;
    let minimumTimeBetweenClicks = 2000;
    const clickedTimeStamps = [];
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
            if (timeSinceLastClicked > minimumTimeBetweenClicks) {
                timeLastClicked = p.millis();
                if (part > 2) {
                    clickedTimeStamps.push(timeLastClicked);
                }
                
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
                        current.type = client.type;
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
            timeSincePart = data.timeSincePart * 1000; //convert to ms;
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
        const currentTime = p.millis();
        timeSinceLastClicked = currentTime - timeLastClicked;

        //ME!!///
        if (me) {
            me.follow(p); //set velocity to follow a certain position or other
            if (part > 2) {
                heatEffect(me, others, heat, p); //when heat increases particles can't come close each other
                gravityEffect(me, gravity);
                centerEffect(me, toCenter, p);
            }
            me.draw(p);
            me.onHover(p.mouseX/p.width, p.mouseY/p.height, p, () => {
                if (part === 1) {
                    me.localText(p, story.line, 1);
                } else if (part === 2) {
                    me.localText(p, story.text1EndLine(me.type), 1);
                } else if (part === 3) {
                    me.localText(p, story.currentLine, 1);
                }
            });
            if (part === 1 && timeSinceLastClicked < minimumTimeBetweenClicks) {
                me.localText(p, story.line, 1- (timeSinceLastClicked/minimumTimeBetweenClicks));
            }
            updatePosition(me, others, part);
        }

        //OTHERS!!///
        others.forEach((token) => {
            token.draw(p);
            token.onHover(p.mouseX/p.width, p.mouseY/p.height, p, () => {
                if (part <= 2) {
                    token.localText(p, story.text1EndLine(token.type), 1);
                } else if (part === 3) {
                    token.localText(p, story.currentLine, 1);
                }
            });
        });

        if (part === 4) {
            //Show text story.currentLine
            p.push();
            p.noStroke();
            p.fill(0);
            p.textSize(18);
            p.text(story.currentLine, p.width*0.5, p.height*0.5);
            p.pop();
        }

        //click density of user (use from part 3 onwards?)
        let amtClicked = 0.0;
        if (clickedTimeStamps.length > 0) {
            for (let i = clickedTimeStamps.length-1; i >= 0; i--) {
                const timeDiff = currentTime - clickedTimeStamps[i];
                if (timeDiff < minimumTimeBetweenClicks*20) {
                    amtClicked += 1/20;
                } else {
                    break;
                }
            }
            if (amtClicked < 0.1) {
                me.type = "OCEAN";
            } else if (amtClicked >= 0.1 && amtClicked < 0.2) {
                me.type = "ICE";
            } else if (amtClicked >= 0.2 && amtClicked < 0.3) {
                me.type = "AQUIFER";
            } else if (amtClicked >= 0.3 && amtClicked < 0.45) {
                me.type = "RIVER";
            } else if (amtClicked >= 0.45 && amtClicked < 0.6) {
                me.type = "CLOUD";
            } else if (amtClicked >= 0.6) {
                me.type = "PRECIPITATION";
            }
        }
    }
};