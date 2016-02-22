var socket = io();

function damage(otherPlayer){
  playerHealth = document.getElementById(otherPlayer);
  playerHealth.value = playerHealth.value - 20;
}

function checkWin(){
  onehealth = parseInt(document.getElementById('onehealth').value)
  twohealth = parseInt(document.getElementById('twohealth').value)
  if (onehealth <= 0) {
    $('#outcome').text("Player 2 Wins!")
    $('#cannon-one').effect("explode");

  } else if (twohealth <= 0) {
    $('#outcome').text("Player 1 Wins!")
    $('#cannon-two').effect("explode");
  }
}


///////////////////////
// Socket Events     //
///////////////////////

socket.on('answer submit p1', function(msg){
  if (quizQuestion1.answer === parseInt(msg)) {
    socket.emit('register damage', 2)
    $('#messages-1').append($('<li>').text("Correct!"));
  } else {
    $('#messages-1').append($('<li>').text("Incorrect"));
  }
  playerOneQuestion();
});

socket.on('answer submit p2', function(msg){
  if (quizQuestion2.answer === parseInt(msg)) {
    socket.emit('register damage', 1)
    $('#messages-2').append($('<li>').text("Correct!"));
  } else {
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
  } else if (thisId == playerTwo.id) {
    $('#player-name').text("Player 2")
    $('#player-2-input').removeClass('hidden');
    $('#quiz-question-2').removeClass('hidden');
    $('#messages-2').removeClass('hidden');
  }
});

$('#join-room').on('click', function(){
    socket.emit('join room');
})