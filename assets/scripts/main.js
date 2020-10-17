//Initial startup
var lastFrame = 0;
var game = null;

$( document ).ready(function() {
  game = new GameState(document.getElementById("gameCanvas"), normalMap);

  //Pause control not yet implimented...
  game.state = gamestates.TRAINING;

  //Game difficulty control not implimented yet...
  game.difficulty = gamedifficulty.HARD;

  //Start the game loop
  window.requestAnimationFrame(loop);
});

function drawBackground(ctx) {
  //Draw sky gradient
  let grad = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
  grad.addColorStop(0, "#3190C5");
  grad.addColorStop(0.5,"#ADD8E6");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height / 2);
  //Draw Floor
  ctx.fillStyle = "#76552B";
  ctx.fillRect(0, ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height / 2);
}

//Renders game screen
function draw(frameTime) {
  let ctx = game.gameContext;
  let player = game.player;
  let t1 = performance.now();
  //Responsive canvas resolution
  ctx.canvas.width = $("#gameDiv").innerWidth() - 30;
  ctx.canvas.height = $("#gameDiv").innerHeight() - 30;
  //Draw background
  drawBackground(ctx);
  //Prepare rendering state
  player.setFOV(ctx.canvas.width / ctx.canvas.height);
  //Render player view
  player.drawScene(game.gameCanvas);

  game.drawOverlay();

  let time = performance.now() - t1;
}

//Game loop
function loop(timeStamp) {
  let player = game.player;
  var frameTime = timeStamp - lastFrame;
  //Ensures direction vector remains normalised
  player.direction.normalize();
  //Feeding update frameTime in seconds simplifies math
  game.update(frameTime / 1000);
  draw(frameTime);

  lastFrame = timeStamp;
  window.requestAnimationFrame(loop);
}

//Input events
//To Do: Make these settable
var keyMap = {
  68: "turnRight",  //D
  39: "turnRight",  //Right Arrow
  65: "turnLeft",   //A
  37: "turnLeft",   //Left Arrow
  90: "left",       //Z
  88: "right",      //X
  87: "up",         //W
  38: "up",         //Up Arrow
  83: "down",       //S
  40: "down",       //Down Arrow
  69: "interact",   //E
  32: "interact"    //Spacebar
}
function keyDown(event) {
  game.inputMap[keyMap[event.keyCode]].down = true;
  game.inputMap[keyMap[event.keyCode]].up = false;
}
function keyUp(event) {
  game.inputMap[keyMap[event.keyCode]].down = false;
  game.inputMap[keyMap[event.keyCode]].up = true;
}
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);
