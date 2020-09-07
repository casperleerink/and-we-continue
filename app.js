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

app.get("/finality", (req, res) => {
    res.render('finality.ejs');
});

http.listen(port, () => {
    console.log("Server is listening on port: 8000");
});



//////////
//SOCKET.IO config//
//////////
const clients = {};
const types = ["ICE", "CLOUD", "PRECIPITATION", "OCEAN", "RIVER", "AQUIFER"];

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    socket.on('disconnect', () => {
        io.sockets.emit('removeClient', socket.id);
        delete clients[socket.id];
        console.log(`${socket.id} disconnected`);
    });

    socket.on('getClients', () => {
        clients[socket.id] = {
            type: util.random(types),
            x: Math.random(),
            y: Math.random(),
            visible: false,
        };
        io.emit('clients', JSON.stringify(clients));
    });
    socket.on('newClient', data => {
        const parsed = JSON.parse(data);
        clients[socket.id] = data;
        io.emit('clients', JSON.stringify(clients));
    });
    socket.on('visible', (b) => {
        if (clients[socket.id]) {
            clients[socket.id].visible = b;
        }
        socket.broadcast.emit('updateVisibility', JSON.stringify({
            id: socket.id,
            visible: b,
        }));
    });
    socket.on('updatePosition', data => {
        if (clients[socket.id]) {
            clients[socket.id].x = data.x;
            clients[socket.id].y = data.y;
        }
        socket.broadcast.emit('updatedPosition', JSON.stringify({
            id: socket.id,
            x: data.x,
            y: data.y
        }));
    });

    //admin only messages
    socket.on('changePart', part => {
        io.emit('part', part);
    });
});