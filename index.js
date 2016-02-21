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


  socket.on('answer submit', function(msg){
    console.log(msg);
    io.emit('answer submit', msg);
  });
  socket.on('join room', function(){
    var oldroom;
    oldroom = socket.room;
    socket.leave(socket.room);
    socket.join('testroom');
    socket.room = 'testroom';
  });
  socket.on('position update', function(position){
    console.log(position)
    console.log('in server from client')
    io.emit('position update', position);
  })
});



http.listen(3000, function(){
  console.log('listening on http://192.168.1.75:3000');
});



function Player(options) {
  this.health = 10;
  this.id = options.id;
}


