// Javascript Source Code for Game

// CONSTANTS
var CANVAS_WIDTH = 1000;
var CANVAS_HEIGHT = 1000;
var FPS = 30;

/*var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height - CANVAS_HEIGHT;*/

var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
          "' height='" + CANVAS_HEIGHT + "'></canvas");
        var canvas = canvasElement.get(0).getContext("2d");
        canvasElement.appendTo('body');

//document.body.appendChild(canvas);

// Player GameObject
var playerGO = 
{
    color: "#00A",
    x: 50,
    y: 270,
    height: 30,
    width: 20,
   draw: function()
   {
       canvas.fillStyle = this.color;
       canvas.fillRect(this.x, this.y, this.width, this.height);
   }
};

playerGO.sprite = Sprite("brent");
playerGO.draw = function()
{
    this.sprite.draw(canvas, this.x, this.y);
}

// Interval
 setInterval(function() 
{
    update();
    draw();
}, 1000/FPS);

// Render
function draw() 
{
    canvas.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    playerGO.draw();  // Draws the playerGO
}

// Collision Detection Algorithm
 function handleCollision(a, b)
{
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

// Game Loop
function update() 
{
    // Player GO Controls
    if(keydown.left) 
        playerGO.x -= 5;

    if(keydown.right)
        playerGO.x += 5;

    if(keydown.up) 
        playerGO.y -= 5;

    if(keydown.down)
        playerGO.y += 5;

    // Clamp the position so that it won't go out of bounds
    playerGO.x = playerGO.x.clamp(0, CANVAS_WIDTH - playerGO.width);

    
    
}

// BGM
Sound.play("test");

// Cross browser support for the request animation frame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Run Game
var date = Date.now();
//udpate();
