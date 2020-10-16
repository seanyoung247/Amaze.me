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
  this.camera.drawObjects(surface, this.map);
};

Player.prototype.moveTo = function (pX, pY, bX, bY) {
  let obj = null;
  //Check for wall collision when moving in x
  if (this.map.getTilePassable(Math.floor(bX), Math.floor(this.position.y))) {
    //Object collision
    obj = this.map.getObjectsInRange(new Point2(bX, this.position.y), this.radius);
    if ( obj === null ) {
      //No collision, move to new position in x
      this.position.x = pX;
    }
  }
  //Check for wall collision when moving in y
  if (this.map.getTilePassable(Math.floor(this.position.x), Math.floor(bY))) {
    obj = this.map.getObjectsInRange(new Point2(this.position.x, bY), this.radius);
    if ( obj === null ) {
      //No collision, move to new position in y
      this.position.y = pY;
    }
  }
}

Player.prototype.moveForward = function (timeDelta) {
  //Calculate new position
  let x = this.position.x + (this.direction.x * (timeDelta * this.moveSpeed));
  let y = this.position.y + (this.direction.y * (timeDelta * this.moveSpeed));
  //Calculate player outer boundary point
  let boundaryX = x + (this.direction.x * this.radius);
  let boundaryY = y + (this.direction.y * this.radius);

  this.moveTo(x, y, boundaryX, boundaryY);
};

Player.prototype.moveBack = function (timeDelta) {
  //Calculate new position
  let x = this.position.x - (this.direction.x * (timeDelta * this.moveSpeed));
  let y = this.position.y - (this.direction.y * (timeDelta * this.moveSpeed));
  //Calculate player outer boundary point
  let boundaryX = x - (this.direction.x * this.radius);
  let boundaryY = y - (this.direction.y * this.radius);

  this.moveTo(x, y, boundaryX, boundaryY);
};

Player.prototype.turnLeft = function (timeDelta) {
  this.direction.rotateByRadians(timeDelta * -this.turnSpeed);
};

Player.prototype.turnRight = function (timeDelta) {
  this.direction.rotateByRadians(timeDelta * this.turnSpeed);
};

Player.prototype.interact = function (timeDelta) {
  //Is there an object in range to interact with?
  let obj = this.map.getObjectsInRange(this.position, this.reach);
  if (obj != null) {
    obj.interact();
  }
};
