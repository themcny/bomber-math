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
  socket.room = 'Lobby';
  socket.join('Lobby')

  socket.on('answer submit', function(msg){
    console.log(msg);
    io.emit('answer submit', msg);
  });

  socket.on('join room', function(){
    // Leave Lobby room
    var oldroom = socket.room;
    socket.leave(oldroom);

    // Check if there's a gameRoom with only one player in it
    for (var i = 0; i < gameRooms.length; i++) {
      if (gameRooms[i].players.length === 1 && gameRooms[i].players[0] !== socket.id) {
        // Join a room with a player and start game
        console.log("here")
        gameRooms[i].players.push(socket.id)
        socket.room = gameRooms[i].roomId;
        socket.join(socket.room)
        // Find the player already in the room and assign as playerOne
        var playerOneObj = io.sockets.adapter.rooms[socket.room].sockets;
        var playerOneId = Object.keys(playerOneObj)[1]
        var playerOne = new Player({id: playerOneId, playerId: 1})
        // Find the new player and assign as playerTwo
        var playerTwo = new Player({id: socket.id, playerId: 2});
        io.to(socket.room).emit('game start', playerOne, playerTwo);
      } else if (i === gameRooms.length - 1) {
        console.log("!!!!MAKE NEW ROOM!!!!")
        makeNewRoom(socket)
        console.log(gameRooms)
        break
      }
    }
    if (gameRooms.length === 0) {
      console.log("####MAKE NEW ROOM####")
      makeNewRoom(socket)
    }

  });

  socket.on('position update', function(position){
    // console.log(position)
    // console.log('in server from client')
    io.emit('position update', position);
  });
});




http.listen(3000, '192.168.1.75', function(){

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


