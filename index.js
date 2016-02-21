var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var lastPlayerId = 0;
var players = {};
var rooms = ['Lobby'];


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/room', function(req, res) {
  res.sendfile('room.html');
});

io.on('connection', function(socket){
  var newComer = new Player({id: lastPlayerId});
  players[lastPlayerId] = newComer;
  socket.player = newComer;
  socket.room = 'Lobby';
  socket.join('Lobby')
  lastPlayerId ++;
  // var clientNumber = io.sockets.adapter.rooms['Lobby'].length;
  // console.log(newComer);
  // console.log(clientNumber);

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('join room', function(){
    var oldroom;
    oldroom = socket.room;
    socket.leave(socket.room);
    socket.join('testroom');
    socket.room = 'testroom';
    // console.log(oldroom);
    // console.log(socket.room)
    // console.log(clientNumber);


  });
});



http.listen(3000, function(){
  console.log('listening on http://192.168.1.75:3000');
});



function Player(options) {
  this.health = 10;
  this.id = options.id;
}

