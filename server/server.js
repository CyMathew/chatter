const express = require('express');
const app = express();
const path = require('path');
const socketIO = require('socket.io');

const server = app.listen(3400, () => console.log('Listening on port 3400'));
const io = socketIO.listen(server);

//Used to set the base folder to get static files from
app.use('/client', express.static('client'));

//Used to route home to index.html
app.get('/', (req, res)=>{
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

//Socket connection
io.on('connection', (socket) => 
{
    console.log("User connected");
    socket.emit('clientID', socket.id);

    // socket.on('message', (message) => 
    // {
    //     console.log(message)); //'Recieved: ', )
    // });

    socket.on('message', (message) => {
        socket.broadcast.emit('message', message);
    })

    socket.on('disconnect', () => console.log('User disconnected'));

    socket.on('error', (err) => 
    {
        console.log('recieved error from client:', socket.id);
        console.error(err);
    })
});
    
