import Me from './me.js'
import Story from './story.js'
import Token from './token.js'
import {
    updatePosition, 
    helpText, 
    heatEffect, 
    gravityEffect, 
    centerEffect, 
    getAveragePosition} from './util.js'

const sketchContainer = document.getElementById('sketch-container');
export const socket = io({transports: ['websocket']});

//The Sketch!
export const sketch = (p) => {
    const userID = socket.io.engine.id;
    let part = 1;
    let timeSincePart = 0.0;
    let timeLastClicked = -5001;
    let timeSinceLastClicked = 0;
    const fadeTextTime = 5000;
    const clickedTimeStamps = [];
    let clickChainAmount = 4;
    let cnv;
    let me;
    let story;

    let averagePosition = { x: 0.5, y: 0.5 };

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
        p.textSize(18);
        p.noStroke();
        p.rectMode(p.CENTER);
        p.imageMode(p.CENTER);
        p.textAlign(p.CENTER);


        //mouse click on canvas event
        cnv.mousePressed(() => {
            p.myClickFunction(p.mouseX/p.width, p.mouseY/p.height);
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
                        current.color[3] = data.alpha;
                    }
                    //else create a new token
                    else {
                        others.set(id, new Token(client.x, client.y, p.width*0.005, p, client.type));
                    }
                } else {
                    if (!me) {
                        //my token!
                        me = new Me(client.x, client.y, p.width*0.005, p, client.type, socket);
                        story = new Story(me.type);
                    } else {
                        me.canClick = client.click;
                        me.color[3] = data.alpha;
                    }
                }
                if (part === 4) {
                    averagePosition = getAveragePosition(me, others);
                }
            }); //end updating clients
            if (data.part !== part) {
                part = data.part;
                console.log(`Part: ${part}`);
            }
            timeSincePart = data.timeSincePart * 1000; //convert to ms;

            //only do stuff when line changes
            if (data.storyLine !== story.currentLine) {
                story.currentLine = data.storyLine;
                story.timeLineChanged = p.millis();
                if (part === 5) {
                    console.log(story.text5Amount);
                    story.text5Amount = story.text5Amount + 1;
                }
            }
            heat = data.heat;
            gravity = data.gravity;
            toCenter = data.center;
            // fadeTextTime = data.timeBetweenClicks;
            clickChainAmount = data.clickChainAmount;

        });
        //when client leaves clean up data event
        socket.on('removeClient', id => {
            if (others.has(id)) {
                others.delete(id);
            }
        });
    }

    p.myClickFunction = (x, y) => {
        if (me && me.canClick) {
            timeLastClicked = p.millis();
            const othersArr = Array.from(others);
            const clickChain = [];
            const amount = othersArr.length < clickChainAmount ? othersArr.length : clickChainAmount;
            for (let i = 0; i < amount; i++) {
                clickChain.push(p.random(othersArr)[0]);   
            }
            socket.emit('clickChain', clickChain);
            if (part === 1) {
                story.nextLine();
            }
            if (part > 2) {
                clickedTimeStamps.push(timeLastClicked);
            }
            
            const relMouse = {x, y};
            socket.emit('clicked', relMouse);
            me.following = {
                pos: {
                    x: relMouse.x,
                    y: relMouse.y,
                }
            }
        }
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
        const currentTime = p.millis();
        timeSinceLastClicked = currentTime - timeLastClicked;

        //ME!!///
        if (me) {
            if (part === 5) {
                p.background(0, 30);
            } else {
                p.background(0, me.canClick ? 0 : 30);
            }
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
                    if (timeSincePart < 60000) {
                        me.localText(p, story.text1EndLine(me.type), 1);
                    }
                }
            });
            if (part === 1 && timeSinceLastClicked < fadeTextTime) {
                me.localText(p, story.line, 1- (timeSinceLastClicked/fadeTextTime));
            }
            if (part === 3) {
                me.part3Text(p, story.textPart3, timeSincePart);
                // const diff = p.millis() - story.timeLineChanged;
                // if (diff < fadeTextTime) {
                //     me.localText(p, story.currentLine, 1 - (diff/fadeTextTime));
                // }
            }
            me.calcClickDensity(clickedTimeStamps, currentTime, fadeTextTime);
            updatePosition(me, others, part);
        }

        //OTHERS!!///
        others.forEach((token) => {
            token.draw(p);
            token.onHover(p.mouseX/p.width, p.mouseY/p.height, p, () => {
                if (part <= 2) {
                    if (timeSincePart < 60000) {
                        token.localText(p, story.text1EndLine(token.type), 1);
                    }
                } else if (part === 3) {
                    token.part3Text(p, story.textPart3, timeSincePart);
                }
            });
        });


        //GENERAL TEXT
        if (me) {
            helpText(p, part, timeSincePart);
        }
        if (part === 4) {
            // const timeDiff = currentTime - story.timeLineChanged;
            // if (timeDiff < fadeTextTime) {
            //     const fade = 1 - (timeDiff/fadeTextTime);
            //     story.part4Text(p, timeSincePart, averagePosition);
            // }
            story.part4Text(p, timeSincePart, averagePosition);
        } else if (part === 5) {
            if (timeSincePart < 130000) {
                let fade = 1;
                if (timeSincePart > 120000) {
                    fade = 1 - ((timeSincePart-120000)/10000)
                }
                story.part5Text(p, fade);
            }
        }
        
        //Emulate click on idle exept in part 5 where people don't have to click
        if (part < 5 && me && me.canClick) {
            //if user hasn't clicked for 50 seconds, make a random click
            if (timeSinceLastClicked > 50000) {
                p.myClickFunction(Math.random(), Math.random());
            }
        }
    }
};