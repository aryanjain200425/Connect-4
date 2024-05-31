const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'));

server.listen(port, () => console.log(`Server is running on port ${port}`));


io.on('connection', (socket) => {

    console.log('A user connected:', socket.id);


});