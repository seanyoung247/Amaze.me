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

  let obj = new GameObject(map, objectDefs[0]);

  window.requestAnimationFrame(loop);
});

//Updates game state
function update(frameTime) {
  //Player direction
  if (pressedKeys.left.down) {
    player.turnLeft(frameTime);
  }
  if (pressedKeys.right.down) {
    player.turnRight(frameTime);
  }
  //Player movement
  if (pressedKeys.up.down) {
    player.moveForward(frameTime);
  }
  if (pressedKeys.down.down) {
    player.moveBack(frameTime);
  }
  if (pressedKeys.interact.up) {
    player.interact(frameTime);
    pressedKeys.interact.up = false;
  }
}

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
  ctx.fillText(("Camera FOV: " + Math.RadianToDegrees(player.camera.fov)), 25, 75);
  ctx.fillText(("Frame draw time: " + time + "ms"), 25, 100);
}

//Game loop
function loop(timeStamp) {
  var frameTime = timeStamp - lastFrame;
  //Ensures direction vector remains normalised
  player.direction.normalize();
  //Feeding update frameTime in seconds simplifies math
  update(frameTime / 1000);
  draw(frameTime);

  lastFrame = timeStamp;
  window.requestAnimationFrame(loop);
}

//Input events
var pressedKeys = {
  left: {down: false, up: false},
  right: {down: false, up: false},
  up: {down: false, up: false},
  down: {down: false, up: false},
  interact: {down: false, up: false}
}
var keyMap = {
  68: "right",      //D
  65: "left",       //A
  87: "up",         //W
  83: "down",       //S
  69: "interact"    //E
}
function keyDown(event) {
  pressedKeys[keyMap[event.keyCode]].down = true;
  pressedKeys[keyMap[event.keyCode]].up = false;
}
function keyUp(event) {
  pressedKeys[keyMap[event.keyCode]].down = false;
  pressedKeys[keyMap[event.keyCode]].up = true;
}
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);
