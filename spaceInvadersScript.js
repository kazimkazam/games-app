let width = document.getElementById('game').clientWidth;
let height = document.getElementById('game').clientHeight;

let config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    parent: 'game',
    // backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload () {
    this.load.setBaseURL('http://192.168.1.71:8080');

    this.load.image('background', 'resources/gameModels/background/darkSpace.png');
    this.load.image('spaceShip', 'resources/gameModels/models/spaceship.png');
    this.load.image('smallAlien', 'resources/gameModels/models/smallAlien.png');
    this.load.image('alienBoss', 'resources/gameModels/models/alienBoss.png');
    this.load.image('bullet', 'resources/gameModels/bullets/bullet.png');
    this.load.image('alienBullet', 'resources/gameModels/bullets/bulletAlien.png');
    this.load.image('explosion', 'resources/gameModels/explosions/alienExplosion.png');
};

// ---------------------------------------
// load sounds

let gameStartSound = new Howl({
    src: [ 'http://192.168.1.71:8080/resources/sounds/gameStart.mp3' ],
    volume: 0.7,
});

let shootSound = new Howl({
    src: [ 'http://192.168.1.71:8080/resources/sounds/laserShot.mp3' ],
    volume: 0.5,
});

let explosionSound = new Howl({
    src: [ 'http://192.168.1.71:8080/resources/sounds/explosion.mp3' ],
    volume: 0.1,
});

let playerHitSound = new Howl({
    src: [ 'http://192.168.1.71:8080/resources/sounds/playerHit.mp3' ],
    volume: 0.3,
});

let gameWinSound = new Howl({
    src: [ 'http://192.168.1.71:8080/resources/sounds/gameWin.mp3' ],
    volume: 0.4,
});

let gameLossSound = new Howl({
    src: [ 'http://192.168.1.71:8080/resources/sounds/gameLoss.mp3' ],
    volume: 0.4,
});

// -------------------------------------
// initiate game vars

let player;
let bullets;
let explosions;
let cursors;
let smallAliens;
let alienBullets;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
let isStarted = false;
let isRespawning = false;

const playerScale = 0.1;
const playerBulletScale = 0.04;
const alienBulletScale = 0.04;
const explosionScale = 0.08;

const alienGrid = {
    width: 60,
    height: 45,
    count: {
        row: 7,
        col: 11
    },
    offset: {
        top: 85,
        left: 85
    },
    scale: 0.1
};

function create () {
    // create background
    this.add.image((width / 2), (height / 2), 'background');

    // create score text
    scoreText = this.add.text(10, 10, 'Score: ' + score, { fontSize: '16px', fill: '#FFF' });

    //create lives text
    livesText = this.add.text(width - 90, 10, 'Lives: ' + lives, { fontSize: '16px', fill: '#FFF' });

    // create start text
    var startText = this.add.text(width / 2 - 100, height / 2 + 150, 'Click to play!', { fontSize: '20px', fill: '#FFF' });

    // create small aliens
    smallAliens = this.physics.add.staticGroup();
    spawnSmallAliens();

    // create player
    player = this.physics.add.image((width / 2), height - 50, 'spaceShip');
    player.setScale(playerScale);
    player.setCollideWorldBounds(true);

    // create player projectiles
    var Bullet = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize:

        function Bullet (scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.speed = Phaser.Math.GetSpeed(400, 1);
        },

        fire: function (x, y) {
            this.setPosition(x, y - 30);
            this.setScale(playerBulletScale);
            this.setRotation(3.2);
            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta) {
            this.y -= this.speed * delta;
            this.setRotation(Phaser.Math.FloatBetween(2.9, 3.5))

            if (this.y < 0) {
                this.destroy();
            };
        }
    });

    bullets = this.add.group({
        classType: Bullet,
        maxSize: 1,
        runChildUpdate: true
    });

    // create explosions
    var Explosion = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize:

        function Explosion (scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'explosion');
            this.speed = 0;
        },

        boom: function (x, y) {
            this.setPosition(x, y);
            this.setScale(explosionScale);
            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta) {
            setTimeout(() => {
                this.destroy();
            }, 500);
        }
    });

    explosions = this.add.group({
        classType: Explosion,
        maxSize: 50,
        runChildUpdate: true
    });

    // create aliens projectiles
    var AlienBullet = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize:

        function AlienBullet (scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'alienBullet');

            this.speed = Phaser.Math.GetSpeed(200, 1);
        },

        fire: function (x, y, targetX, targetY) {
            this.setPosition(x, y);
            this.setScale(alienBulletScale);
            this.setActive(true);
            this.setVisible(true);

            let angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
            this.setRotation(angle);

            this.incX = Math.cos(angle);
            this.incY = Math.sin(angle);
        },

        update: function (time, delta) {
            this.x += this.incX * (this.speed * delta);
            this.y += this.incY * (this.speed * delta);

            if (this.y > height || this.y < 0 || this.x < 0 || this.x > width) {
                this.destroy();
            };
        }
    });

    alienBullets = this.add.group({
        classType: AlienBullet,
        maxSize: 500,
        runChildUpdate: true
    });

    // create controls to move player and fire projectiles
    cursors = this.input.keyboard.createCursorKeys();

    // game start
    this.input.on('pointerdown', () => {
        if (!isStarted) {
            isStarted = true;
            gameStartSound.play();
            startText.destroy();
        };
    });
};

function update () {
    if (cursors.left.isDown) {
    player.setVelocityX(-200);
    player.setRotation(-0.3);
    } else if (cursors.right.isDown) {
    player.setVelocityX(200);
    player.setRotation(0.3);
    } else {
        player.setVelocityX(0);
        player.setRotation(0);
    };

    if (cursors.up.isDown) {
        // delimit player y movement
        if (player.y > height * 0.8 ) {
            player.setVelocityY(-200);
        } else {
            player.setVelocityY(0);
        };
        // player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    } else {
        player.setVelocityY(0);
    };

    if (cursors.space.isDown) {
        let bullet = bullets.get();

        if (bullet) {
            bullet.fire(player.x, player.y);
            shootSound.play();
        };
    };

    // ----------------------------------------------
    // detect player's bullet hits and spawn alien explosions
    if (smallAliens && isStarted) {
        smallAliens.children.iterate(smallAlien => {
            bullets.children.iterate(bullet => {
                if (smallAlien && bullet) {
                    if (bullet.x >= smallAlien.x - 30 && bullet.x <= smallAlien.x + 30 && bullet.y >= smallAlien.y && bullet.y <= smallAlien.y + 30) {
                        let explosion = explosions.get();
                        explosion.boom(smallAlien.x, smallAlien.y);

                        let boomSound = explosionSound.play();
                        explosionSound.rate(3, boomSound) // play sound faster

                        bullet.destroy();
                        smallAlien.destroy();
                        score++;
                        scoreText.setText('Score: ' + score);
                    };
                };
            });

            // ---------------------------------------------------------
            // spawn random alien bullets
            let randomFire = Math.floor(Math.random() * 2000);
            if (randomFire === 1) {
                let alienBullet = alienBullets.get();
                if (alienBullet) {
                    alienBullet.fire(smallAlien.x, smallAlien.y, player.x, player.y)
                };
            };
        });

        // ----------------------------------------------------------------------
        // detect aliens bullets hits and update player health
        alienBullets.children.iterate(alienBullet => {
            if (alienBullet) {
                if (alienBullet.x >= player.x - 30 && alienBullet.x <= player.x + 30 && alienBullet.y >= player.y - 30 && alienBullet.y <= player.y + 30) {
                    alienBullet.destroy();
                    playerHitSound.play();
                    lives--;
                    livesText.setText('Lives: ' + lives);
                };
            };
        });
    };

    // moveSmallAliens();
    if (score >= 0 && score < 77) {
        moveSmallAliens(1);
    } else if (score >= 77 && score < 155) {
        moveSmallAliens(2);
    } else {
        moveSmallAliens(3);
    };

    // logic to change isRespawning status
    if (score === 77 || score === 155) {
        score === 77 ? score = 78 : score = 156
        isRespawning = true;
    };

    // respawn new alien fleet after 2 secs
    if (smallAliens.children.entries.length === 0 && isRespawning) {
        isRespawning = false;
        setTimeout(() => {
            spawnSmallAliens();
        }, 2000);
    };

    // detect if player loses
    if (isStarted && lives === 0) {
        isStarted = false;
        end('lost');
    };

    // detect if player wins
    if (isStarted && score === 233) {
        isStarted = false;
        end('win');
    };
};

// -------------------------------------
// hoisting functions

function spawnSmallAliens() {
    for (let col = 0; col < alienGrid.count.col; col++) {
        for (let row = 0; row < alienGrid.count.row; row++) {
            var alienXCoord = (col * alienGrid.width) + alienGrid.offset.left;
            var alienYCoord = (row * alienGrid.height) + alienGrid.offset.top;
            smallAliens.create(alienXCoord, alienYCoord, 'smallAlien').setScale(alienGrid.scale);
        };
    };
};

let xMoves = 0;
let moveDir = 'right';
let moveY = 0;
let moveYDir = 'down';
let yMoves = 0;
function moveSmallAliens(waveNumber) {
    if (isStarted) {
        if (xMoves === 30) {
            if (moveDir === 'right') {
                moveDir = 'left';
                xMoves = 0;
            } else {
                moveDir = 'right';
                xMoves = 0;
            };
        };

        if (yMoves === 30) {
            if (moveYDir === 'down') {
                moveYDir = 'up';
                yMoves = 0;
            } else {
                moveYDir = 'down';
                yMoves = 0;
            };
        };

        if (moveDir === 'right') {
            smallAliens.children.iterate(smallAlien => {
                smallAlien.x += 2.5;
            });
        } else {
            smallAliens.children.iterate(smallAlien => {
                smallAlien.x -= 2.5;
            });
        };
        xMoves++;

        if (waveNumber === 1) {
            smallAliens.children.iterate(smallAlien => {
                smallAlien.y += Math.cos(moveY);
            });
            moveY += 0.02;
        } else if (waveNumber === 2) {
            smallAliens.children.iterate(smallAlien => {
                smallAlien.y -= Math.sin(2 * moveY);
            });
            moveY += 0.02;
        } else {
            if (moveYDir === 'down') {
                smallAliens.children.iterate(smallAlien => {
                    smallAlien.y -= 2.5;
                });
            } else {
                smallAliens.children.iterate(smallAlien => {
                    smallAlien.y += 2.5;
                });
            };
            yMoves++;
        };
    };
};

function end(gameStatus) {
    gameStartSound.stop();
    explosionSound.stop();
    shootSound.stop();
    playerHitSound.stop();

    if (gameStatus === 'win') {
        gameWinSound.play();
        document.getElementById('resultText1').innerHTML = `You won! Score: ${score}`;
        document.getElementById('resultText2').innerHTML = 'Great job! Keep it up!';
    } else {
        gameLossSound.play();
        document.getElementById('resultText1').innerHTML = `You lost! Score: ${score}`;
        document.getElementById('resultText2').innerHTML = 'Better luck next time!';
    };

    document.getElementById('container-result').style.zIndex = 1;

    document.getElementById('reload').addEventListener('click', () => {
        gameWinSound.stop();
        gameLossSound.stop();
        location.reload();
    });
};