import Me from './me.js'
import Story from './story.js'
import Token from './token.js'
import Simulate from './simulate.js'

const sketchContainer = document.getElementById('sketch-container');

//The Sketch!
export const sketch = (p) => {
    let part = 1;
    let timeStamp = 0;
    let cnv;
    let me;
    let story;
    //implement object with userID as keys and token as values
    const types = ["ICE", "CLOUD", "PRECIPITATION", "OCEAN", "RIVER", "AQUIFER"];
    const typeAmount = [0, 0, 0, 0 ,0, 0];
    const others = {};


    //test only simulation
    const simulations = [];
    let simulationIndex = 0;

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
            const relMouse = {
                x: p.mouseX/p.width,
                y: p.mouseY/p.height,
            }
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
                        me.socket.emit('lastLinePart1');
                    }
                }
            });

            if (part === 1) {
                me.socket.emit('clicked', {
                    x: relMouse.x,
                    y: relMouse.y,
                    z: 1.0,
                });
            }
            if (part === 2) {
                let totalDist = 0;
                let typeAmount = 0;
                simulations.forEach((s, index) => {
                    if (s.type === me.type && simulationIndex !== index) {
                        typeAmount++;
                        totalDist += p.dist(relMouse.x, relMouse.y, s.pos.x, s.pos.y);
                    }
                });
                if (typeAmount > 0) {
                    me.socket.emit('clicked', {
                        x: relMouse.x,
                        y: relMouse.y,
                        z: totalDist/typeAmount,
                    });
                }
            }
            // else if (part === 2) {
            //     simulations.forEach((s, index) => {
            //         if (s.type === me.type && simulationIndex !== index) {
            //             s.onClick(p.mouseX/p.width, p.mouseY/p.height, p, () => {
            //                 me.following = s;
            //             });
            //         }
            //     });
            // } else if (part === 3) {
            //     simulations.forEach((s, index) => {
            //         if (s.type !== me.type && simulationIndex !== index) {
            //             s.onClick(p.mouseX/p.width, p.mouseY/p.height, p, () => {
            //                 me.following = s;
            //                 me.followingCloseness = p.random(-0.10, -0.02);
            //             });
            //         }
            //     });
            // }
        });


        // ---SETUP SIMULATIONS TEST ONLY---
        for (let i = 0; i < 40; i++) {
            const socket = io({transports: ['websocket']}); //create socket for each sim
            //create types evenly by choosing type that has the least amount so far.
            const typeIndex = typeAmount.indexOf(Math.min(...typeAmount));
            const type = types[typeIndex];
            simulations.push(new Simulate(Math.random(), Math.random(), 5, p, type, socket));
            typeAmount[typeIndex]++;
        }
        me = simulations[simulationIndex];
        me.isActive = true;
        me.visible = true;
        story = new Story(me.type);
    }


    //test only
    p.keyPressed = () => {
        if (p.keyCode === p.LEFT_ARROW) {
            if (simulationIndex === 0) {
                simulationIndex = simulations.length-1;
            } else {
                simulationIndex--;
            }
            me.isActive = false;
            me.visible = part === 1 ? false : true;
            me = simulations[simulationIndex];
            me.isActive = true;
            me.visible = true;
            story.type = me.type;
        } else if (p.keyCode === p.RIGHT_ARROW) {
            if (simulationIndex === simulations.length-1) {
                simulationIndex = 0;
            } else {
                simulationIndex++;
            }
            me.isActive = false;
            me.visible = part === 1 ? false : true;
            me = simulations[simulationIndex];
            me.isActive = true;
            me.visible = true;
            story.type = me.type;
        } else if (p.keyCode === p.UP_ARROW) {
            if (part === 5) {
                part = 1;
            } else {
                part++;
            }
            if (part === 2) {
                simulations.forEach(s => {
                    s.visible = true;
                });
            }
            console.log(part);
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
        p.background(0, 0);
        p.noStroke();
        helpText(p, part, timeStamp);
        if (me) {
            if (me.following) {
                me.follow(p, me.following.pos.x, me.following.pos.y);
            }
            me.draw(p);
            me.onHover(p.mouseX/p.width, p.mouseY/p.height, p, story, part);
            me.borderCheck();
        }
        simulations.forEach((s, index) => {
            if (simulationIndex !== index) {
                if (s.following) {
                    s.follow(p, s.following.pos.x, s.following.pos.y);
                }
                s.draw(p);
                s.onHover(p.mouseX/p.width, p.mouseY/p.height, p, story, part);
                s.borderCheck();
            }
        });
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
                p.text("Guide your blue dot by clicking on the screen", 0.5*p.width, 0.5*p.height);
                p.pop();
            }
            if ( timeDiff > 6000 && timeDiff < 13000) {
                p.push();
                p.fill(0, 0, 0, (1 - ((timeDiff-6000) / 7000)) * 255);
                p.textSize(20);
                p.text("Click on it to go through the story", 0.5*p.width, 0.6*p.height);
                p.pop();
            }
            break;
        case 2:
            if (timeDiff < 8000) {
                p.push();
                p.fill(0, 0, 0, (1 - (timeDiff / 8000)) * 255);
                p.textSize(20);
                p.text("Approach others who are like you to explore even more", 0.5*p.width, 0.5*p.height);
                p.pop();
            }
            break;
        default:
            break;
    }
}