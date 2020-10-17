/**
 * Jasmine unit tests for GameObject
 */
describe("RayMap2", function() {
 beforeEach(function() {
   map = new RayMap2(easyMap, wallDefs);
   obj = new GameObject(map, objectDefs[0]);
 })

 describe("Game object creation tests", function() {
   it ("Should add itself to map object list", function() {
     spyOn(map, "addObject");
     let newObj = new GameObject(map, objectDefs[1]);
     expect(map.addObject).toHaveBeenCalledWith(newObj);
   });
   describe("Game object should have correct properties", function() {
     it ("Should have correct position", function() {
       expect(obj.position.x === 1.5 && obj.position.y === 3.5).toBe(true);
     });
     it ("Should have correct name", function() {
       expect(obj.name).toBe(objectDefs[0].name);
     });
   });
 });
});
