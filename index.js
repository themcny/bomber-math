var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var lastPlayerId = 0;
var players = {};


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  var newComer = new Player({id: lastPlayerId});
  players[lastPlayerId] = newComer;
  socket.player = newComer;
  lastPlayerId ++;
  console.log(newComer);

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


http.listen(3000, function(){
  console.log('listening on http://192.168.1.75:3000');
});



function Player(options) {
  this.health = 10;
  this.id = options.id;
}

