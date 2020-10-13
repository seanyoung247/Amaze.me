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
  player = new Player(map, 0.1, 0.025, (ctx.canvas.width / ctx.canvas.height));

  window.requestAnimationFrame(loop);
});

//Updates game state
function update() {
  //Player direction
  if (pressedKeys.left) {
    player.turnLeft();
  }
  if (pressedKeys.right) {
    player.turnRight();
  }
  //Player movement
  if (pressedKeys.up) {
    player.moveForward();
  }
  if (pressedKeys.down) {
    player.moveBack();
  }
}

//Renders game screen
function draw() {
  //Responsive canvas resolution
  ctx.canvas.width = $("#gameDiv").innerWidth() - 30;
  ctx.canvas.height = $("#gameDiv").innerHeight() - 30;
  //Draw background
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
  //Prepare rendering state
  player.setFOV(ctx.canvas.width / ctx.canvas.height);
  //Render player view
  player.drawScene(gameCanvas);
}

//Game loop
function loop(timeStamp) {
  var frameTime = timeStamp - lastFrame;

  update();
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
