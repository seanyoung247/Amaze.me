/*
 * Defines an objects position and facing in the map
 */
function MapLocation2(pX = 0, pY = 0, dX = 0, dY = 0) {
  this.position = new Point2(pX,pY);
  this.vector = new Vector2(dX, dY);
}

/*
 * Models a 2d map that can be raytraced.
 * Generates the map data from a template passed.
 */
function RayMap2(template) {
  //Map geometry
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

  //Map player spawn point
  this.playerSpawn = new MapLocation2(template.pSpawn[0],   //Position X
                                      template.pSpawn[1],   //Position Y
                                      template.pSpawn[2],   //Vector X
                                      template.pSpawn[3]);  //Vector Y
  //Map object spawn points
  this.objectSpawns = new Array(template.objects);
  for (let i = 0; i < template.objects; i++) {
      this.objectSpawns[i] = new MapLocation2(template.oSpawn[i][0],
                                              template.oSpawn[i][1]);
  }
  //List of objects on the map
  this.objects = new Array();
}

/*
 * Returns the tile type at x,y
 */
RayMap2.prototype.getMapTile = function (x, y) {
  if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
    return this.map[y][x];
  } else {
    //out of bounds just returns empty space.
    return 0;
  }
};

/*
 * Returns whether a tile at x,y can be traversed
 */
RayMap2.prototype.getTilePassable = function (x, y) {
  if (this.getMapTile(x,y) === 0) {
    return true;
  } else {
    return false;
  }
};

/*
 * Adds an object to the map and returns it's location.
 * If no spawn points are available it returns null.
 */
RayMap2.prototype.addObject = function (obj) {
  //Is there an available spawn point for this object?
  if (this.objects.length < this.objectSpawns.length) {
    this.objects.push(obj);
    return this.objectSpawns[this.objects.length - 1];
  }
  return null;
};

 //More functions here as needed:
