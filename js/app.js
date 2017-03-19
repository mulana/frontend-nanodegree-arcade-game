// number of enemies on the canvas
var numEnemies = 3;
var canvasWidth = 505;
var canvasHeight = 606;
var playerStartPositionX = 200;
var playerStartPositionY = 400;
var waterPosition = 20;
var borderLeft = 5;
var borderRight = 420;
var borderDown = 406;

// Returns a random integer. 
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomPositionY() {
    var num = getRandomInt(1, numEnemies);
    num = num * 75;
    return num;
}

function getRandomSpeed() {
    var num = getRandomInt(1, numEnemies);
    num = num * 50;
    return num;
}

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = getRandomPositionY();
    this.speed = getRandomSpeed();
    // this.speed = 30;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    // this.sprite = 'images/char-horn-girl.png';
    this.x = playerStartPositionX;
    this.y = playerStartPositionY;
    this.speed = 20;
    this.win = 0;
    this.life = 3;
}

Player.prototype.update = function() {
    this.gameOver();
    this.gameWin();
    this.checkBorder();
    this.checkCollisions();
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.startPosition = function() {
    this.x = playerStartPositionX;
    this.y = playerStartPositionY;
}

//When a player reaches the water, the win is increased
Player.prototype.gameWin = function() {
    if (this.y <= waterPosition) {
        this.win += 1;
        this.startPosition();
    }
}

Player.prototype.gameOver = function() {
    if (this.life === 0) {
        this.resetGame();
    }
}

Player.prototype.resetGame = function() {
    this.life = 3;
    this.win = 0;
    this.startPosition();
}

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

}

Player.prototype.handleInput = function(actionKeyPress) {
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i=0; i<numEnemies; i++) {
    // Instantiate a new Enemies object
    var enemie = new Enemy();
    allEnemies[i] = enemie;
}

// Place the player object in a variable called player
// Instantiate a new Player object
var player = new Player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
