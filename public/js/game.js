var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var socket = io();
// player 1
// var posX = 50.0;
// var posY = 550.0;

//player 2
// var posX = 750.0;
// var posY = 550.0;

var velX = 0.0;
var velY = 0.0;
var gravity = 0.1;
var onGround = false;

function reset(player){
  if (posY >= 500 && player == 1) {
    posX = 50.0;
    posY = 550.0;
  }else if (posY >= 500 && player == 2){
    posX = 750.0;
    posY = 550.0;
  }
}

function gameLoop(){
  update();
  render();
  window.setTimeout(gameLoop, 33 );
}

function startJump(vx, vy){
  if(onGround){
    velX = vx;
    velY = vy;
    onGround = false;
  }
}
function endJump(){
  if(velY < -6.0){
    velY = -6.0;
  }
}


function update(){
  velY += gravity;
  posY += velY;
  posX += velX;
  if(posY > 500.0){
    posY = 500.0;
    velY = 0.0;
    velX = 0.0;
    onGround = true;
  }
  // send data to server for client position
  socket.emit('position update', {posX: posX, posY: posY});
}

socket.on('position update', function(position){
  posY = position.posY;
  posX = position.posX;
});

function render(){
  ctx.clearRect(0, 0, 800, 500);
  ctx.beginPath();
  ctx.moveTo(0,176);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(posX - 10, posY - 20);
  ctx.lineTo(posX + 10, posY - 20);
  ctx.lineTo(posX + 10, posY);
  ctx.lineTo(posX - 10, posY);
  ctx.closePath();
  ctx.stroke();
}

function damage(otherPlayer){
  playerHealth = document.getElementById(otherPlayer);
  playerHealth.value = playerHealth.value - 20;
}

function checkWin(){
  onehealth = parseInt(document.getElementById('onehealth').value)
  twohealth = parseInt(document.getElementById('twohealth').value)
  if (onehealth <= 0) {
    $('#outcome').text("Player 2 Wins!")
  } else if (twohealth <= 0) {
    $('#outcome').text("Player 1 Wins!")
  }
}




///////////////////////
// Socket Events     //
///////////////////////

socket.on('answer submit p1', function(msg){
  if (quizQuestion1.answer === parseInt(msg)) {

    startJump(6.0, -1000.0);
    endJump();
    socket.emit('register damage', 2)
    $('#messages-1').append($('<li>').text("Correct!"));
  } else {

    startJump(4.0, -500.0);
    endJump();
    $('#messages-1').append($('<li>').text("Incorrect"));
  }
  playerOneQuestion();
});

socket.on('answer submit p2', function(msg){
  if (quizQuestion2.answer === parseInt(msg)) {

    startJump(-6.0, -1000.0);
    endJump();

    socket.emit('register damage', 1)
    $('#messages-2').append($('<li>').text("Correct!"));
  } else {

    startJump(-4.0, -500.0);
    endJump();
    $('#messages-2').append($('<li>').text("Incorrect"));
  }
  playerTwoQuestion();
});

socket.on('register damage', function(n) {
  if (n == 1) {
    damage('onehealth');
    $('#cannon-one').effect( "shake", {times:3}, 500 );
    checkWin();
  }
  if (n == 2) {
    damage('twohealth')
    $('#cannon-two').effect( "shake", {times:3}, 500 );
    checkWin();
  };
});

// when one player is in a room waiting for an opponent after hitting ready
socket.on('waiting', function() {
  $('#join-room').addClass('hidden');
  $('#waiting').text('Waiting for an opponent...');
});

// when two players have hit ready, game begins
socket.on('game start', function(playerOne, playerTwo) {
  $('#waiting').text('');
  $('#join-room').addClass('hidden');
  $('#start-game').removeClass('hidden');
  var thisId = "/#" + socket.id
  if (thisId == playerOne.id) {
    $('#player-name').text("Player 1")
    $('#player-1-input').removeClass('hidden');
    $('#quiz-question-1').removeClass('hidden');
    $('#messages-1').removeClass('hidden');
    var posX = 50.0;
    var posY = 550.0;
    var resetInt = setInterval(function() { reset(1) }, 10000);

  } else if (thisId == playerTwo.id) {
    $('#player-name').text("Player 2")
    $('#player-2-input').removeClass('hidden');
    $('#quiz-question-2').removeClass('hidden');
    $('#messages-2').removeClass('hidden');
    var posX = 750.0;
    var posY = 550.0;
    var resetInt = setInterval(function() { reset(2) }, 10000);
  }
  gameLoop();
});

$('#join-room').on('click', function(){
    socket.emit('join room');
})