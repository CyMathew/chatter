const express = require('express');
const app = express();
const path = require('path');
const socketIO = require('socket.io');

const server = app.listen(3400, () => console.log('Listening on port 3400'));
const io = socketIO.listen(server);

app.use('/client', express.static('client'));

app.get('/', (req, res)=>{
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

io.on('connection', (socket) => 
{
    console.log("User connected");

    socket.on('disconnect', () => console.log('User disconnected'));
});
    
