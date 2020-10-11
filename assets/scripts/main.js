$( document ).ready(function() {
  var gameCanvas = document.getElementById("gameCanvas");
  var ctx = gameCanvas.getContext("2d");

  //Idea for responsive canvas resolution:
  ctx.canvas.width = $("#gameDiv").innerWidth() - 30;
  ctx.canvas.height = $("#gameDiv").innerHeight() - 30;

  //Clear screen
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);

  //Create camera with initial position of 1.5,1.5 and a direction of 90degrees
  var cam = new Camera(1.5,1.5,1,0);
  var map = new RayMap2(normalMap);

  //draw the scene
  cam.drawScene(gameCanvas, map);
});
