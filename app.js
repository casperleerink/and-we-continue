const express = require('express');
const app = express();
const http = require("http").createServer(app);
var io = require('socket.io')(http);
const util = require('./modules/util.js');

const port = process.env.PORT || 8000;

app.set('view-engine', 'ejs');
express.static.mime.define({'application/javascript': ['js']});
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render('index.ejs');
});
app.get('/admin', (req, res) => {
    res.render('admin.ejs');
});

app.get("/finality", (req, res) => {
    res.render('finality.ejs');
});

http.listen(port, () => {
    console.log("Server is listening on port: 8000");
});



//////////
//SOCKET.IO config//
//////////
const gameState = {
    clients: new Map(),
    part: 1,
    timeSincePart: 0.0,
    storyLine: "Light finds us,",
    chaos: 0.0,
    gravity: 0.0,
    heat: 0.0,
    center: 0.0,
}
const types = ["ICE", "CLOUD", "PRECIPITATION", "OCEAN", "RIVER", "AQUIFER"];
let adminID;
let started = false;
let emitGameStateInterval;

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    socket.on('disconnect', () => {
        io.sockets.emit('removeClient', socket.id);
        gameState.clients.delete(socket.id);
        console.log(`${socket.id} disconnected`);
        if (socket.id === adminID) {
            clearInterval(emitGameStateInterval);
            console.log(`ADMIN disconnected`);
        } else {
            console.log(`${socket.id} disconnected`);
        }
    });
    socket.on('newClient', () => {
        const client = {
            type: util.random(types),
            x: Math.random(),
            y: Math.random(),
            z: 1.0,
            visible: false,
        }
        gameState.clients.set(socket.id, client);
        if (adminID) {
            io.to(adminID).emit("numClients", gameState.clients.size);
        }
    });
    socket.on('visible', (b) => {
        if (gameState.clients.has(socket.id)) {
            gameState.clients.get(socket.id).visible = b;
        }
    });
    socket.on('updatePosition', data => {
        if (gameState.clients.has(socket.id)) {
            const client = gameState.clients.get(socket.id);
            client.x = data.x;
            client.y = data.y;
            if (data.z) {
                client.z = data.z;
            }
        }
    });
    socket.on('clicked', data => {
       if (adminID) {
           io.to(adminID).emit("clicked", data);
       } 
    });

    //admin only messages
    socket.on('adminConnected', (pw) => {
        //set the id of the admin
        if (pw == "once-she-dries") {
            adminID = socket.id;
            console.log(`ADMIN: ${adminID}`);
        }
    });
    socket.on('start', () => {
        if (socket.id === adminID && !started) {
            started = true;
            io.emit('start');
            const frameRate = 1;
            emitGameStateInterval = setInterval(() => {
                gameState.timeSincePart += 1/frameRate;
                const clientsArr = Array.from(gameState.clients);
                const result = Object.assign({}, gameState);
                result.clients = clientsArr;
                io.emit('gameState', result);
            }, 1000/frameRate);
        }
    });
    socket.on('changePart', part => {
        if (socket.id === adminID) {
            gameState.part = part;
            if (part === 2) {
                gameState.clients.forEach(client => {
                    client.visible = true;
                })
            }
            gameState.timeSincePart = 0.0;
        }
    });
    socket.on('chaos', c => {
        if (socket.id === adminID) {
            gameState.chaos = c;
        }
    });
    socket.on('gravity', g => {
        if (socket.id === adminID) {
            gameState.gravity = g;
        }
    });
    socket.on('heat', h => {
        if (socket.id === adminID) {
            gameState.heat = h;
        }
    });
    socket.on('center', f => {
        if (socket.id === adminID) {
            gameState.center = f;
        }
    });
    socket.on('storyLine', line => {
        //takes effect in part 3 only
        gameState.storyLine = line;
    });
});