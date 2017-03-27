// number of enemies on the canvas
var numEnemies = 3;
// dimensions of canvas defined in engine.js
var canvasWidth = 505;
var canvasHeight = 606;
//start Player position (X,Y)
var playerStartPositionX = 200;
var playerStartPositionY = 400;
// water position on canvas
var waterPosition = 20;
// Boundaries for player sprite
var borderLeft = 5;
var borderRight = 420;
var borderDown = 406;

// Returns a random integer.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// Returns random Y position for enemy or Gem
// There are 3 rows of size 75 pixels each
function getRandomPositionY() {
    var num = getRandomInt(1, numEnemies);
    num = num * 75;
    return num;
}
//superclass 
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
    sprite = 'images/enemy-bug.png';
    x = 0;
    y = getRandomPositionY();
    Character.call(this, sprite, x, y);
    this.speed = this.getRandomSpeed();
};
// Draw the enemy on the screen, required method Character.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
Enemy.prototype = Object.create(Character.prototype);
// Update the enemy's position, required method for game Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > canvasWidth ) {
        this.x = 0;
        this.speed = this.getRandomSpeed();
    } else {
        this.x += this.speed * dt;
    }
};
// Returns random speed for enemy
Enemy.prototype.getRandomSpeed = function() {
    var num = getRandomInt(1, numEnemies);
    num = num * 50;
    return num;
};
// Subclass Gem with random X and Y position
var Gem = function() {
    sprite = 'images/GemOrange.png';
    x = this.getRandomPositionX();
    y = getRandomPositionY();
    Character.call(this, sprite, x, y);
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
    sprite = 'images/char-horn-girl.png';
    x = playerStartPositionX;
    y = playerStartPositionY;
    Character.call(this, sprite, x, y);
    this.speed = 50;
    this.score = 0;
    this.life = 3;
    this.gameStop = false;
};
//
Player.prototype = Object.create(Character.prototype);

Player.prototype.update = function() {
    this.checkGameScore();
    this.checkGameOver();
    this.checkBorder();
    this.checkCollisions();
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
    this.x = playerStartPositionX;
    this.y = playerStartPositionY;
};

// When player reaches the water we increase the score
Player.prototype.checkGameScore = function() {
    if (this.y <= waterPosition) {
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
    if (this.x <= borderLeft) {
        this.x = 405;
    } else if (this.x >= borderRight) {
        this.x = 10;
    }
    if (this.y >= borderDown) {
        this.y = 406;
    }
};
// Collision detection: find collisions with enemies and reduce number of
// lives when collision is found
Player.prototype.checkCollisions = function() {
    allEnemies.forEach( function(enemy) {
        if (((enemy.x - 50) <= player.x) &&
            ((enemy.x + 50) >= player.x) &&
            ((enemy.y - 50) <= player.y) &&
            ((enemy.y + 50) >= player.y)) {
                player.lostLife();
        }
    });
};
// Gem detector: find collision with gem and if found: move it to a new position
// and increase life number
Player.prototype.checkGemCaught = function() {
    if (((gem.x - 50)<= player.x) &&
        ((gem.x + 50) >= player.x) &&
        ((gem.y - 50) <= player.y) &&
        ((gem.y + 50) >= player.y)) {
            player.increaseLife();
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
            this.x -= this.speed;
        }
        if (actionKeyPress == 'right') {
            this.x += this.speed;
        }
        if (actionKeyPress == 'up') {
            this.y -= this.speed;
        }
        if (actionKeyPress == 'down') {
            this.y += this.speed;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < numEnemies; i++) {
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
