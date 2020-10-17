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
  //The current precise position of the ray head during traversal
  let mapPos = new Point2(
     Math.floor(this.origin.x),
     Math.floor(this.origin.y)
  );
  //Returns the list of collisions this ray encountered while traversing the map
  let hits = new Array();

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
        /* Calculates distance from origin to intersection

           Optimised distance calculation based on code from:
           https://lodev.org/cgtutor/raycasting.html */
        let len = (mapPos.x - this.origin.x + (1 - rayStep.x) / 2) / this.vector.x;
        //Calculate the horizontal position on the tile where the ray intersection occured
        let offset = (mapPos.y + Math.fraction(this.origin.y)) + len * this.vector.y;
        offset -= Math.floor(offset);

        /*Add the hit to the front of the hit array. This way the returned array
        will be sorted in order of furthest to closest so we can just draw each
        hit in turn and closer hits will appear in front of further ones.*/
        hits.unshift(new RayHit(
          map.getMapTile( mapPos.x, mapPos.y),
                          offset, 0, len ));

        /*If the encountered tile is "transparent" the ray can continue
        Otherwise the ray is stopped and we can return.*/
        if (!map.getWallType(mapPos.x, mapPos.y).transparent) return hits;
      }
    //y direction is closest to next step
    } else {
      //increase y direction stepcount and update current map position
      stepDist.y += rayDelta.y;
      mapPos.y += rayStep.y;
      //Has a collision occured?
      if (map.getMapTile(mapPos.x, mapPos.y) > 0) {
        /* Calculates distance from origin to intersection

           Optimised distance calculation based on code from:
           https://lodev.org/cgtutor/raycasting.html */
        let len = (mapPos.y - this.origin.y + (1 - rayStep.y) / 2) / this.vector.y;
        //Calculate the horizontal position on the tile where the ray intersection occured
        let offset = (mapPos.x + Math.fraction(this.origin.x)) + len * this.vector.x;
        offset -= Math.floor(offset);

        hits.unshift(new RayHit(
          map.getMapTile( mapPos.x, mapPos.y),
                          offset, 1, len ));

        if (!map.getWallType(mapPos.x, mapPos.y).transparent) return hits;
      }
    }
    //Have we encountered an object?
    let obj = map.getObjects(mapPos.x, mapPos.y);
    if (obj != null) obj.draw = true;
  }
  //Ray has reached it's maximum range without being stopped.
  return hits;
};
