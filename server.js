const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'));

server.listen(port, () => console.log(`Server is running on port ${port}`));

let players = new Array();


io.on('connection', (socket) => {

    console.log('A user connected:', socket.id);

    players.push(socket.id);

    if(players.length == 1){
        socket.emit('player-joined', 'red', players.length );
    }
    else if(players.length == 2){
        socket.emit('player-joined', 'yellow', players.length );
    }
    else{
        socket.emit('player-joined', 'spectator', players.length );
    }

    socket.on('move', (r, c) => {
        io.emit('update-board', r, c);
    });


    socket.on('disconnect', () =>{
        console.log('A user disconnected: ', socket.id);

        let index = players.indexOf(socket.id);

        players.splice(index, 1);


    });

});