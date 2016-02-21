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


function startJump(vx, vy){
  console.log('startJump')
  if(onGround){
    velX = vx;
    velY = vy;
    onGround = false;
  }
}
function endJump(){
  console.log('endJump')
  if(velY < -6.0){
    velY = -6.0;
  }
}
function loopPlayerTwo(){
  update();
  render();
  checkWin();
  window.setTimeout(loopPlayerTwo, 33 );
}
function loopPlayerOne(){
  update();
  render();
  checkWin();
  window.setTimeout(loopPlayerOne, 33 );
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

socket.on('position update', function(msg){
  console.log(msg);
  posY = msg.posY;
  posX = msg.posX;
  console.log('in client from server');
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
  if(onehealth <= 0 || twohealth <= 0){
    if(alert('Game Over')){}
    else    window.location.reload();
  }
}



