var game = new Phaser.Game(400,490,Phaser.AUTO,"gameDiv");
var mainState = {
  preload: function() {
  // Load the bird sprite
  game.load.image('bird', 'assets/bird.png');
  game.load.image('pipe', 'assets/pipe.png');
  game.load.audio('jump', 'assets/jump.wav');
},

create: function() {
  // If this is not a desktop (so it's a mobile device)
if (game.device.desktop == false) {
    // Set the scaling mode to SHOW_ALL to show all the game
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // Set a minimum and maximum size for the game
    // Here the minimum is half the game size
    // And the maximum is the original game size
    game.scale.setMinMax(game.width/2, game.height/2,
        game.width, game.height);

    // Center the game horizontally and vertically
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
}
  // Change the background color of the game to blue
  game.stage.backgroundColor = '#71c5cf';

  // Set the physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Display the bird at the position x=100 and y=245
  this.bird = game.add.sprite(100, 245, 'bird');
  this.bird = game.add.sprite(50, 145, 'bird');

  // Add physics to the bird
  // Needed for: movements, gravity, collisions, etc.
  game.physics.arcade.enable(this.bird);

  // Add gravity to the bird to make it fall
  this.bird.body.gravity.y = 1000;

  // Call the 'jump' function when the spacekey is hit
  var spaceKey = game.input.keyboard.addKey(
                  Phaser.Keyboard.SPACEBAR);
  spaceKey.onDown.add(this.jump, this);

  // Create an empty group
  this.pipes = game.add.group();
  this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

  this.score = 0;
  this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

  // Move the anchor to the left and downward
  this.bird.anchor.setTo(-0.2, 0.5);
  this.jumpSound = game.add.audio('jump');

  // Call the 'jump' function when we tap/click on the screen
  game.input.onDown.add(this.jump, this);
},

update: function() {
    // If the bird is out of the screen (too high or too low)
    // Call the 'restartGame' function
    if (this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();

    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    if (this.bird.angle < 20)
      this.bird.angle += 1;
},
jump: function() {
    if (this.bird.alive == false)
      return;
    // Add a vertical velocity to the bird
    this.bird.body.velocity.y = -350;
    game.add.tween(this.bird).to({angle: -20}, 100).start();
    this.jumpSound.play();
},
restartGame: function() {
    game.state.start('main');
},
addOnePipe: function(x, y) {
    // Create a pipe at the position x and y
    var pipe = game.add.sprite(x, y, 'pipe');

    // Add the pipe to our previously created group
    this.pipes.add(pipe);

    // Enable physics on the pipe
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200;

    // Automatically kill the pipe when it's no longer visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
},
addRowOfPipes: function() {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1)
            this.addOnePipe(400, i * 60 + 10);
            this.score += 1;
this.labelScore.text = this.score;
},

hitPipe: function() {
    // If the bird has already hit a pipe, do nothing
    // It means the bird is already falling off the screen
    if (this.bird.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
},

};
game.state.add('main', mainState);
game.state.start('main');
