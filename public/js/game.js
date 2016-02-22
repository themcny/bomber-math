///////////////////////
//   Socket Events   //
///////////////////////

var socket = io();

$('#join-room').on('click', function(){
    socket.emit('join room');
});

socket.on('waiting', function() {
  $('#landing').addClass('hidden');
  $('#waiting').text('Waiting for an opponent...');
});

// when two players have hit ready, game begins
socket.on('game start', function(playerOne, playerTwo) {
  $('#waiting').text('');
  $('#landing').addClass('hidden');
  $('#game').removeClass('hidden');
  $('#tank1').show();
  $('#tank2').show();
  if (this.id === playerOne.id) {
    $('#player-name').text("Player 1")
    showPlayerOneUI();
    playerOneQuestion();
  } else if (this.id == playerTwo.id) {
    $('#player-name').text("Player 2");
    showPlayerTwoUI();
    playerTwoQuestion();
  };
});

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
    $('#ball-one').addClass("cannon-ball-animation");
    shake($('#tank1'));
    checkWin();
  }
  if (n == 2) {
    damage('twohealth')
    $('#ball-two').addClass("cannon-ball-animation");
    shake($('#tank2'));
    checkWin();
  };
});

//////////////////////////
// Additional Functions //
//////////////////////////

function showPlayerOneUI() {
  $('#player-1-input').removeClass('hidden');
  $('#quiz-question-1').removeClass('hidden');
  $('#messages-1').removeClass('hidden');
  $('#m1').focus();
};
function hidePlayerOneUI() {
  $('#player-1-input').addClass('hidden');
  $('#quiz-question-1').addClass('hidden');
  $('#messages-1').addClass('hidden');
};

function showPlayerTwoUI() {
  $('#player-2-input').removeClass('hidden');
  $('#quiz-question-2').removeClass('hidden');
  $('#messages-2').removeClass('hidden');
  $('#m2').focus();
}
function hidePlayerTwoUI() {
  $('#player-2-input').addClass('hidden');
  $('#quiz-question-2').addClass('hidden');
  $('#messages-2').addClass('hidden');
};

// Replacement shake effect
function shake(div){
  var interval = 80;                                      
  var distance = 7;                                      
  var times = 4;
  $(div).css('position','relative');
  for(var iter=0;iter<(times+1);iter++){
      $(div).animate({
        left:((iter%2==0 ? distance : distance*-1))
      },interval);                                   
  }
  $(div).animate({ left: 0},interval);                                        
}


function damage(otherPlayer){
  playerHealth = document.getElementById(otherPlayer);
  playerHealth.value = playerHealth.value - 20;
}

function checkWin(){
  var onehealth = parseInt(document.getElementById('onehealth').value)
  var twohealth = parseInt(document.getElementById('twohealth').value)
  if (onehealth <= 0) {
    $('.submit-button').attr('disabled', 'disabled');
    $('#quiz-question-1').text("Player 2 Wins!");
    $('#quiz-question-2').text("Player 2 Wins!");
    $('#tank1').fadeOut('slow');
    resetPage();
  } else if (twohealth <= 0) {
    $('.submit-button').attr('disabled', 'disabled');
    $('#quiz-question-1').text("Player 1 Wins!");
    $('#quiz-question-2').text("Player 1 Wins!");
    $('#tank2').fadeOut('slow');
    resetPage();
  };
};

function resetPage(){
  setTimeout(function() {
    hidePlayerOneUI();
    hidePlayerTwoUI();
    $('ul').empty();
    $('#onehealth').val(100);
    $('#twohealth').val(100);
    $('#game').addClass('hidden');
    $('#landing').removeClass('hidden');
  }, 3000);
};

