const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const usersOnline = [];

// Serve static files (your HTML, CSS, and client-side JS)
app.use(express.static(__dirname + '/public'));

// Socket.io connection and event handling
io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('user joined', (username) => {
        console.log('A user joined');
        if(usersOnline.indexOf(username) === -1){
            usersOnline.push(username);
            socket.username = username;
            io.emit('update userlist', usersOnline);
        }
    });
    
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Broadcast the message to all connected clients
    });

    socket.on('disconnect', (socket) => {
        console.log('A user disconnected');
        if(socket.username){
            usersOnline = usersOnline.filter( user => user !== username);
            io.emit('update userlist', usersOnline);
        }
    });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
