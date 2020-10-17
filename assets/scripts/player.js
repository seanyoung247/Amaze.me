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

/*
 * Performs collision detection and moves the player
 */
Player.prototype.move = function (timeDelta, directionX, directionY) {
  //Calculate new position
  let pX = this.position.x + (directionX * (timeDelta * this.moveSpeed));
  let pY = this.position.y + (directionY * (timeDelta * this.moveSpeed));
  //Calculate player outer boundary point
  let bX = pX + (directionX * this.radius);
  let bY = pY + (directionY * this.radius);

  let obj = null;
  //Check for wall collision when moving in x
  if (this.map.getTilePassable(Math.floor(bX), Math.floor(this.position.y))) {
    //Check for Object collision in x
    obj = this.map.getObjectsInRange(new Point2(bX, this.position.y), this.radius);
    //javascript uses lazy evaluation so if obj === null obj.blocking is never evaluated
    if ( obj === null || !obj.blocking) {
      //No collision, move to new position in x
      this.position.x = pX;
    }
  }
  //Check for wall collision when moving in y
  if (this.map.getTilePassable(Math.floor(this.position.x), Math.floor(bY))) {
    //Check for Object collision in y
    obj = this.map.getObjectsInRange(new Point2(this.position.x, bY), this.radius);
    if ( obj === null || !obj.blocking) {
      //No collision, move to new position in y
      this.position.y = pY;
    }
  }
  //IMPROVEMENT: if collision before move detected, move player out of collision.
  //IMPROVEMENT: if collision after move detected, move player upto collision point.
}

/*
 * These functions moves the player backward and forwards along it's view vector.
 *  Player movement is actually performed by the move method, but these methods
 *  aid readability.
 */
Player.prototype.moveForward = function (timeDelta) {
  //Move along view vector
  this.move(timeDelta, this.direction.x, this.direction.y);
};

Player.prototype.moveBack = function (timeDelta) {
  //Move along negative of move vector
  this.move(timeDelta, -this.direction.x, -this.direction.y);
};

Player.prototype.moveLeft = function (timeDelta) {
  //Move along right angle of the view vector
  this.move(timeDelta, this.direction.y, -this.direction.x);
};

Player.prototype.moveRight = function (timeDelta) {
  //Move along right angle of the view vector
  this.move(timeDelta, -this.direction.y, this.direction.x);
};

/*
 * These functions rotate the player view left and right.
 */
Player.prototype.turnLeft = function (timeDelta) {
  this.direction.rotateByRadians(timeDelta * -this.turnSpeed);
};

Player.prototype.turnRight = function (timeDelta) {
  this.direction.rotateByRadians(timeDelta * this.turnSpeed);
};

/*
 * Performs player-object interaction.
 *  NOTE: Probably doesn't need timeDelta but i've added it to remain consistent
 *        with other functions, and incase it's needed in the future.
 */
Player.prototype.interact = function (timeDelta) {
  //Is there an object in range to interact with?
  let obj = this.map.getObjectsInRange(this.position, this.reach);
  if (obj != null) {
    //TODO: game logic tests to see if we *should* interact with this object.
    obj.interact();
  }
};
