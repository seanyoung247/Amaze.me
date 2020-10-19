//Initial startup
var game = null;

$( document ).ready(function() {
  game = new GameState(document.getElementById("gameCanvas"), normalMap);

  //Attach event listeners
  //Keyboard
  $(window).keydown(function(event) {game.keyDown(event);});
  $(window).keyup(function(event) {game.keyUp(event);});
  //UI
  $( "#learnBtn" ).click(learnButtonClicked);
  $( "#playBtn" ).click(playButtonClicked);
  $( "#menuBtn").click(menuButtonClicked);

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

//UI event handlers
function playButtonClicked() {
  //If playing already we need to reset the game
  if (game.playing()) game.reset();

  game.playStart();
}
function learnButtonClicked() {
  //If playing already we need to reset the game
  if (game.playing()) game.reset();

  game.state = gamestates.TRAINING;
}
function pauseButtonClicked() {
  game.togglePause();
}
function menuButtonClicked() {
  /* If the splashscreen is visible when the button is pressed,
     it's about to be hidden so we need to unpause the game. */
  if ($( "#splashscreen" ).is(":visible")) {
    game.unpause();
  } else {
    game.pause();
  }
}
