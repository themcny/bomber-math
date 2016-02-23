var quizQuestion1;
var quizQuestion2;
var socket = io();

$(document).ready(function(){
  playerOneQuestion();
  playerTwoQuestion();
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function Problem() {
  this.number1 = getRandomInt(1, 12);
  this.number2 = getRandomInt(1, 12);
  this.question = this.number1 + " * " + this.number2 + " = ?";
  this.answer = this.number1 * this.number2;
};

function playerOneQuestion() {
  quizQuestion1 = new Problem();
  $('#quiz-question-1').text(quizQuestion1.question);
};

function playerTwoQuestion() {
  quizQuestion2 = new Problem();
  $('#quiz-question-2').text(quizQuestion2.question);
};


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




