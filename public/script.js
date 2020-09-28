import {sketch, socket} from './modules/sketch.js'
import Stream from './modules/stream.js'
import fullScreenButton from './modules/fullscreen.js'

//elements and stream
const sketchContainer = document.getElementById('sketch-container');
const welcomePage = document.getElementById('welcome-page');
const startButton = document.getElementById('startButton');
const streamingPlayer = new Stream(document.getElementById('stream-container'), "casperleerink");

//add fullscreen support
fullScreenButton();

startButton.addEventListener('click', () => {
    welcomePage.style.display = "none";
    streamingPlayer.start();
    socket.emit('newClient');
    // socket.on('start', () => {
    //     new p5(sketch, sketchContainer);
    // });
    new p5(sketch, sketchContainer);
});