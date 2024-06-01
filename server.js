const express = require('express');
const { read } = require('fs');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'));

server.listen(port, () => console.log(`Server is running on port ${port}`));

let players = new Array();

let currentPlayer = 'red';

let history = [];

io.on('connection', (socket) => {


    players.push(socket.id);

    if(players.length == 1){
        socket.emit('player-joined', 'red', players.length );
    }
    else if(players.length == 2){
        socket.emit('player-joined', 'yellow', players.length );
    }
    else{
        socket.emit('player-joined', 'spectator', players.length );
        history.forEach(element => {
            socket.emit('draw-board', element.color, element.row, element.column);
        });
    }

    socket.on('move', (r, c) => {
        history.push({color: currentPlayer, row: r, column: c});
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        io.emit('update-board', r, c);
    });

    socket.on('start-game', (myColor)=>{
        io.emit('starting-the-game', myColor, currentPlayer);
    });


    socket.on('reset-game', ()=>{
        io.emit('resetting-the-game');
        history = [];
        currentPlayer = 'red';
    });


    socket.on('disconnect', () =>{

        let index = players.indexOf(socket.id);

        players.splice(index, 1);

        history = [];

        currentPlayer = 'red'

        if(index === 0){
            io.to(players[0]).emit('player-left', 'red', players.length);
            if(players.length > 1){
                io.to(players[1]).emit('player-left', 'yellow', players.length);
            }
        }
        else if(index === 1){
            io.to(players[0]).emit('player-left', 'red', players.length);
            if(players.length > 1){
                io.to(players[1]).emit('player-left', 'yellow', players.length);
            }
        }

        io.emit('resetting-the-game');


    });



});