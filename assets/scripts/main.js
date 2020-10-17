//Initial startup
var lastFrame = 0;
var map = null;
var player = null;
var gameCanvas = null;
var ctx = null;

$( document ).ready(function() {
  gameCanvas = document.getElementById("gameCanvas");
  ctx = gameCanvas.getContext("2d");

  map = new RayMap2(normalMap, wallDefs);
  player = new Player(map,
                      3.0,    //Movement speed (world units per-second)
                      3.0,    //Turning speed (radians per-second)
                      0.2,    //Player object radius (world units)
                      1.0,    //Interaction distance (world units)
                      (ctx.canvas.width / ctx.canvas.height)); //FOV in radians

  //load as many object definitions on to the map as possbile.
  for (let i = 0; i < objectDefs.length; i++) {
    //GameObjects self register during creation
    new GameObject(map, objectDefs[i]);
  }
  //Start the game loop
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
  //Player interaction
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

/*
 * Draws the minimap at the position given on the canvas
 */
function drawMiniMap(x, y, ctx, alpha) {
  //Draw map geometry
  for (let tY = 0; tY < map.height; tY++) {
    for (let tX = 0; tX < map.width; tX++) {
      if (map.map[tY][tX] === 0) ctx.fillStyle = "rgba(0,0,0,"+alpha+")";
      else ctx.fillStyle = "rgba(0,255,0,"+alpha+")";

      ctx.fillRect((tX*10) + x, (tY*10) + y, 10, 10);
    }
  }
  //Draw object positions
  ctx.fillStyle = "blue";
  for (let i = 0; i < map.objects.length; i++) {
    let oX = Math.floor(map.objects[i].position.x * 10) + x;
    let oY = Math.floor(map.objects[i].position.y * 10) + y;
    ctx.beginPath();
    ctx.arc(oX, oY, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
  //Draw player position
  ctx.beginPath();
  let pX = Math.floor(player.position.x * 10) + x;
  let pY = Math.floor(player.position.y * 10) + y;
  let vX = Math.floor(pX + (player.direction.x * 10));
  let vY = Math.floor(pY + (player.direction.y * 10));
  ctx.fillStyle = "red";
  ctx.arc(pX, pY, 3, 0, 2 * Math.PI);
  ctx.fill();
  //Draw player Vector
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(pX, pY);
  ctx.lineTo(vX, vY);
  ctx.stroke();
}

function drawOverlay(ctx) {
  drawMiniMap(ctx.canvas.width - 175, 25, ctx, 0.35);
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

  drawOverlay(ctx);

  let time = performance.now() - t1;

  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText( (1000/time) + "FPS", 25, 25 );
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
//To Do: Make these settable
var keyMap = {
  68: "right",      //D
  39: "right",      //Right Arrow
  65: "left",       //A
  37: "left",       //Left Arrow
  87: "up",         //W
  38: "up",         //Up Arrow
  83: "down",       //S
  40: "down",       //Down Arrow
  69: "interact",   //E
  32: "interact"    //Spacebar
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
