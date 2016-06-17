// Javascript Source Code for Game

// CONSTANTS
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;
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

/// *** Background *** ///
var bg =
{
    color: "#00A",
    x: 0,
    y: 0,
    height: CANVAS_HEIGHT,
    width: CANVAS_WIDTH,
    draw: function()
    {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }
};

// set the sprite
bg.sprite = Sprite("bg2");

bg.draw = function()
{
    this.sprite.draw(canvas, this.x, this.y);
};

/// *** Player GameObject *** ///
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

// player sprite
playerGO.sprite = Sprite("ship2");

// Player Functions
playerGO.draw = function()
{
    this.sprite.draw(canvas, this.x, this.y);
};

// Player midpoint function
playerGO.midPoint = function() 
{
    return { // wtf javascript can't understand why I have to make this convention ugh >.<
    x: this.x + this.width * 1.25,
    y: this.y + this.height / 2
    };
};

// Player shoot function
playerGO.Shoot = function()
{
    // Play Sound SFX
    Sound.play("shoot");

    // create instances of the bullet
    var bulletSpawnPosition = this.midPoint(); // sets the position of the bullet when spawned to the position of the sprite of the player
    bullets.push(Bullet(
        {
            // set the parameters of the bullet
            speed: 5,
            x: bulletSpawnPosition.x,
            y: bulletSpawnPosition.y
        }
    ));
};

playerGO.explode = function()
{
    this.active = false;
    // Add Explosion Sound here
    Sound.play("explosion");
};

/// *** Bullet GameObject *** ///
var bullets = [];
// Bullet Functions
function Bullet(I) // constructor class
{
    I.active = true;
    // Default parameters
    I.xVelocity = 0;
    I.yVelocity = -I.speed;
    I.width = 5; // change this if you want to resize the bullets
    I.height = 12.5; // change this if you want to resize the bullets
    I.color = "#f9f19a"; // change the color if you want just input the HEX

    I.inBounds =  function() // checks if the bullet is still in the canvas
    {
        return I.x >= 0 && I.x <= CANVAS_WIDTH && I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    // Render function of the Bullet class
    I.draw = function()
    {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    };

    // Update function of the class
    I.update = function()
    {
        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.active = I.active && I.inBounds(); // Update this bullet whenver it is active AND in bounds or inside the canvas
    };

    I.explode = function()
    {
        this.active = false;
        // Add sound effect to explosion
        Sound.play("explosion");
    };

    return I; // return the class to create and instance
};

/// *** Enemy Functions *** ///
// Enemy data structure
enemyList = [];  // array of enemies

// Enemy Class
function Enemy(I)
{
    I = I || {}; // constructor

    I.active = true; // set the entity default to true
    I.age = Math.floor(Math.random() * 128);

    I.color = "#A2B"; // color of the enemy sprite.. you can change this by using the ASCI code of the color
    I.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;  // create the enemy randomly inside the canvas
    I.y = 0; // if you also want to conver the Y axis to go random just copy and paste the upper code and change CANVAS_WIDTH to CANVAS_HEIGHT
    I.xVelocity = 0; // x speed
    I.yVelocity = 2; // y speed

    I.width = 32; //  width in pixels
    I.height = 32; // height in pixels

    // Inbounds function of the enemy... same as the bullet
    I.inBounds = function()
    {
        return I.x >= 0 && I.x <= CANVAS_WIDTH && I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    // Sprite of the Enemy
    I.sprite = Sprite("enemy3");

    // Render/Draw function of the Enemy class.. same as the bullet class
    I.draw = function()
    {
        /*canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);*/
        this.sprite.draw(canvas, this.x, this.y);
    };

    // Update function of the Enemy class... same as the bullet class
    I.update = function()
    {
        // Add the velocities to update the position of the enemy
        I.x += I.xVelocity; 
        I.y += I.yVelocity;

        I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64); // creates a wavy length movement for the X movement of the enemy.. think like the blinking effect of the shader in Unreal Engine 4

        I.age++; // increment the age.. same like the TimeData in Unreal Engine 4 Material editor

        I.active = I.active && I.inBounds(); // check if it is still within the bounds of the canvas
    };

    // Enemy explode function
    I.explode = function()
    {
        this.active = false;
        // Add sound effect of explosion here
        Sound.play("explosion");
    };

    return I;
};

/// *** Game Data *** ///
var score = 0;
var playerLife = 3;
var canShoot = true;
function playerIsAlive()
{
    return playerLife > 0;
}

/// *** Game Proper Functions *** ///

// Interval function.. think of deltaTime in Unreal Engine 4
setInterval(function() 
{
    update();
    draw();
}, 1000 / FPS);

// Render
function draw() 
{
    canvas.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // draw the background
    bg.draw();

    playerGO.draw();  // Draws the playerGO

    // render the bullets in the array bullets[]
    bullets.forEach(function(bullet) // Interface
        {
            bullet.draw();  // call the draw function
        }
    );

    // render the enemies
    enemyList.forEach(function(enemy)
    {
        enemy.draw();
    });

    // Render the score
    canvas.fillStyle = "rgb(250, 250, 250)";
    canvas.font = "24px Courier";
    canvas.textAlign = "left";
    canvas.textBaseline = "top";
    canvas.fillText("Score: " + score, 32, 32);

    // Render the PlayerLife
    canvas.textAlign = "bottom";
    canvas.fillText("Life: " + playerLife, 32, 60);

    if (playerLife <= 0)
    {
        canvas.fillStyle = "rgb(255, 0, 0)"; // color use RGB decimal color scheme not the HEX
        canvas.font = "72px Courier";
        canvas.textAlign = "center";
        canvas.textBaseline = "top";
        canvas.fillText("GAME OVER", CANVAS_WIDTH / 2, 120);

    }
}

// Collision Detection Algorithm of Gameobject A to Gameobject B
function handleCollision(a, b)
{
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

// Checks and updates the collision
function checkCollision()
{
    // check collision for bullet and enemy
    bullets.forEach(function(bullet)
    {
        enemyList.forEach(function(enemy)
        {
            if (handleCollision(bullet, enemy))
            {
                enemy.explode();
                bullet.explode();
                score++;
                
                console.log("Score: " + score);
            }
        });
    });

    // check collision for player and enemy
    enemyList.forEach(function(enemy)
    {
        if (handleCollision(enemy, playerGO))
        {
            enemy.explode();
            //playerGO.explode();
            playerLife--;
            console.log("Life: " + playerLife);
        }
    });
}

// *** GAME LOOP *** //
function update() 
{
    if (!playerIsAlive()) return;

    // Player GO Controls//
    // Player Movement
    if(keydown.left) 
        playerGO.x -= 5;

    if(keydown.right)
        playerGO.x += 5;

    if(keydown.up) 
        playerGO.y -= 5;

    if(keydown.down)
        playerGO.y += 5;

    // Player Shoot
    if (keydown.space && canShoot)
    {
        playerGO.Shoot();
        canShoot = false;
    }
    if (!keydown.space && !canShoot)
        canShoot = true;

    // Clamp the position so that it won't go out of bounds
    playerGO.x = playerGO.x.clamp(0, CANVAS_WIDTH - playerGO.width);

    bullets.forEach(function(bullet) // Interface
    {
        bullet.update();  // call the update function
    }
    );

    // Filter out the bullets if they're still active or not
    bullets = bullets.filter(function(bullet)
    {
        return bullet.active;
    });

    // Update the enemies
    enemyList.forEach(function(enemy)
    {
        enemy.update();
    });

    // filter out if the enemy is still in bounds
    enemyList = enemyList.filter(function(enemy)
    {
        return enemy.active;
    });

    // Spawning algorithm for the enemies
    if (Math.random() < 0.01) // you can change the time interval
        enemyList.push(Enemy());
    
    // Update the collision detection
    checkCollision();
}

// BGM
if (playerIsAlive())
    Sound.play("bgm");
else
{
    Sound.stop("test");
    // Player GO
    Sound.play("bgm");
}

// Cross browser support for the request animation frame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Run Game
var date = Date.now();
//udpate();
