const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const io = require('socket.io')(http);


http.Server(app);
app.use('/client', express.static('client'));

app.get('/', (req, res)=>{
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

io.on('connection', function(socket){
    console.log('a user connected');
  });

app.listen(3000, () => console.log('Listening on port 3000'));