$( document ).ready(function() {
  var gameCanvas = document.getElementById("gameCanvas");
  //var ctx = gameCanvas.getContext("2d");

  var cam = new Camera(1.5,1.5,1,0);
  var map = new RayMap2(normalMap);

  cam.drawScene(gameCanvas, map);

});
