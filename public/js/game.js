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
    $('#tank1').effect("explode");
    resetPage();
  } else if (twohealth <= 0) {
    $('#outcome').text("Player 1 Wins!")
    $('#tank2').effect("explode");
    resetPage();
  }
}

function resetPage(){
  setTimeout(function() {
    $('#landing').removeClass('hidden');
    $('#game').addClass('hidden');
  }, 3000);
}


///////////////////////
// Socket Events     //
///////////////////////

socket.on('answer submit p1', function(msg){
  if (quizQuestion1.answer === parseInt(msg)) {
    socket.emit('register damage', 2)
    $('#ball-one').addClass("ball-one-animation");
    setTimeout(function() { $('#ball-one').removeClass("ball-one-animation")}, 1000)
    $('#messages-1').append($('<li>').text("Correct!"));
  } else {
    $('#messages-1').append($('<li>').text("Incorrect"));
  }
  playerOneQuestion();
});

socket.on('answer submit p2', function(msg){
  if (quizQuestion2.answer === parseInt(msg)) {
    socket.emit('register damage', 1)
    $('#ball-two').addClass("ball-two-animation")
    setTimeout(function() { $('#ball-two').removeClass("ball-two-animation"); console.log('removed')}, 1000)
    $('#messages-2').append($('<li>').text("Correct!"));
  } else {
    $('#messages-2').append($('<li>').text("Incorrect"));
  }
  playerTwoQuestion();
});

socket.on('register damage', function(n) {
  if (n == 1) {
    damage('onehealth');
    $('#tank1').effect( "shake", {times:3}, 500 );
    checkWin();
  }
  if (n == 2) {
    damage('twohealth')
    $('#tank2').effect( "shake", {times:3}, 500 );
    checkWin();
  };
});

// when one player is in a room waiting for an opponent after hitting ready
socket.on('waiting', function() {
  $('#landing').addClass('hidden');
  $('#waiting').text('Waiting for an opponent...');
});

// when two players have hit ready, game begins
socket.on('game start', function(playerOne, playerTwo) {
  $('#waiting').text('');
  $('#landing').addClass('hidden');
  $('#game').removeClass('hidden');
  $('#start-game').removeClass('hidden');
  var thisId = "/#" + socket.id
  if (thisId == playerOne.id) {
    $('#player-name').text("Player 1")
    $('#player-1-input').removeClass('hidden').focus();
    $('#quiz-question-1').removeClass('hidden');
    $('#messages-1').removeClass('hidden');
  } else if (thisId == playerTwo.id) {
    $('#player-name').text("Player 2")
    $('#player-2-input').removeClass('hidden').focus();
    $('#quiz-question-2').removeClass('hidden');
    $('#messages-2').removeClass('hidden');
  }
});

$('#join-room').on('click', function(){
    socket.emit('join room');
})
