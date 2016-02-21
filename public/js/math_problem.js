var quizQuestion1;
var quizQuestion2;
var socket = io();
var player = 2;

$(document).ready(function(){
  playerOneQuestion();
  playerTwoQuestion();
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Problem() {
  this.number1 = getRandomInt(1, 12);
  this.number2 = getRandomInt(1, 12);
  this.question = this.number1 + " * " + this.number2 + " = ?";
  this.answer = this.number1 * this.number2;
}

function playerOneQuestion() {
  quizQuestion1 = new Problem();
  $('#quiz-question-1').text(quizQuestion1.question);
}

function playerTwoQuestion() {
  quizQuestion2 = new Problem();
  $('#quiz-question-2').text(quizQuestion2.question);
}


$('#player-1-input').submit(function(){
  socket.emit('answer submit p1', $('#m1').val());
  $('#m1').val('');
  return false;
});

$('#player-2-input').submit(function(){
  socket.emit('answer submit p2', $('#m2').val());
  $('#m2').val('');
  return false;
});

// socket.on('player update', function(playerOne, playerTwo) {
//   console.log(playerOne)
//   console.log(playerTwo)
// })



if (player == 1){
  loopPlayerOne();
  var posX = 50.0;
  var posY = 550.0;
  var resetInt = setInterval(function() { reset(1) }, 10000);
} else if (player == 2){
  loopPlayerTwo();
  var posX = 750.0;
  var posY = 550.0;
  var resetInt = setInterval(function() { reset(2) }, 10000);
}

socket.on('answer submit p1', function(msg){
  if (quizQuestion1.answer === parseInt(msg)) {
    // if(player == 1){
    //   // for player 1
    //   startJump(6.0, -1000.0);
    //   endJump();
    //   damage('twohealth');
    // } else if (player == 2){
    //   // for player 2
    //   startJump(-6.0, -1000.0);
    //   endJump();
    //   damage('onehealth');
    // }
    socket.emit('register damage', 2)
    $('#messages-1').append($('<li>').text("Correct!"));
  } else {
    // if(player == 1){
    //   // for player 1
    //   startJump(4.0, -500.0);
    //   endJump();
    // } else if (player == 2){
    //   // for player 2
    //   startJump(-4.0, -500.0);
    //   endJump();
    // }
    $('#messages-1').append($('<li>').text("Incorrect"));
  }
  playerOneQuestion();
});

socket.on('answer submit p2', function(msg){
  if (quizQuestion2.answer === parseInt(msg)) {
    // if(player == 1){
    //   // for player 1
    //   startJump(6.0, -1000.0);
    //   endJump();
    //   damage('twohealth');
    // } else if (player == 2){
    //   // for player 2
    //   startJump(-6.0, -1000.0);
    //   endJump();
    //   damage('onehealth');
    // }
    socket.emit('register damage', 1)
    $('#messages-2').append($('<li>').text("Correct!"));
  } else {
    // if(player == 1){
    //   // for player 1
    //   startJump(4.0, -500.0);
    //   endJump();
    // } else if (player == 2){
    //   // for player 2
    //   startJump(-4.0, -500.0);
    //   endJump();
    // }
    $('#messages-2').append($('<li>').text("Incorrect"));
  }
  playerTwoQuestion();
});

socket.on('register damage', function(n) {
  console.log("REGISTER DAMAGE CLIENT")
  if (n == 1) { damage('onehealth') }
  if (n == 2) { damage('twohealth') }
})