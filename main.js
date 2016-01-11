var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('unicorn', 'assets/unicorn.png');
  game.load.image('sky', 'assets/rsz_rainbow-background.jpg');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('falling', 'assets/fallingT.png');
  game.load.image('bloodBar', 'assets/healthbar-empty.png');

  game.load.audio('scream', ['assets/scream.mp3']);
  game.load.audio('accordian', ['assets/accordian.mp3']);
  game.load.audio('horse-yell', ['assets/horse-noise.mp3']);
}

var score = 0;
var scoreText;

var blood = 0;
var bloodText;
var bloodRageText;

var bloodRage = false;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.add.sprite(0, 0, 'sky');
  game.add.sprite(900, 30, 'bloodBar');

  fx = game.add.audio('scream');
  horseFx = game.add.audio('horse-yell');
  bgMusic = game.add.audio('accordian', 1, true);

  bgMusic.play();

  scoreText = game.add.text(16, 16, 'Kills: 0', { fontSize: '32px', fill: '#000' });
  bloodText = game.add.text(900, 10, 'Blood: 0%', { fontSize: '16px', fill: '#000' });
  bloodRageText = game.add.text(200, 20, '', { fontSize: '40px', fill: '#FF0000' });

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  //  We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  // Here we create the ground.
  var ground = platforms.create(0, game.world.height - 64, 'ground');

  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(4, 2);

  //  This stops it from falling away when you jump on it
  ground.body.immovable = true;

  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'unicorn');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0], 10, true);
  player.animations.add('right', [0], 10, true);

  stars = game.add.group();
  stars.enableBody = true;

  //  Here we'll create 6 of them evenly spaced apart
  for (var i = 0; i < 6; i++) {
    //  Create a star inside of the 'stars' group
    var star = stars.create(i * 200, 0, 'falling');

    //  Let gravity do its thing
    star.body.gravity.y = 3 + Math.random() * 10;

    //  This just gives each star a slightly random bounce value
    //star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  setInterval(moreFallers, 2000);

  function moreFallers() {
    var body = stars.create((Math.random() * 1200), 0, 'falling');
    body.body.gravity.y = 5 + Math.random() * 10;
  }
}

function update() {
  game.physics.arcade.collide(player, platforms);

  cursors = game.input.keyboard.createCursorKeys();

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  if (cursors.left.isDown)
  {
    //  Move to the left
    if(bloodRage) {
      player.body.velocity.x = -650;
    }
    else {
      player.body.velocity.x = -150;
    }

    player.animations.play('left');
  }
  else if (cursors.right.isDown)
  {
    //  Move to the right
    if(bloodRage) {
      player.body.velocity.x = 650;
    }
    else {
      player.body.velocity.x = 150;
    }

    player.animations.play('right');
  }

  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down)
  {
    if(bloodRage) {
      player.body.velocity.y = -750;
    }
    else {
      player.body.velocity.y = -350;
    }
  }

  game.physics.arcade.overlap(player, stars, collectStar, null, this);

  if(bloodRage) {
    superRage();
    bloodRage = false;
  }
}

function collectStar (player, star) {
  // Removes the star from the screen
  star.kill();
  fx.play();

  if(blood === 9) {
    horseFx.play();
    blood = 0;
    bloodRage = true;
    bloodRageText.text = "BLOOD RAGE! MURDER ALL THE HUMANS!!!!";
  }

  //Add and update the score
  score += 1;
  blood += 1;
  scoreText.text = 'Kills: ' + score;
  bloodText.text = 'Blood: ' + score * 10 + '%';
}

function superRage() {
  //  Here we'll create 6 of them evenly spaced apart
  for (var i = 0; i < 100; i++) {
    //  Create a star inside of the 'stars' group
    var star = stars.create(Math.random() * 1200, 0, 'falling');

    //  Let gravity do its thing
    star.body.gravity.y = 20 + Math.random() * 10;
  }
}