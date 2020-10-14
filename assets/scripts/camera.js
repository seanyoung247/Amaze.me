/*
 * Models a raycasting camera that constructs a "3D" scene from 2D data.
 *  (1.57079632679 is 90 degrees in radians)
 */
function Camera(pX = 0, pY = 0, dX = 0, dY = 0, fov = 1.57079632679, range = 15) {
  this.position = new Point2(pX, pY);
  this.direction = new Vector2(dX, dY);
  this.fov = fov;
  this.range = range;

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

      /*//Temporary flat shading
      ctx.fillStyle = "rgb(0,255,0)";
      ctx.fillRect(column, sY, 1, wallHeight);*/

      //Temporary texture drawing
      //Calculate which pixel column from the texture to draw
      let texCol = Math.floor(hits[i].offset * this.wallImg.width);
      ctx.drawImage(this.wallImg,                                 //Source
                    texCol, 0, 1, this.wallImg.height,            //Source coords
                    column, ((surface.height/2) - (wallHeight/2)),//Screen X,Y
                    1, wallHeight);                               //Screen width,height
    }
  }
};
