/*
 * Jasmine unit tests for the Ray2 object
 */
describe("Ray2", function() {
  beforeEach(function() {
    map = new RayMap2(easyMap, wallDefs);
     //Creates a ray with an origin at 1,1, a 45 degree vector and a 15 cell range
    ray = new Ray2(1.5,1.5,0.70710678118,0.70710678118,15);
  })

  describe("ray grid traversal distance tests", function() {
    it("should return distance to cell 2,2", function() {
      expect(ray.cast(map)[0].length).toBeCloseTo(0.7,1);
    });
    it("should return distance to cell 1,7", function() {
      ray.vector.x = 1;
      ray.vector.y = 0;
      expect(ray.cast(map)[0].length).toBeCloseTo(5.5,1);
    });
  });
  describe("ray grid traversal cell tests", function() {
    it("should return type of cell at 2,2", function() {
      expect(ray.cast(map)[0].type).toBe(2);
    });
    it("should return type of cell at 1,1", function() {
      ray.vector.x = -1;
      ray.vector.y = 0;
      expect(ray.cast(map)[0].type).toBe(1);
    });
  })
});
