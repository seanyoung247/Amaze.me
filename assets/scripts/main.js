//Initial startup
var lastFrame = 0;
var map = null;
var player = null;
var gameCanvas = null;
var ctx = null;

$( document ).ready(function() {
  gameCanvas = document.getElementById("gameCanvas");
  ctx = gameCanvas.getContext("2d");

  map = new RayMap2(normalMap);
  player = new Player(map,
                      3.0,    //Movement speed (world units per-second)
                      3.0,    //Turning speed (radians per-second)
                      0.2,    //Player object radius (world units)
                      1.0,    //Interaction distance (world units)
                      (ctx.canvas.width / ctx.canvas.height)); //FOV in radians
  
  window.requestAnimationFrame(loop);
});

//Updates game state
function update(frameTime) {
  //Player direction
  if (pressedKeys.left) {
    player.turnLeft(frameTime);
  }
  if (pressedKeys.right) {
    player.turnRight(frameTime);
  }
  //Player movement
  if (pressedKeys.up) {
    player.moveForward(frameTime);
  }
  if (pressedKeys.down) {
    player.moveBack(frameTime);
  }
}

function drawBackground(ctx) {
  ctx.fillStyle = "#87CEEB";
  let grad = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
  grad.addColorStop(0, "#3190C5");
  grad.addColorStop(0.5,"#ADD8E6");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height / 2);
  //Draw Floor
  ctx.fillStyle = "#76552B";
  ctx.fillRect(0, ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height / 2);
  //Draw walls
  ctx.fillStyle = "#00FF00";
}

//Renders game screen
function draw(frameTime) {
  let t1 = performance.now();

  //Responsive canvas resolution
  ctx.canvas.width = $("#gameDiv").innerWidth() - 30;
  ctx.canvas.height = $("#gameDiv").innerHeight() - 30;
  //Draw background
  drawBackground(ctx);
  //Prepare rendering state
  player.setFOV(ctx.canvas.width / ctx.canvas.height);
  //Render player view
  player.drawScene(gameCanvas);

  let time = performance.now() - t1;

  //// DEBUG:
  ctx.fillStyle = "rgb(255,0,0)";
  ctx.fillText(("Player Position x: " + player.position.x + " Y: " + player.position.y), 25, 25);
  ctx.fillText(("Player Vector x: " + player.direction.x + " Y: " + player.direction.y), 25, 50);
  ctx.fillText(("Frame draw time: " + time + "ms"), 25, 75);
}

//Game loop
function loop(timeStamp) {
  var frameTime = timeStamp - lastFrame;

  /*
   * I've noticed that the magnitude of the direction vector tends to increase
   * slowly over time. Math throughout collision and movement code assumes the
   * direction vector is a normalized vector (i.e. has a magnitude of 1.0.
   * This helps combat that, though it would be more efficient to call this less
   * frequently than every frame.
   */
  player.direction.normalize();

  update(frameTime / 1000);
  draw();

  lastFrame = timeStamp;
  window.requestAnimationFrame(loop);
}

//Input events
var pressedKeys = {
  left: false,
  right: false,
  up: false,
  down: false,
  interact: false
}
var keyMap = {
  68: "right",
  65: "left",
  87: "up",
  83: "down",
  69: "interact"
}
function keyDown(event) {
  pressedKeys[keyMap[event.keyCode]] = true;
}
function keyUp(event) {
  pressedKeys[keyMap[event.keyCode]] = false;
}
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);
