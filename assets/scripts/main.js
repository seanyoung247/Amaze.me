$( document ).ready(function() {
  var gameCanvas = document.getElementById("gameCanvas");
  var ctx = gameCanvas.getContext("2d");

  //Idea for responsive canvas resolution:
  ctx.canvas.width = $("#gameDiv").innerWidth() - 30;
  ctx.canvas.height = $("#gameDiv").innerHeight() - 30;

  //Clear screen
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);

  //Field of View calculation. Dividing width by height produces a FOV that
  //keeps object ratios square
  var FOV = ctx.canvas.width / ctx.canvas.height;

  var cam = new Camera(10.5,1.5,0,1,FOV);
  var map = new RayMap2(normalMap);

  //draw the scene
  cam.drawScene(gameCanvas, map);
});
