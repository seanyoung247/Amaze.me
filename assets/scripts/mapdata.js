/*
 * Defines the 2D maps for use in the raycaster
 */
//Easy difficulty
var easyMap = {
  map: [  [1,1,1,1,1,1,1,1,1,1],
            [2,0,0,0,0,0,0,1,0,1],
            [1,1,1,0,1,1,0,1,0,1],
            [1,0,1,0,0,1,0,1,0,1],
            [1,0,1,0,1,1,0,1,0,2],
            [1,0,0,0,0,1,0,0,0,1],
            [1,0,1,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1] ],
  width: 10,
  height: 10,
  objects: 4
};
//Normal difficulty
var normalMap = {
  map: [  [1,1,1,1,1,1,1,1,1,1,2,1,1,1,1],
          [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1],
          [1,0,1,1,1,0,1,0,1,1,0,1,0,1,1],
          [1,0,1,0,1,0,1,0,0,0,0,1,0,1,1],
          [1,0,0,0,1,0,1,1,1,1,0,1,0,1,1],
          [1,1,1,1,1,0,0,0,0,0,0,1,0,1,1],
          [1,0,0,0,0,0,1,1,0,1,1,1,0,1,1],
          [1,0,1,0,1,1,1,0,0,0,0,0,0,1,1],
          [1,0,1,0,0,0,0,0,0,1,1,1,1,1,1],
          [1,0,1,0,1,1,1,1,0,0,0,0,0,0,1],
          [1,0,1,0,0,0,0,0,0,1,1,1,1,0,1],
          [1,0,1,1,1,1,1,1,0,0,0,0,1,0,1],
          [1,0,0,0,0,0,1,0,0,1,1,0,1,0,1],
          [1,1,1,1,1,1,1,1,1,1,0,0,1,0,1],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,2,1] ],
  width: 15,
  height: 15,
  objects: 6
};
