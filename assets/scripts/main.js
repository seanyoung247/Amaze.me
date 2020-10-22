//Initial startup
var game = null;
var joystick = null;
var touched = false;
/*
 * Basic touch functionality
 */
function isTouchDevice() {
  return (('ontouchstart' in window)
      || (navigator.maxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}

$( document ).ready(function() {
  let canvas = document.getElementById("gameCanvas");
  game = new GameState(canvas, normalMap);

  //Attach event listeners
  //Keyboard
  $(window).keydown(function(event) {game.keyDown(event);});
  $(window).keyup(function(event) {game.keyUp(event);});

  //UI
  $( "#optEasy" ).click( function() {
    difficultySelector(gamedifficulty.EASY);
  });
  $( "#optNormal" ).click( function() {
    difficultySelector(gamedifficulty.NORMAL);
  });
  $( "#optHard" ).click( function() {
    difficultySelector(gamedifficulty.HARD);
  });

  $( "#learnBtn" ).click(learnButtonClicked);
  $( "#playBtn" ).click(playButtonClicked);
  $( "#menuBtn" ).click(menuButtonClicked);

  //Is touch supported?
  if (isTouchDevice()) {
    joystick = new VirtualJoystick({
		  container	    : document.getElementById('gameDiv'),
		  mouseSupport	: true,
      stickRadius   : 150,
      strokeStyle   : "rgba(255,255,255,0.5)",
		});
    joystick.addEventListener('touchStart', function() {
      touched = true;
    });
    joystick.addEventListener('touchEnd', function() {
      touched = false;
      game.inputMap.interact.up = true;
      game.inputMap.interact.down = false;
      game.inputMap.up.down = false;
      game.inputMap.up.up = true;
      game.inputMap.down.down = false;
      game.inputMap.down.up = true;
      game.inputMap.turnLeft.down = false;
      game.inputMap.turnLeft.up = true;
      game.inputMap.turnRight.down = false;
      game.inputMap.turnRight.up = true;
		});
  }

  //Start the game loop
  window.requestAnimationFrame(loop);
});

function doTouch() {
  if (touched) {
    game.inputMap.up.down = joystick.up();
    game.inputMap.up.up = !joystick.up();
    game.inputMap.down.down = joystick.down();
    game.inputMap.down.up = !joystick.down();
    game.inputMap.turnLeft.down = joystick.left();
    game.inputMap.turnLeft.up = !joystick.left();
    game.inputMap.turnRight.down = joystick.right();
    game.inputMap.turnRight.up = !joystick.right();
  }
}

function drawBackground(ctx) {
  //Draw sky gradient
  let grad = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
  grad.addColorStop(0, "#3190C5");
  grad.addColorStop(0.5,"#ADD8E6");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height / 2);
  //Draw Floor
  ctx.fillStyle = "#76552B";
  ctx.fillRect(0, ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height / 2);
}

//Renders game screen
function draw(frameTime) {
  let ctx = game.gameContext;
  let player = game.player;
  let t1 = performance.now();
  //Responsive canvas resolution
  ctx.canvas.width = $("#gameDiv").innerWidth() - 30;
  ctx.canvas.height = $("#gameDiv").innerHeight() - 30;
  //Draw background
  drawBackground(ctx);

  game.drawScene(frameTime);
  game.drawOverlay(frameTime);

  let time = performance.now() - t1;
}

//Game loop
function loop(timeStamp) {
  let player = game.player;
  let clock;

  let frameTime = game.frameStart(timeStamp);

  //Ensures direction vector remains normalised
  player.direction.normalize();
  //Feeding update frameTime in seconds simplifies math
  game.update(frameTime / 1000);
  if (isTouchDevice) doTouch();
  draw(frameTime);

  if (game.playing()) {
    clock = game.gameClock;
    $( "#clock" ).text(clock.minutes() + ":" +
                        String(clock.seconds()).padStart(2, '0'));
  }

  game.frameEnd(timeStamp);

  window.requestAnimationFrame(loop);
}

function hideSplashScreen() {
  $( "#menuBtn").trigger("click");
}
//UI event handlers
function difficultySelector(difficulty) {
  //Is the new difficulty different to the current one?
  if (difficulty != game.difficulty) {
    //If playing already we need to reset the game
    if (game.playing()) game.reset();
    //Set new difficulty
    game.difficulty = difficulty;
  }
}
function playButtonClicked() {
  //If playing already we need to reset the game
  if (game.playing()) game.reset();

  hideSplashScreen();
  game.playStart();
}
function learnButtonClicked() {
  //If playing already we need to reset the game
  if (game.playing()) game.reset();

  hideSplashScreen();
  game.state = gamestates.TRAINING;
}
function pauseButtonClicked() {
  game.togglePause();
}
function menuButtonClicked() {
  /* If the splashscreen is visible when the button is pressed,
     it's about to be hidden so we need to unpause the game. */
  if ($( "#splashscreen" ).is(":visible")) {
    game.unpause();
  } else {
    game.pause();
  }
}
