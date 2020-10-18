//Initial startup
var lastFrame = 0;
var game = null;

$( document ).ready(function() {
  game = new GameState(document.getElementById("gameCanvas"), normalMap);

  //Pause control not yet implimented...
  game.state = gamestates.TRAINING;

  //Game difficulty control not implimented yet...
  game.difficulty = gamedifficulty.EASY;

  game.playStart();

  window.addEventListener("keydown", function(event) {game.keyDown(event);}, false);
  window.addEventListener("keyup", function(event) {game.keyUp(event);}, false);

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

  game.drawScene(frameTime);
  game.drawOverlay(frameTime);

  let time = performance.now() - t1;
}

//Game loop
function loop(timeStamp) {
  let player = game.player;

  let frameTime = game.frameStart(timeStamp);

  //Ensures direction vector remains normalised
  player.direction.normalize();
  //Feeding update frameTime in seconds simplifies math
  game.update(frameTime / 1000);
  draw(frameTime);

  game.frameEnd(timeStamp);

  window.requestAnimationFrame(loop);
}
