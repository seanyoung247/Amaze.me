/*
 * Functions as the player's avatar in the game world. Accepts player commands
 * and positions and interacts with world objects to render the scene.
 */
function Player(map, mSpeed, tSpeed, radius, reach, fov) {
  this.map = map;
  //Read initial position from map
  this.position = new Point2( map.playerSpawn.position.x,
                              map.playerSpawn.position.y );
  //Read initial vector from map
  this.direction = new Vector2( map.playerSpawn.vector.x,
                                map.playerSpawn.vector.y );
  //Set movement and turn increment speed
  this.moveSpeed = mSpeed;
  this.turnSpeed = tSpeed;
  //Player size metrics
  this.radius = radius;  //Distance from player which would cause an intersection
  this.reach = reach;    //Maximum distance from an object the player can be
                         //when interacting

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

Player.prototype.moveTo = function (pX, pY, bX, bY) {
  //Check for wall collision when moving in x
  if (this.map.getTilePassable(Math.floor(bX), Math.floor(this.position.y))) {
    //No collision, move to new position in x
    this.position.x = pX;
    //TODO: Check for object collision
  }
  //Check for wall collision when moving in y
  if (this.map.getTilePassable(Math.floor(this.position.x), Math.floor(bY))) {
    //No collision, move to new position in y
    this.position.y = pY;
    //TODO: Check for object collision
  }
}

Player.prototype.moveForward = function (timeDelta) {
  //Calculate new position
  let x = this.position.x + (this.direction.x * (this.moveSpeed / timeDelta));
  let y = this.position.y + (this.direction.y * (this.moveSpeed / timeDelta));
  //Calculate player outer boundary point
  let boundaryX = x + (this.direction.x * this.radius);
  let boundaryY = y + (this.direction.y * this.radius);

  this.moveTo(x, y, boundaryX, boundaryY);
};

Player.prototype.moveBack = function (timeDelta) {
  //Calculate new position
  let x = this.position.x - (this.direction.x * (this.moveSpeed / timeDelta));
  let y = this.position.y - (this.direction.y * (this.moveSpeed / timeDelta));
  //Calculate player outer boundary point
  let boundaryX = x - (this.direction.x * this.radius);
  let boundaryY = y - (this.direction.y * this.radius);

  this.moveTo(x, y, boundaryX, boundaryY);
};

Player.prototype.turnLeft = function (timeDelta) {
  this.direction.rotateByRadians(-this.turnSpeed / timeDelta);
};

Player.prototype.turnRight = function (timeDelta) {
  this.direction.rotateByRadians(this.turnSpeed / timeDelta);
};
