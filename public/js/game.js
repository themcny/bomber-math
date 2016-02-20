var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var posX = 100.0;
var posY = 175.0;
var velX = 0.0;
var velY = 0.0;
var gravity = 0.5;
var onGround = false;
window.addEventListener("mousedown", startJump, false);
window.addEventListener("mouseup", endJump, false);
loop();
function startJump(){
  if(onGround){
    velX = 4.0;
    velY = -12.0;
    onGround = false;
  }
}
function endJump(){
  if(velY < -6.0){
    velY = -6.0;
  }
}
function loop(){
  Update();
  Render();
  window.setTimeout(loop, 33);
}
function Update(){
  velY += gravity;
  posY += velY;
  posX += velX;
  if(posY > 175.0){
    posY = 175.0;
    velY = 0.0;
    onGround = true;
  }
// if(posX < 10 || posX > 190)
//     velX *= -1;
}
function Render(){
  ctx.clearRect(0, 0, 200, 200);
  ctx.beginPath();
  ctx.moveTo(0,175);
  ctx.lineTo(200,175);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(posX - 10, posY - 20);
  ctx.lineTo(posX + 10, posY - 20);
  ctx.lineTo(posX + 10, posY);
  ctx.lineTo(posX - 10, posY);
  ctx.closePath();
  ctx.stroke();
}
