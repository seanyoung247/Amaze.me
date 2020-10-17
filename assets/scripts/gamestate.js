/*
 * Game states are:
 *    PAUSED - Game logic and interaction suspended
 *    TRAINING - Player can move around the map to learn it's layout
 *    PLAYING - Player is given objects to find in the map
 */
const gamestates = {
  PAUSED: "paused",
  TRAINING: "training",
  PLAYING:  "playing"
}
const gamedifficulty = {
  EASY: "easy",       //Minimap and objects visible during play.
  NORMAL: "normal",   //Minimap visible during play.
  HARD: "hard"        //Minimap and objects hidden during play.
}

/*
 * Controls game state and impliments game logic
 */
function GameState(gameCanvas, mapTemplate) {
  //Get the canvas for the main game screen
  this.gameCanvas = gameCanvas;
  this.gameContext = gameCanvas.getContext("2d");

  this.map = null;
  this.player = null;
  this.lastFrameTime = 0;

  //Default to paused state.
  this.state = gamestates.PAUSED;
  //Default to easy difficulty.
  this.difficulty = gamedifficulty.EASY;

  this.inputMap = {
    turnLeft: {down: false, up: false},
    turnRight: {down: false, up: false},
    left: {down: false, up: false},
    right: {down: false, up: false},
    up: {down: false, up: false},
    down: {down: false, up: false},
    interact: {down: false, up: false}
  }

  this.setupGame(mapTemplate);
}

/*
 * Setsup initial game state and objects
 */
GameState.prototype.setupGame = function (mapTemplate) {
  let aspectRatio = (this.gameCanvas.width / this.gameCanvas.height);
  //Create game objects
  this.map = new RayMap2(mapTemplate, wallDefs);
  this.player = new Player( this,
                            this.map,
                            3.0,    //Movement speed (world units per-second)
                            3.0,    //Turning speed (radians per-second)
                            0.2,    //Player object radius (world units)
                            1.0,    //Interaction distance (world units)
                            aspectRatio); //FOV in radians

    for (let i = 0; i < objectDefs.length; i++) {
      //GameObjects self register during creation
      new GameObject(this.map, objectDefs[i]);
    }
}

/*
 * Update step of the game cycle. Updates the game and game object state
 */
GameState.prototype.update = function (frameTime) {
  //If not paused, react to user input
  if (this.state != gamestates.PAUSED) {

    if (this.inputMap.turnLeft.down) {
      this.player.turnLeft(frameTime);
    }
    if (this.inputMap.turnRight.down) {
      this.player.turnRight(frameTime);
    }

    //Player movement
    if (this.inputMap.up.down) {
      this.player.moveForward(frameTime);
    }
    if (this.inputMap.down.down) {
      this.player.moveBack(frameTime);
    }
    if (this.inputMap.left.down) {
      this.player.moveLeft(frameTime);
    }
    if (this.inputMap.right.down) {
      this.player.moveRight(frameTime);
    }

    //Player can only interact with objects while playing
    if (this.state === gamestates.PLAYING) {
      //Player interaction
      if (this.inputMap.interact.up) {
        this.player.interact(frameTime);
        this.inputMap.interact.up = false;
      }
    }
  }
}
