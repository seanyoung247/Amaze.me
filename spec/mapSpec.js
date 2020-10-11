 /**
  * Jasmine unit tests for the Map object
  */
describe("RayMap2", function() {
  beforeEach(function() {
    map = new RayMap2(easyMap);
  })

  //Checks the map is created correctly from the template
  describe("creation tests", function() {
    //Correct width?
    it ("should return 10", function() {
      expect(map.width).toBe(10);
    });
    //Correct Height?
    it ("should return 10", function() {
      expect(map.height).toBe(10);
    });
    //Open location
    it ("should return 0", function() {
      expect(map.getMapTile(1,1)).toBe(0);
    });
    //Wall location
    it ("should return 1", function() {
      expect(map.getMapTile(4,4)).toBe(1);
    });
    //Gate location
    it ("should return 2", function() {
      expect(map.getMapTile(0,1)).toBe(2);
    });
  });
  describe("Out of bounds tests", function() {
    //Out of bounds request (should return open)
    it ("should return 0", function() {
      expect(map.getMapTile(-1,-1)).toBe(0);
    });
    //Out of bounds request (should return open)
    it ("should return 0", function() {
      expect(map.getMapTile(11,11)).toBe(0);
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
      expect(map.objectList.length).toBe(4);
    });
    //Checks that each object spawn point has the correct positions
    describe("Object spawn point 1", function() {
      it ("should have x position 1.5", function() {
        expect(map.objectList[0].position.x).toBe(1.5);
      });
      it ("should have y position 3.5", function() {
        expect(map.objectList[0].position.y).toBe(3.5);
      });
    });
    describe("Object spawn point 2", function() {
      it ("should have x position 1.5", function() {
        expect(map.objectList[1].position.x).toBe(4.5);
      });
      it ("should have y position 3.5", function() {
        expect(map.objectList[1].position.y).toBe(3.5);
      });
    });
    describe("Object spawn point 3", function() {
      it ("should have x position 1.5", function() {
        expect(map.objectList[2].position.x).toBe(4.5);
      });
      it ("should have y position 3.5", function() {
        expect(map.objectList[2].position.y).toBe(5.5);
      });
    });
    describe("Object spawn point 4", function() {
      it ("should have x position 1.5", function() {
        expect(map.objectList[3].position.x).toBe(1.5);
      });
      it ("should have y position 3.5", function() {
        expect(map.objectList[3].position.y).toBe(9.5);
      });
    });
  });
});
