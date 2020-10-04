/*
 * Models a 2d map that can be raytraced.
 * Generates the map data from a template passed.
 */
function RayMap2(template) {
  this.width = template.width;
  this.height = template.height;

  this.map = new Array(this.height);

  //Iterates through each template cell and fills out map information
  for (let y = 0; y < this.height; y++) {
    this.map[y] = new Array(this.width);

    for (let x = 0; x < this.width; x++) {
      this.map[y][x] = template.map[y][x];
    }
  }
}

/*
 * Returns the tile object describing the tile at x,y
 */
RayMap2.prototype.getMapTile = function (x, y) {
  if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
    return this.map[y][x];
  } else {
    //out of bounds just returns empty space.
    return 0;
  }
};

 //More functions here as needed:
