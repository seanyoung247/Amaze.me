 /**
  * Jasmine unit tests for the Map object
  */
describe("RayMap2", function() {
  beforeEach(function() {
    map = new RayMap2(easyMap, wallDefs);
  })

  //Checks the map is created correctly from the template
  describe("creation tests", function() {
    it ("Does the map have the correct tile width?", function() {
      expect(map.width).toBe(10);
    });
    it ("Does the map have the correct tile height?", function() {
      expect(map.height).toBe(10);
    });
    describe("Does the map return the correct tile types?", function() {
      it ("should return empty", function() {
        expect(map.getMapTile(1,1)).toBe(0);
      });
      it ("should return type 2", function() {
        expect(map.getMapTile(4,4)).toBe(2);
      });
      it ("should return type 1", function() {
        expect(map.getMapTile(0,1)).toBe(1);
      });
      it ("should return null", function() {
        expect(map.getWallType(1,1)).toBe(null);
      });
      it ("should return hedge type", function() {
        expect(map.getWallType(4,4).name).toBe("hedge");
      });
      it ("should return gate type", function() {
        expect(map.getWallType(0,1).name).toBe("gate");
      });
    });
  });
  describe("Map boundary tests", function() {
    it ("Should return true (in bounds)", function() {
      expect(map.inBounds(5,5)).toBe(true);
    });
    it ("should return false (out of bounds)", function() {
      expect(map.inBounds(11,11)).toBe(false);
    });
    it ("Should return empty tile without error", function() {
      expect(map.getMapTile(-1,-1)).toBe(0);
    });
  });
  describe("Tile passability test", function() {
    it ("Tile should be passable", function() {
      expect(map.getTilePassable(0,0)).toBe(false);
    });
    it ("Tile should be impassable", function() {
      expect(map.getTilePassable(1,1)).toBe(true);
    });
  });
  describe("Player Spawn point tests", function() {
    //Position Checks
    describe("player spawn position", function() {
      it ("player spawn position should be correct", function() {
        expect(map.playerSpawn.position.x===1.5 &&
                map.playerSpawn.position.y === 1.5).toBe(true);
      });
    });
    //Vector checks
    describe("player spawn vector", function() {
      it ("player x vector should be 1", function() {
        expect(map.playerSpawn.vector.x === 1 &&
                map.playerSpawn.vector.y === 0).toBe(true);
      });
    });
  });
  describe("Object spawn point tests", function() {
    //Correct number of objects spawn points defined?
    it ("should have 4 object spawns", function() {
      expect(map.objectSpawns.length).toBe(4);
    });
    //Checks that each object spawn point has the correct positions
    describe("Object spawn point 1", function() {
      it ("should have correct position", function() {
        expect(map.objectSpawns[0].position.x === 1.5 &&
                map.objectSpawns[0].position.y === 3.5).toBe(true);
      });
    });
    describe("Object spawn point 2", function() {
      it ("should have correct position", function() {
        expect(map.objectSpawns[1].position.x === 4.5 &&
                map.objectSpawns[1].position.y === 3.5).toBe(true);
      });
    });
    describe("Object spawn point 3", function() {
      it ("should have correct position", function() {
        expect(map.objectSpawns[2].position.x === 4.5 &&
                map.objectSpawns[2].position.y === 5.5).toBe(true);
      });
    });
    describe("Object spawn point 4", function() {
      it ("should have correct position", function() {
        expect(map.objectSpawns[3].position.x === 1.5 &&
                map.objectSpawns[3].position.y === 9.5).toBe(true);
      });
    });
  });
  describe("Object list tests", function() {
    it ("should return no objects", function() {
      expect(map.getObjects(9.5,1.5)).toBe(null);
    });
    it ("should return correct object", function() {
      new GameObject(map, objectDefs[0]);
      expect(map.getObjects(1,3).name).toBe("Lamp");
    });
    it ("should return no objects in range", function(){
      new GameObject(map, objectDefs[0]);
      expect(map.getObjectsInRange(new Point2(0.5,2.5), 1.0)).toBe(null);
    });
    it ("should return correct object in range", function(){
      new GameObject(map, objectDefs[0]);
      expect(map.getObjectsInRange(new Point2(0.5,2.5), 1.5).name).toBe("Lamp");
    });
  });
});
