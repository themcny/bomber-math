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
var quizQuestion;

function newQuestion() {
  quizQuestion = new Problem();
  $('#quiz-question').text(quizQuestion.question);
}


var socket = io();
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg){

  if (quizQuestion.answer === parseInt(msg)) {
    console.log('heres')
    startJump(4.0, -12.0);
    endJump();
    $('#messages').append($('<li>').text("you win!"));
  } else {
    startJump(-5.0, 4.0);
    endJump();
    $('#messages').append($('<li>').text("you lose!"));
  }
  newQuestion();
});

