var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = {};
var gameRooms = [];
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});


io.on('connection', function(socket){
  var newComer = new Player({id: socket.id, playerId: 2});
  players[socket.id] = newComer;
  socket.player = newComer;
  socket.room = 'Lobby';
  socket.join('Lobby')
  // console.log(newComer);

  // if (io.sockets.adapter.rooms['Lobby'].length < 2){
  //   var playerOne = newComer;
  //   io.emit('player update', playerOne, playerTwo);
  // } else if (io.sockets.adapter.rooms['Lobby'].length === 2){
  //   var playerTwo = newComer;
  //   io.emit('player update', playerOne, playerTwo);
  // } else {
  //   io.emit('player update', playerOne, playerTwo);
  // }


  socket.on('chat message', function(msg){
    console.log(msg);
    io.emit('chat message', msg);
  });

  socket.on('join room', function(){
    // Leave Lobby room
    var oldroom = socket.room;
    socket.leave(oldroom);
    
    // Check if there's a gameRoom with only one player in it
    for (var i = 0; i < gameRooms.length; i++) {
      if (gameRooms[i].players.length === 1) {
        // Join a room with a player and start game
        console.log("here")
        gameRooms[i].players.push(socket.id)
        socket.room = gameRooms[i].roomId;
        socket.join(socket.room)
        var playerOneObj = io.sockets.adapter.rooms[socket.room].sockets;
        var playerOneId = Object.keys(playerOneObj)[1]
        var playerOne = new Player({id: playerOneId, playerId: 1})
        var playerTwo = newComer;
        // delete gameRooms[i]
        io.to(socket.room).emit('game start', playerOne, playerTwo);
      } else if (i === gameRooms.length - 1) {
        console.log("!!!!MAKE NEW ROOM!!!!")
        makeNewRoom(socket)
        console.log(gameRooms)
      }
    }
    if (gameRooms.length === 0) {
      console.log("####MAKE NEW ROOM####")
      makeNewRoom(socket)
    }

  });
});


http.listen(3000, '192.168.1.13', function(){
  console.log('listening on http://192.168.1.13:3000');
});

function makeNewRoom(socket) {
  var newRoomId = (Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000).toString()
  var newRoom = new Room({id: newRoomId});
  newRoom.players.push(socket.id)
  gameRooms.push(newRoom);
  socket.room = newRoom.roomId;
  socket.join(newRoom.roomId);
  io.to(socket.id).emit('waiting');
}

function Room(options) {
  this.roomId = options.id;
  this.players = []
}

function Player(options) {
  this.health = 10;
  this.id = options.id;
  this.playerId = options.playerId;
}


