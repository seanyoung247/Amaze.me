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
  let wall = null;
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

      //Get required texture from map
      wall = map.walls[hits[i].type - 1];
      //Calculate which pixel column from the texture to draw
      let texCol = Math.floor(hits[i].offset * wall.texture.width);
      ctx.drawImage(wall.texture,                                 //Source
                    texCol, 0, 1, wall.texture.height,            //Source coords
                    column, ((surface.height/2) - (wallHeight/2)),//Screen X,Y
                    1, wallHeight);                               //Screen width,height

      //Darkens y-facing walls for a faux lighting effect
      if ((hits[i].facing != 0) && (!wall.transparent)) {
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
    if ((map.objects[i].draw === true) ||
        (Math.floor(map.objects[i].position.x) === Math.floor(this.position.x) &&
          Math.floor(map.objects[i].position.y) === Math.floor(this.position.y)))
      this.drawObject(surface, map.objects[i]);
  }
};

/*
 * Draws a single object sprite to the screen
 *
 * -Based on sprite casting code from:
 *  https://lodev.org/cgtutor/raycasting3.html
 */
Camera.prototype.drawObject = function (surface, obj) {
  let ctx = surface.getContext("2d");
  //Position relative to the camera
  let relative = new Point2(
    obj.position.x - this.position.x,
    obj.position.y - this.position.y
  );
  //Projection plane (a vector at 90degrees to the camera view vector).
  //The sprite is aligned to face this plane.
  let plane = new Vector2(
    -this.direction.y,
    this.direction.x
  );
  //Perspective/FOV correction
  plane.setMagnitude(this.fov/2);
  //Transform world coordinates to screen coordinates
  let invDet = 1.0 / (plane.x * this.direction.y - this.direction.x * plane.y);
  let transform = new Point2(
    invDet * (this.direction.y * relative.x - this.direction.x * relative.y),
    invDet * (-plane.y * relative.x + plane.x * relative.y) //Screen depth
  );

  //Sprite height
  let fullHeight = surface.height / transform.y;
  let spriteHeight = Math.abs(fullHeight * obj.scale);

  //Sprite width
  let spriteAspect = (obj.sprite.width / obj.frames) / obj.sprite.height;
  let spriteWidth = spriteHeight * spriteAspect;

  //Screen position
  let screenX = Math.floor( (surface.width / 2) * (1 + transform.x / transform.y) - spriteWidth / 2);
  let screenY = Math.floor( ((surface.height - spriteHeight) / 2) + ((fullHeight - spriteHeight) / 2) );

  let tX = 0;
  //Iterate through each column of sprite pixels
  for (let i = 0; i <= spriteWidth; i++) {
    //Is the current column closer to the camera than existing pixels?
    if (this.depth[screenX + i] > transform.y) {
      //Calculate texture X coordinate
      tX = Math.floor( ((i / spriteWidth) * obj.frameWidth()) + obj.frameX());
      //Draw current pixel column
      ctx.drawImage(obj.sprite,
                    tX, 0, 1, obj.sprite.height,
                    screenX + i, screenY, 1, spriteHeight);
    }
  }
  obj.draw = false;
};
