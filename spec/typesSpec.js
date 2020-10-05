//Point2 tests
describe("Point2", function() {
  beforeEach(function() {
    p2 = new Point2(1,2);
  })

  //describes the tests for creating a Point2 objects
  describe("Creation tests", function() {
    it("should return x=1", function() {
      expect(p2.x).toBe(1);
    });
    it("should return y=2", function() {
      expect(p2.y).toBe(2);
    });
  });
}); //Point2

//Vector2 tests
describe("Vector2", function() {
  beforeEach(function() {
     //Creates a new vector with an angle of 45degrees and magnitude of 1:
    v1 = new Vector2(0.70710678118,0.70710678118);
     //Creates a new vector with an angle of 45degrees and magnitude of 2:
    v2 = new Vector2(1.41421356237,1.41421356237);
  })

  describe("get Magnitude tests", function() {
    it("should return 1", function() {
      expect(v1.getMagnitude()).toBeCloseTo(1.0, 2);
    });
    it("should return 2", function() {
      expect(v2.getMagnitude()).toBeCloseTo(2.0, 2);
    });
  });
  describe("set Magnitude tests", function() {
    it("should return 3", function() {
      v1.setMagnitude(3);
      expect(v1.getMagnitude()).toBeCloseTo(3.0, 2);
    });
  });
  describe("normalisation tests", function() {
    it("should return 1", function() {
      v1.normalize();
      expect(v1.getMagnitude()).toBeCloseTo(1.0, 2);
    });
    it("should return 1", function() {
      v2.normalize();
      expect(v2.getMagnitude()).toBeCloseTo(1.0, 2);
    });
  });
  describe("to radian tests", function() {
    it("should return 0.785398 radians", function(){
      expect(v1.toRadian()).toBeCloseTo(0.785398, 2);
    });
    it("should return 0.785398 radians", function(){
      expect(v2.toRadian()).toBeCloseTo(0.785398, 2);
    });
  });
  describe("from radian tests", function() {
    it("should return 1.5708 radians", function() {
      v1.fromRadian(1.5708);
      expect(v1.toRadian()).toBeCloseTo(1.5708, 2);
    });
  });
  describe("rotation tests", function() {
    it("should return 1.5708 radians", function() {
      //Adds 45degrees to vector
      v1.rotateByRadians(0.785398);
      expect(v1.toRadian()).toBeCloseTo(1.5708, 2);
    });
    it("should return 1.5708 radians", function() {
      v1.rotateByVector(v2);
      expect(v1.toRadian()).toBeCloseTo(1.5708, 2);
    });
    it("should return 1.5708 radians", function() {
      v1.rotate(0.70710678118,0.70710678118);
      expect(v1.toRadian()).toBeCloseTo(1.5708, 2);
    });
  });
}); //Vector2

//BoundingBox tests
describe("BoundingBox", function() {
  beforeEach(function() {
     //Creates a new vector with an angle of 45degrees and magnitude of 1:
    box = new BoundingBox(5, 5, 10, 10);
  })

  describe("collision detection tests", function() {
    it("should return true", function() {
      //This point should be within bounds
      p2 = new Point2(11,11);
      expect(box.pointInBounds(p2)).toBe(true);
    });
    it("should return true", function() {
      expect(box.inBounds(5,5)).toBe(true);
    });
    it("should return true", function() {
      expect(box.inBounds(10,10)).toBe(true);
    });
    it("should return true", function() {
      expect(box.inBounds(15,15)).toBe(true);
    });
    it("should return true", function() {
      expect(box.inBounds(5.1,5.1)).toBe(true);
    });
    it("should return false", function() {
      expect(box.inBounds(1,4)).toBe(false);
    });
    it("should return false", function() {
      expect(box.inBounds(4.9, 4.9)).toBe(false);
    });
    it("should return false", function() {
      expect(box.inBounds(15.1, 15.1)).toBe(false);
    });
  });
}); //BoundingBox
