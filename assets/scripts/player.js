/*
 * Functions as the player's avatar in the game world. Accepts player commands
 * and positions and interacts with world objects to render the scene.
 */
function Player(map, mSpeed, tSpeed, fov) {
  this.map = map;
  //Read initial position from map
  this.position = new Point2( map.playerSpawn.position.x,
                              map.playerSpawn.position.y );
  this.moveSpeed = mSpeed;
  //Read initial vector from map
  this.direction = new Vector2( map.playerSpawn.vector.x,
                                map.playerSpawn.vector.y );
  this.turnSpeed = tSpeed;
  //Create camera object to render player view
  this.camera = new Camera( this.position.x, this.position.y,
                            this.direction.x, this.direction.y,
                            fov);
}

Player.prototype.setFOV = function (fov) {
  this.camera.fov = fov;
};

Player.prototype.drawScene = function (surface) {
  //set camera to player position and direction
  this.camera.position.copy(this.position);
  this.camera.direction.copy(this.direction);
  //draw the scene
  this.camera.drawScene(surface, this.map);
};

Player.prototype.moveForward = function () {
  //Check for collision
  this.position.x += (this.direction.x * this.moveSpeed);
  this.position.y += (this.direction.y * this.moveSpeed);
};

Player.prototype.moveBack = function () {
  //Check for collision
  this.position.x -= (this.direction.x * this.moveSpeed);
  this.position.y -= (this.direction.y * this.moveSpeed);
};

Player.prototype.turnLeft = function () {
  this.direction.rotateByRadians(-this.turnSpeed);
};

Player.prototype.turnRight = function () {
  this.direction.rotateByRadians(this.turnSpeed);
};
