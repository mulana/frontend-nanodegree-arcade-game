"use strict";
// number of enemies on the canvas
var NUM_ENEMIES = 3;
// dimensions of canvas defined in engine.js
var CANVAS_WIDTH = 505;
var CANVAS_HEIGHT = 606;
//start Player position (X,Y)
var PLAYER_START_POSITION_X = 203;
var PLAYER_START_POSITION_Y = 400;
// water position on canvas
var WATER_POSITION = 20;
// Boundaries for player sprite
var BORDER_LEFT = 0;
var BORDER_RIGHT = 420;
var BORDER_DOWN = 406;
//tile size is 101 x 83 defined in engine.js
var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;

// Returns a random integer.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// Returns random Y position for enemy or Gem
// There are 3 rows of size 75 pixels each
function getRandomPositionY() {
    var num = getRandomInt(1, NUM_ENEMIES);
    num = num * 75;
    return num;
}
// Base class for all characters on the screen
var Character = function(sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
}
// Draw on the screen required method for game
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Enemies that our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses a helper we've provided to easily load images
    Character.call(this, 'images/enemy-bug.png', 0, getRandomPositionY());
    this.speed = this.getRandomSpeed();
};
Enemy.prototype = Object.create(Character.prototype);
// Update the enemy's position, required method for game Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.checkCollisions();
    if (this.x > CANVAS_WIDTH ) {
        this.x = 0;
        this.speed = this.getRandomSpeed();
    } else {
        this.x += this.speed * dt;
    }
};
// Returns random speed for enemy
Enemy.prototype.getRandomSpeed = function() {
    var num = getRandomInt(1, NUM_ENEMIES);
    num = num * 50;
    return num;
};
// Collision detection: find collisions with enemies and reduce number of
// lives when collision is found
Enemy.prototype.checkCollisions = function() {
    if (((this.x - 50) <= player.x) &&
        ((this.x + 50) >= player.x) &&
        ((this.y - 50) <= player.y) &&
        ((this.y + 50) >= player.y)) {
            player.lostLife();
    };
};
// Subclass Gem with random X and Y position
var Gem = function() {
    Character.call(this, 'images/GemOrange.png', this.getRandomPositionX(), getRandomPositionY());
};
//
Gem.prototype = Object.create(Character.prototype);
// Give Gem new position on canvas
Gem.prototype.newPosition = function() {
    this.x = this.getRandomPositionX();
    this.y = getRandomPositionY();
};
// Returns random X position for the Gem
Gem.prototype.getRandomPositionX= function() {
    return getRandomInt(10, 300);
};
// Draw Orange Gem on the screen (canvas)
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    Character.call(this, 'images/char-horn-girl.png', PLAYER_START_POSITION_X, PLAYER_START_POSITION_Y);
    this.speedX = TILE_WIDTH;
    this.speedY = TILE_HEIGHT;
    this.score = 0;
    this.life = 3;
    this.gameStop = false;
};
Player.prototype = Object.create(Character.prototype);

Player.prototype.update = function() {
    this.checkGameScore();
    this.checkGameOver();
    this.checkBorder();
    this.checkGemCaught();
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = 'bold 35px Arial, sans-serif';
    ctx.fillStyle = '#ff0000';
    ctx.fillText("Lives: " + this.life, 10, 580);
    ctx.fillText("Score: " + this.score, 350, 580);
    if (this.gameStop === true) {
        ctx.font = "bold italic 40px Arial, Helvetica, sans serif";
        ctx.fillStyle = "#ff0000";
        ctx.strokeStyle = "blue";
        ctx.fillText("Game Over", 150, 300);
        ctx.strokeText("Game Over", 150, 300);
        ctx.font = "bold 24px Arial, Helvetica, sans serif";
        ctx.fillStyle = "#fffd01";
        ctx.fillText("PRESS SPACE TO TRY AGAIN", 75, 350);
        ctx.strokeText("PRESS SPACE TO TRY AGAIN", 75, 350);
    }
};
// Player's start position on canvas
Player.prototype.startPosition = function() {
    this.x = PLAYER_START_POSITION_X;
    this.y = PLAYER_START_POSITION_Y;
};

// When player reaches the water we increase the score
Player.prototype.checkGameScore = function() {
    if (this.y <= WATER_POSITION) {
        this.score += 1;
        this.startPosition();
    }
};
// Check if the game is over; when Player has no more lives
Player.prototype.checkGameOver = function() {
    if (this.life === 0) {
        this.gameStop = true;
    }
};
// Move the Player to the start position on the canvas
Player.prototype.startGame = function() {
    if (this.gameStop === true) {
        this.resetGame();
        this.gameStop = false;
    }
};
// Reset values of life and score
Player.prototype.resetGame = function() {
    this.life = 3;
    this.score = 0;
    this.startPosition();
};
// Check whether player position is within boundaries
Player.prototype.checkBorder = function() {
    if (this.x <= BORDER_LEFT) {
        this.x = 405;
    } else if (this.x >= BORDER_RIGHT) {
        this.x = 10;
    }
    if (this.y >= BORDER_DOWN) {
        this.y = 406;
    }
};
// Gem detector: find collision with gem and if found: move it to a new position
// and increase life number
Player.prototype.checkGemCaught = function() {
    if (((gem.x - 50)<= this.x) &&
        ((gem.x + 50) >= this.x) &&
        ((gem.y - 50) <= this.y) &&
        ((gem.y + 50) >= this.y)) {
            this.increaseLife();
            gem.newPosition();
    }
};
//The life is increased when player gets a gem
Player.prototype.increaseLife = function() {
    this.life += 1;
};
// When player hits an enemy, the life is reduced by 1
Player.prototype.lostLife = function() {
    this.life -= 1;
    this.startPosition();
};

Player.prototype.handleInput = function(actionKeyPress) {
    if (this.gameStop) {
        // Press Space to Start Game again after Game Over
        if (actionKeyPress == 'space') {
            this.startGame();
        }
    } else {
        if (actionKeyPress == 'left') {
            this.x -= this.speedX;
        }
        if (actionKeyPress == 'right') {
            this.x += this.speedX;
        }
        if (actionKeyPress == 'up') {
            this.y -= this.speedY;
        }
        if (actionKeyPress == 'down') {
            this.y += this.speedY;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < NUM_ENEMIES; i++) {
    // Instantiate a new Enemies object
    var enemie = new Enemy();
    allEnemies[i] = enemie;
}
// Create an instance of a Player class
var player = new Player();
// Create an instance of a Gem class
var gem = new Gem();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
