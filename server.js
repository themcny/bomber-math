var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = {};
var rooms = ['Lobby'];
var playerOne, playerTwo;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});



io.on('connection', function(socket){
  var newComer = new Player({id: socket.id});
  players[socket.id] = newComer;
  socket.player = newComer;
  socket.room = 'Lobby';
  socket.join('Lobby')
  // console.log(newComer);
  socket.join('Lobby');

  if (io.sockets.adapter.rooms['Lobby'].length < 2){
    var playerOne = newComer;
    io.emit('player update', playerOne, playerTwo);

  } else if (io.sockets.adapter.rooms['Lobby'].length === 2){
    var playerTwo = newComer;
    io.emit('player update', playerOne, playerTwo);
  } else {
    io.emit('player update', playerOne, playerTwo);
  }

>>>>>>> b776c359301163b0f5d4e3f6878b8c8431722814:index.js

  socket.on('chat message', function(msg){
    console.log(msg);
    io.emit('chat message', msg);
  });
  socket.on('join room', function(){
    var oldroom;
    oldroom = socket.room;
    leave('Lobby')
    socket.room = 'testroom';
<<<<<<< HEAD:server.js
    join('testroom')
    // var clients = io.sockets.adapter.rooms['testroom'];
=======

>>>>>>> b776c359301163b0f5d4e3f6878b8c8431722814:index.js
  });
});



http.listen(3000, '192.168.1.13', function(){
  console.log('listening on http://192.168.1.13:3000');
});



function Player(options) {
  this.health = 10;
  this.id = options.id;
}


