// number of enemies on the canvas
var numEnemies = 3;
//canvas dimension that is define in engine.js
var canvasWidth = 505;
var canvasHeight = 606;
//start Player position (X,Y)
var playerStartPositionX = 200;
var playerStartPositionY = 400;
// water position on canvas
var waterPosition = 20;
// Border for player that he can move only on the canvas
var borderLeft = 5;
var borderRight = 420;
var borderDown = 406;

// Returns a random integer.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// Returns random X position for the Gem
function getRandomPositionX() {
    return getRandomInt(10, 300);
}
// Returns random Y position for enemy (1 or 2 or 3) and for Gem
function getRandomPositionY() {
    var num = getRandomInt(1, numEnemies);
    num = num * 75;
    return num;
}
// Returns random speed for enemy
function getRandomSpeed() {
    var num = getRandomInt(1, numEnemies);
    num = num * 50;
    return num;
}
// Enemies that our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = getRandomPositionY();
    this.speed = getRandomSpeed();
};

// Update the enemy's position, required method for game Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > canvasWidth ) {
        this.x = 0;
        this.speed = getRandomSpeed();
    } else {
        this.x += this.speed * dt;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Object Gem with random X and Y position
var Gem = function() {
    this.sprite = 'images/GemOrange.png';
    this.x = getRandomPositionX();
    this.y = getRandomPositionY();
}
// Give Gem new position on canvas
Gem.prototype.newPosition = function() {
    this.x = getRandomPositionX();
    this.y = getRandomPositionY();
}
// Draw Orange Gem on the screen (canvas)
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.x = playerStartPositionX;
    this.y = playerStartPositionY;
    this.speed = 20;
    this.score = 0;
    this.life = 3;
    this.gameStop = false;
}

Player.prototype.update = function() {
    this.checkGameScore();
    this.checkGameOver();
    this.checkBorder();
    this.checkCollisions();
    this.checkGemCaught();
}

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
}
// Player's start position on canvas
Player.prototype.startPosition = function() {
    this.x = playerStartPositionX;
    this.y = playerStartPositionY;
}

// When a player reaches the water, the score is increased
Player.prototype.checkGameScore = function() {
    if (this.y <= waterPosition) {
        this.score += 1;
        this.startPosition();
    }
}
// Check if the game is over; when Player have no more life
Player.prototype.checkGameOver = function() {
    if (this.life === 0) {
        this.gameStop = true;
    }
}
// Move the Player on the start position on the canvas
Player.prototype.startGame = function() {
    if (this.gameStop === true) {
        this.resetGame();
        this.gameStop = false;
    }
}
// Set life and score lake they was on begining of the game
Player.prototype.resetGame = function() {
    this.life = 3;
    this.score = 0;
    this.startPosition();
}
// Checks if player moves only on the canvas border
Player.prototype.checkBorder = function() {
    if (this.x <= borderLeft) {
        this.x = 405;
    } else if (this.x >= borderRight) {
        this.x = 10;
    }
    if (this.y >= borderDown) {
        this.y = 406;
    }
}
// Colision detection: when player hit an enemy
Player.prototype.checkCollisions = function() {
    allEnemies.forEach( function(enemy) {
        if (((enemy.x - 50)<= player.x) && ((enemy.x + 50) >= player.x) && ((enemy.y - 50) <= player.y) && ((enemy.y + 50) >= player.y)) {
            player.lostLife();
        }
    })
}
// Gem detector: when player find gem
Player.prototype.checkGemCaught = function() {
    if (((gem.x - 50)<= player.x) && ((gem.x + 50) >= player.x) && ((gem.y - 50) <= player.y) && ((gem.y + 50) >= player.y)) {
        player.getLife();
        gem.newPosition();
    }
}
//The life is increased when player get Gem
Player.prototype.getLife = function() {
    this.life += 1;
}

//When player hit enemy, the life is reduced by 1
Player.prototype.lostLife = function() {
    this.life -= 1;
    this.startPosition();
}

Player.prototype.handleInput = function(actionKeyPress) {
    if (this.gameStop === false) {
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
    } else {
        // Press Space to Start Game again after Game Over
        if (actionKeyPress == 'space') {
            this.startGame();
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i=0; i<numEnemies; i++) {
    // Instantiate a new Enemies object
    var enemie = new Enemy();
    allEnemies[i] = enemie;
}

// Place the player object in a variable called player
// Create an instance player of class Player object
var player = new Player;
// Create an instance gem of class Gem object
var gem = new Gem;

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
