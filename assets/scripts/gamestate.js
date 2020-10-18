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
  this.thisFrameTime = 0;

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

/*
 * Drawing functions
 */
GameState.prototype.frameStart = function (time) {
  this.thisFrameTime = time - this.lastFrameTime;
  return this.thisFrameTime;
};
GameState.prototype.frameEnd = function (time) {
  this.lastFrameTime = time;
};

GameState.prototype.drawScene = function () {
  //Prepare rendering state
  this.player.setFOV(this.gameCanvas.width / this.gameCanvas.height);
  //Render player view
  this.player.drawScene(this.gameCanvas);
};

GameState.prototype.drawOverlay = function () {
  this.drawMiniMap(this.gameCanvas.width - 175, 25, 0.35);
};

GameState.prototype.drawMiniMap = function(x, y, alpha) {
  //Only draw the map if we're not playing in hard difficulty
  if ( !(this.state === gamestates.PLAYING && this.difficulty === gamedifficulty.HARD) ) {
    let ctx = this.gameContext;
    let map = this.map;
    let player = this.player;

    //Draw map geometry
    for (let tY = 0; tY < map.height; tY++) {
      for (let tX = 0; tX < map.width; tX++) {
        if (map.map[tY][tX] === 0) ctx.fillStyle = "rgba(0,0,0,"+alpha+")";
        else ctx.fillStyle = "rgba(0,255,0,"+alpha+")";

        ctx.fillRect((tX*10) + x, (tY*10) + y, 10, 10);
      }
    }

    //Only Draw object positions when playing on easy
    if ((this.state != gamestates.PLAYING) || (this.difficulty === gamedifficulty.EASY)) {
      ctx.fillStyle = "blue";
      for (let i = 0; i < map.objects.length; i++) {
        let oX = Math.floor(map.objects[i].position.x * 10) + x;
        let oY = Math.floor(map.objects[i].position.y * 10) + y;
        ctx.beginPath();
        ctx.arc(oX, oY, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    //Draw player position
    ctx.beginPath();
    let pX = Math.floor(player.position.x * 10) + x;
    let pY = Math.floor(player.position.y * 10) + y;
    let vX = Math.floor(pX + (player.direction.x * 10));
    let vY = Math.floor(pY + (player.direction.y * 10));
    ctx.fillStyle = "red";
    ctx.arc(pX, pY, 3, 0, 2 * Math.PI);
    ctx.fill();
    //Draw player Vector
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(pX, pY);
    ctx.lineTo(vX, vY);
    ctx.stroke();
  }
};
