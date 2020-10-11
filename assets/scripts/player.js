/*
 * Functions as the player's avatar in the game world. Accepts player commands
 * and positions and interacts with world objects to render the scene.
 */
function Player(map, fov) {
  this.position = new Point2();
  //Create camera object to render player view
  this.camera = new Camera();
}
