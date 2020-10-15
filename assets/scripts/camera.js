/*
 * Models a raycasting camera that constructs a "3D" scene from 2D data.
 *  (1.57079632679 is 90 degrees in radians)
 */
function Camera(pX = 0, pY = 0, dX = 0, dY = 0, fov = 1.57079632679, range = 15) {
  this.position = new Point2(pX, pY);
  this.direction = new Vector2(dX, dY);
  this.fov = fov;
  this.range = range;

  //Depth buffer
  this.depth = new Array();

  //Temporary texture load
  this.wallImg = new Image();
  this.wallImg.src = "assets/images/hedge2.png";
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
  this.depth.length = surface.width;

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

      //Store current depth of screen column (used for sprite occlusion)
      this.depth[column] = hits[i].length;

      //Temporary texture drawing
      //Calculate which pixel column from the texture to draw
      let texCol = Math.floor(hits[i].offset * this.wallImg.width);
      ctx.drawImage(this.wallImg,                                 //Source
                    texCol, 0, 1, this.wallImg.height,            //Source coords
                    column, ((surface.height/2) - (wallHeight/2)),//Screen X,Y
                    1, wallHeight);                               //Screen width,height

      //Darkens y-facing walls for a faux lighting effect
      if (hits[i].facing != 0) {
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect( column, ((surface.height/2) - (wallHeight/2)),
                      1, wallHeight);
      }
    }
  }
};

/*
 * Iterates through object list and draws any objects marked as visible.
 */
Camera.prototype.drawObjects = function (surface, map) {
  for (let i = 0; i < map.objects.length; i++) {
    if (map.objects[i].draw === true) this.drawObject(surface, map.objects[i]);
  }
};

/*
 * Draws a single object sprite to the screen
 */
Camera.prototype.drawObject = function(surface, obj) {
  let offset = new Vector2(
    obj.position.x - this.position.x,
    obj.position.y - this.position.y
  );
  //Calculate offset between angle to object and view angle
  let spriteAngle = Math.atan2(offset.y, offset.x) - Math.atan2(this.direction.y, this.direction.x);
  let distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y) * Math.cos(spriteAngle);

  if (distance > 0.1) {
    let sAspect = (obj.sprite.width / obj.frames) / obj.sprite.height;
    let fullHeight = surface.height / distance;
    let hSize = fullHeight * obj.scale;
    let wSize = hSize * sAspect;

    let sA = Math.tan(spriteAngle) * (surface.width / 2);
    let sX = Math.floor(surface.width / 2 + sA - wSize / 2);
    let sY = Math.floor( ((surface.height - hSize) / 2) + ((fullHeight - hSize) / 2) );

    let tX = 0;

    for (let i = 0; i <= wSize; i++) {
      if (this.depth[sX + i] > distance) {
        tX = Math.floor( (i / wSize) * (obj.sprite.width / obj.frames) );
        ctx.drawImage(obj.sprite,
                      tX, 0, 1, obj.sprite.height,
                      Math.floor(sX + i), Math.floor(sY), 1, hSize);
      }
    }
  }
}
