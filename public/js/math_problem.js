var quizQuestion;
var socket = io();
var player = 2;

$(document).ready(function(){
  newQuestion();
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


function newQuestion() {
  quizQuestion = new Problem();
  $('#quiz-question').text(quizQuestion.question);
}




$('form').submit(function(){
  console.log('form here')
  socket.emit('answer submit', $('m').val());
  $('#m').val('');
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

socket.on('answer submit', function(msg){

  if (quizQuestion.answer === parseInt(msg)) {
    if(player == 1){
      // for player 1
      startJump(6.0, -1000.0);
      endJump();
      damage('twohealth');
    } else if (player == 2){
      // for player 2
      startJump(-6.0, -1000.0);
      endJump();
      damage('onehealth');
    }
    $('#messages').append($('<li>').text("you win!"));
  } else {
    if(player == 1){
      // for player 1
      startJump(4.0, -500.0);
      endJump();
    } else if (player == 2){
      // for player 2
      startJump(-4.0, -500.0);
      endJump();
    }
    $('#messages').append($('<li>').text("you lose!"));
  }
  newQuestion();
});



