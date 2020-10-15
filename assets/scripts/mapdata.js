/*
 * Defines the 2D maps for use in the raycaster
 */
//Easy difficulty + testing
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
          [1,1,1,1,1,1,1,1,1,1] ],  //The map cell types
  width: 10,                        //Map cell width
  height: 10,                       //Map cell height
  pSpawn: [1.5,1.5,1,0],            //Player spawn point (pos-x,pos-y,vec-x,vec-y)
  objects: 4,                       //Number of objects spawn points in map
  oSpawn: [ [1.5,3.5],
            [4.5,3.5],
            [4.5,5.5],
            [1.5,9.5], ]            //Object spawn points
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
  pSpawn: [10.5,1.5,0,1],
  objects: 6,
  oSpawn: [ [7.5,1.5],
            [9.5,1.5],
            [3.5,3.5],
            [5.5,13.5],
            [7.5,13.5],
            [12.5,13.5] ]
};

//Base path for images
var imagePath = "assets/images/";

/*
 * Defines the walls types that maps can use
 */
var wallDefs = [
   //Hedge
   {name: "hedge", texture: "hedge2.png", transparent: false},
   //Brick wall    - Not Yet Implimented
   //Stone wall    - Not Yet Implimented
   //Fence         - Not Yet Implimented
   //Gate
   {name: "gate", texture: "gate.png", transparent: true}
];

/*
 * Defines the sprites that can be placed in maps
 */
var spriteDefs = [
    //Lamp
    {name: "Lamp", icon:"lampico.png", texture: "lamp.png", frames: 2, scale: 0.66, radius:0.2, blocking: true}
    //Bottle
    //Vase
    //Ball
    //Can
    //Cup
];
