/*
 * Game states are:
 *    PAUSED - Game logic and interaction suspended
 *    TRAINING - Player can move around the map to learn it's layout
 *    PLAYING - Player is given objects to find in the map
 */
const gamestates = {
  PAUSED: "paused",
  TRAINING: "training",
  PLAYING: "playing",
  WON: "won"
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

  this.playStartTime = 0;
  this.winTime = 0;

  this.goalList = null;
  this.currentGoal = 0;

  //Default to paused state.
  this.state = gamestates.PAUSED;
  this.lastState = gamestates.TRAINING;
  //Default to easy difficulty.
  this.difficulty = gamedifficulty.EASY;
  //Control input map
  this.inputMap = {
    //Look controls
    turnLeft: {down: false, up: false},
    turnRight: {down: false, up: false},
    //Move controls
    left: {down: false, up: false},
    right: {down: false, up: false},
    up: {down: false, up: false},
    down: {down: false, up: false},
    //Object interaction controls
    interact: {down: false, up: false},
    //Game Controls
    pause: {down: false, up: false}
  };
  //Maps whether various game messages should be shown
  this.messageMap = {
    noInteract: { show: false, start: 0, elapsed: 0, time: 2000,
                  message: "This is not the object you are looking for!" }
  };

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

    this.setupGoals();
}

/*
 * Clears all objects and resets the game state
 */
GameState.prototype.reset = function() {

};

/*
 * Populates the goals array with available objects in random order
 */
GameState.prototype.setupGoals = function() {
  //Copy objects list from map
  this.goalList = this.map.objects.slice();
  //Randomly reorder list
  this.goalList = shuffle(this.goalList);

  //DEBUG:
  console.log(this.goalList.length);
  console.log(this.map.objects.length);
  for (let i = 0; i < this.goalList.length; i++) {
    console.log(this.goalList[i].name);
  }
};

/*
 * Prefered method of setting the game into the playing state
 */
GameState.prototype.playStart = function() {
  this.playStartTime = performance.now();
  this.state = gamestates.PLAYING;
};

/*
 * Called when victory condition detected
 */
GameState.prototype.playEnd = function() {
  this.winTime = performance.now() - this.playStartTime;
  this.state = gamestates.WON;
  console.log(this.winTime);
};

/*
 * Called when the player requests an object interaction.
 */
GameState.prototype.goalCheck = function (obj) {
  //Are we currently in the playing state
  if (this.state === gamestates.PLAYING) {
    //Is this the current goal object?
    if (obj === this.goalList[this.currentGoal]) {
      //This is the current goal object. Move to next goal.
      this.currentGoal++;
      //Is this the final goal object?
      if (this.currentGoal >= this.goalList.length) this.playEnd();
      //Valid object interaction
      return true;
    }
  }
  return false;
}

/*
 * Update step of the game cycle. Updates the game and game object state
 */
GameState.prototype.update = function (frameTime) {
  //If not paused or complete, react to user input and run game state
  if (this.state != gamestates.PAUSED && this.state != gamestates.WON) {
    //User input handling
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

    if (this.inputMap.interact.up) {
      this.player.interact(frameTime);
      this.inputMap.interact.up = false;
    }
  }

  //Keyboard pause control
  if (this.inputMap.pause.up) {
    this.togglePause();
    this.inputMap.pause.up = false;
  }
};

GameState.prototype.togglePause = function() {
  if (this.state === gamestates.PAUSED) {
    this.state = this.lastState;
  } else {
    this.lastState = this.state;
    this.state = gamestates.PAUSED;
  }
};

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

GameState.prototype.drawScene = function (time) {
  //Prepare rendering state
  this.player.setFOV(this.gameCanvas.width / this.gameCanvas.height);
  //Render player view
  this.player.drawScene(this.gameCanvas);
};

GameState.prototype.drawOverlay = function (time) {
  let ctx = this.gameContext;
  let message = "";
  let txtWidth = 0;

  this.drawMiniMap(this.gameCanvas.width - 175, 25, 0.35);

  //State specific messages
  switch (this.state) {
    case gamestates.PAUSED:
      ctx.font = "50px Permanent Marker";

      message = "PAUSED!";
      txtWidth = ctx.measureText(message).width;

      ctx.fillText(message, (this.gameCanvas.width / 2) - (txtWidth / 2), (this.gameCanvas.height / 2));
      break;
    case gamestates.TRAINING:
      ctx.font = "25px Permanent Marker";
      ctx.fillText("Learn the maze", 25, 25);
      break;
    case gamestates.PLAYING:
      break;
  }

  //Messaging
  if (this.messageMap.noInteract.show) {
    let t = this.messageMap.noInteract.start + this.messageMap.noInteract.time;
    this.messageMap.noInteract.elapsed += time;

    if (t > this.messageMap.noInteract.elapsed) {
      //Draw text
      ctx.font = "25px Permanent Marker";
      txtWidth = ctx.measureText(this.messageMap.noInteract.message).width;
      ctx.fillText(this.messageMap.noInteract.message,
                  (this.gameCanvas.width / 2) - (txtWidth / 2),
                  (this.gameCanvas.height / 2));

    } else {
      this.messageMap.noInteract.show = false;
      this.messageMap.noInteract.elapsed = 0;
    }
  }

  for (let i = 0; i < this.messageMap.length; i++) {
    if (this.messageMap[i].show) {
      let t = this.messageMap[i].start + this.messageMap[i].time;
      this.messageMap[i].elapsed += time;

      if (t > this.messageMap[i].elapsed) {
        //Draw text
        ctx.font = "25px Permanent Marker";
        txtWidth = ctx.measureText(this.messageMap[i].message).width;
        ctx.fillText(this.messageMap[i].message,
                    (this.gameCanvas.width / 2) - (txtWidth / 2),
                    (this.gameCanvas.height / 2));

      } else {
        this.messageMap[i].show = false;
        this.messageMap[i].elapsed = 0;
      }
    }
  }


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
    let vX = Math.floor(pX + (player.direction.x * 8));
    let vY = Math.floor(pY + (player.direction.y * 8));
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
