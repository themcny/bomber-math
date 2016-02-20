var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var posX = 100.0;
var posY = 176.0;
var velX = 0.0;
var velY = 0.0;
var gravity = 0.5;
var onGround = false;
// window.onload = jump();
// window.addEventListener("mousedown", startJump, false);
// window.addEventListener("mouseup", endJump, false);

window.addEventListener('keypress', function (e) {
    if (e.keyCode !== 13) {
        console.log('enter')
        startJump();
        endJump();
        resetVel();
    }
}, false);
loop();
function startJump(){
  console.log('startJump')
  console.log(velX)
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
  console.log('endJump')
}
function resetVel(
function loop(){
  update();
  render();
  window.setTimeout(loop, 33 );
}
function update(){
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
function render(){
  ctx.clearRect(0, 0, 500, 500);
  ctx.beginPath();
  ctx.moveTo(0,176);
  ctx.lineTo(500,175);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(posX - 10, posY - 20);
  ctx.lineTo(posX + 10, posY - 20);
  ctx.lineTo(posX + 10, posY);
  ctx.lineTo(posX - 10, posY);
  ctx.closePath();
  ctx.stroke();
}
