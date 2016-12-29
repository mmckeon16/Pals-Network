var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

var player;
var platforms;
var cursors;
var boundary;
var boundary2;

var stars;
var score = 0;
var scoreText;
var inputText;

var counter = 0.0;
var theWord = "cat";

var canMove = true;
var starExists;

function create() {

    //scaling
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.world.setBounds(0,0,4000,600);

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    // //  Now let's create two ledges
    // var ledge = platforms.create(400, 400, 'ground');
    // ledge.body.immovable = true;

    // ledge = platforms.create(-150, 250, 'ground');
    // ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Create a star inside of the 'stars' group
    var star = stars.create(400, 0, 'star');
    starExists = true;

    game.camera.follow(player);

    //  Let gravity do its thing
    star.body.gravity.y = 300;

    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    inputText = game.add.text(200, 16, '', { fontSize: '32px', fill: '#000' });
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addCallbacks(this, null, null, keyPress);
    inputText.fixedToCamera = true;

}

function update() {

    if(!starExists){
        game.camera.follow(player);
    }
    else{
        game.camera.unfollow();
    }

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown && canMove)
    {
        
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown && canMove)
    {
        console.log("Counter:: " + counter);
        console.log("Player x:: " + player.x);
        console.log(player.x - counter);
        
        if((player.x - counter) >= 200 && !starExists){
            
            counter+=200;
            
            var ground2 = platforms.create(counter*2, game.world.height - 64, 'ground');

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground2.scale.setTo(2, 2);

            //  This stops it from falling away when you jump on it
            ground2.body.immovable = true;

            //add sky
            sky = game.add.sprite(counter*2, 0, 'sky');
            game.world.sendToBack(sky);
        }
        

        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && canMove)
    {
        player.body.velocity.y = -350;
    }

}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  make character not move

    immobile();

    starExists = false;

}

function keyPress(char){
    if(game.input.keyboard.event.keyCode == 8){
        inputText.text = inputText.text.substring(0,inputText.text.length - 1);
    }else if(game.input.keyboard.event.keyCode == 13){
        var userText = inputText.text;
        immobile();
        checkWord(userText);
    }else{
        inputText.text += char;
        var code = char.charCodeAt(0);
        console.log(char + " charChodeAt : " + code + " Game input:: " + game.input.keyboard.event.keyCode);
    }    
}

function checkWord(userWord){
    if(theWord == userWord){
        //stuff
        console.log("Shit happens!");
        canMove = true;
    }
}

function immobile(){
    canMove = false;
}