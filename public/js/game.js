var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var posX = 100.0;
var posY = 176.0;
var velX = 0.0;
var velY = 0.0;
var gravity = 0.5;
var onGround = false;
loop();
function startJump(vx, vy){
  if(onGround){
    velX = vx;
    velY = vy;
    onGround = false;
  }
}
function endJump(){
  if(velY < -6.0){
    velY = -6.0;
  }
}
function loop(player){
  update(player);
  render();
  window.setTimeout(loop, 33 );
}
function update(player){
  if (player == 1){
    velY += gravity;
    posY += velY;
    posX += velX;
    if(posY > 175.0){
      posY = 175.0;
      velY = 0.0;
      velX = 0.0;
      onGround = true;
    }
  } else if(player == 2){
    velY += gravity;
    posY += velY;
    posX -= velX;
    if(posY > 175.0){
      posY = 175.0;
      velY = 0.0;
      velX = 0.0;
      onGround = true;
    }
  }

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
  ctx.rect(0,175,150,100);
  ctx.rect((500-175),175,150,100);

  ctx.stroke();
}
