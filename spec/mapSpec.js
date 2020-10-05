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
});
