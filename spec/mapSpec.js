 /**
  * Jasmine unit tests for the Map object
  */
describe("RayMap2", function() {
  beforeEach(function() {
    map = new RayMap2(easyMap);
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
      it ("should return hedge type", function() {
        expect(map.getMapTile(4,4)).toBe(2);
      });
      it ("should return gate type", function() {
        expect(map.getMapTile(0,1)).toBe(1);
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
    it ("Should return passable", function() {
      expect(map.getTilePassable(0,0)).toBe(false);
    });
    it ("should return blocked", function() {
      expect(map.getTilePassable(1,1)).toBe(true);
    });
  });
  describe("Player Spawn point tests", function() {
    //Position Checks
    describe("player spawn position", function() {
      it ("player x position should be 1.5", function() {
        expect(map.playerSpawn.position.x).toBe(1.5);
      });
      it ("player y positon should be 1.5", function() {
        expect(map.playerSpawn.position.y).toBe(1.5);
      });
    });
    //Vector checks
    describe("player spawn vector", function() {
      it ("player x vector should be 1", function() {
        expect(map.playerSpawn.vector.x).toBe(1);
      });
      it ("player y vector should be 0", function() {
        expect(map.playerSpawn.vector.y).toBe(0);
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
      it ("should have x position 1.5", function() {
        expect(map.objectSpawns[0].position.x).toBe(1.5);
      });
      it ("should have y position 3.5", function() {
        expect(map.objectSpawns[0].position.y).toBe(3.5);
      });
    });
    describe("Object spawn point 2", function() {
      it ("should have x position 1.5", function() {
        expect(map.objectSpawns[1].position.x).toBe(4.5);
      });
      it ("should have y position 3.5", function() {
        expect(map.objectSpawns[1].position.y).toBe(3.5);
      });
    });
    describe("Object spawn point 3", function() {
      it ("should have x position 1.5", function() {
        expect(map.objectSpawns[2].position.x).toBe(4.5);
      });
      it ("should have y position 3.5", function() {
        expect(map.objectSpawns[2].position.y).toBe(5.5);
      });
    });
    describe("Object spawn point 4", function() {
      it ("should have x position 1.5", function() {
        expect(map.objectSpawns[3].position.x).toBe(1.5);
      });
      it ("should have y position 3.5", function() {
        expect(map.objectSpawns[3].position.y).toBe(9.5);
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
