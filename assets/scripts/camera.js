/*
 * Models a single ray collision
 */
function RayHit(type, offset, facing, length) {
  this.type = type;
  this.offset = offset;
  this.facing = facing;
  this.length = length;
}

/*
 * Models a 2d ray that can measure distances between points
 * in a 2d data space.
 */
function Ray2(oX = 0, oY = 0, vX = 0, vY = 0, range = 15) {
  this.origin = new Point2(oX, oY);
  this.vector = new Vector2(vX, vY);
  this.range = range;
}

/*
 * Traces the path of this ray through the map, logging any collisions as
 * they occur, and then returned as an array of RayHit objects (not yet implimented).
 *
 * Ray cast algorithm is based on the DDA grid traversal algorithm.
 */
Ray2.prototype.cast = function (map) {
  let rayStep = new Vector2(0,0);
  let rayDelta = new Vector2(
    Math.abs(1 / this.vector.x),
    Math.abs(1 / this.vector.y)
  );
  let stepDist = new Vector2(0,0);
  let mapPos = new Point2(
     Math.floor(this.origin.x),
     Math.floor(this.origin.y)
  );

  /* We want to move in whole grid numbers, so we need to convert float vector
      values into single tile steps */
  if (this.vector.x < 0) {     //Moving "right" in x.
    rayStep.x = -1;
    stepDist.x = (this.origin.x - mapPos.x) * rayDelta.x;
  } else {                    //Moving "left" in x.
    rayStep.x = 1;
    stepDist.x = (mapPos.x + 1.0 - this.origin.x) * rayDelta.x;
  }
  if (this.vector.y < 0) {     //Moving "up" in y.
    rayStep.y = -1;
    stepDist.y = (this.origin.y - mapPos.y) * rayDelta.y;
  } else {                    //Moving "down" in y.
    rayStep.y = 1;
    stepDist.y = (mapPos.y + 1.0 - this.origin.y) * rayDelta.y;
  }

  for (let i = 0; i < this.range; i++) {
    //x direction is closest to next step
    if (stepDist.x < stepDist.y) {
      //increase x direction stepcount and update current map position
      stepDist.x += rayDelta.x;
      mapPos.x += rayStep.x;

      //Has a collision occured?
      if (map.getMapTile(mapPos.x, mapPos.y) > 0) {
        /* Optimised distance calculation based on code from:
           https://lodev.org/cgtutor/raycasting.html */
        let len = (mapPos.x - this.origin.x + (1 - rayStep.x) / 2) / this.vector.x;

        return new Array(new RayHit(
          map.getMapTile(mapPos.x, mapPos.y),
          0, 0, len ));
      }
    //y direction is closest to next step
    } else {
      //increase y direction stepcount and update current map position
      stepDist.y += rayDelta.y;
      mapPos.y += rayStep.y;
      //Has a collision occured?
      if (map.getMapTile(mapPos.x, mapPos.y) > 0) {
        /* Optimised distance calculation based on code from:
           https://lodev.org/cgtutor/raycasting.html */
        let len = (mapPos.y - this.origin.y + (1 - rayStep.y) / 2) / this.vector.y;

        return new Array(new RayHit(
          map.getMapTile(mapPos.x, mapPos.y),
          0, 1, len ));
      }
    }
  }
  return new Array();
};

/*
 * Models a raycasting camera that constructs a "3D" scene from 2D data.
 *  (1.57079632679 is 90 degrees in radians)
 */
function Camera(pX = 0, pY = 0, dX = 0, dY = 0, fov = 1.57079632679, range = 15) {
  this.position = new Point2(pX, pY);
  this.direction = new Vector2(dX, dY);
  this.fov = fov;
  this.range = range;
}
/*
 * Draws the scene one vertical column at a time.
 */
Camera.prototype.drawScene = function (surface, map) {
  let columns = surface.width;
  let ctx = surface.getContext("2d");
  let halfFOV = this.fov / 2;
  let offset = 0;
  let wallHeight = 0;
  let screenY = 0;
  let ray = new Ray2(this.position.x, this.position.y, 0, 0, this.range);

  //Casts a ray into the map for each column of pixels
  for (let column = 0; column < columns; column++) {
    //Calculate the ray Vector
    offset = ((column * 2 / (columns - 1)) - 1) * halfFOV;
    ray.vector.x = this.direction.x - offset * this.direction.y;
    ray.vector.y = this.direction.y - offset * -this.direction.x;
    //Cast the ray into the map and log any collisions
    let hits = ray.cast(map);

    //For every ray hit, draw the objects
    for (let i = 0; i < hits.length; i++) {
      /* Calculates the wall height and placement based on distance between the
         collision and the screen plane in the game world. */
      wallHeight = surface.height / hits[i].length;
      sY = (surface.height - wallHeight) / 2;

      //Temporary flat shading
      ctx.fillStyle = "rgb(0,255,0)";
      ctx.fillRect(column, sY, 1, wallHeight);
    }
  }
};
