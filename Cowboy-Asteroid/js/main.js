window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic

    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    "use strict";

    var game = new Phaser.Game( 400, 700, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        game.load.image( 'asteroid', 'assets/asteroid.png' );
        game.load.image('player', 'assets/player.png');
        game.load.image('star', 'assets/star.png');
    }

    var asteroid = [];
    //var amountOfAsteroids = 0;
    var gameIsOver;
    var player;
    var cursors;
    var timer;
    var style;
    var text;

    function create() {
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.physics.arcade.gravity.y = 0;
    	
    	player = game.add.sprite(250,650, 'player');
        player.anchor.setTo( 0.5, 0.5 );
        game.physics.enable([player], Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.allowGravity = false;
        cursors = game.input.keyboard.createCursorKeys();
        timer = game.time.create(false);
        timer.loop(Phaser.Timer.SECOND/2, createAsteroid, this);
        timer.start();

        style = { font: "25px Verdana", fill: "#ffffff", align: "center" };
        text = game.add.text( game.world.centerX, 15, "Time: 0", style);
    }

    function createAsteroid(){
    	var currentAsteroid = game.add.sprite(-100,-100, 'asteroid');
    	currentAsteroid.x = Math.random()*400;
    	currentAsteroid.anchor.setTo(0.5,0.5);
    	game.physics.enable(currentAsteroid, Phaser.Physics.ARCADE);
    	currentAsteroid.body.collideWorldBounds = false;
    	currentAsteroid.body.velocity.y = 500;

    	//borrowed code
    	currentAsteroid.body.onCollide = new Phaser.Signal();
    	currentAsteroid.body.onCollide.add(gameOver, this);

    	asteroid.push(currentAsteroid);
    	//amountOfAsteroids++;
    }

    function gameOver(){
    	gameIsOver = true;
    	timer.destroy(); 
	    text.text += "\nGame Over!"
    }

    function update() {
    	for(var i = 0; i < asteroid.length; i++){
    		if(!gameIsOver){
    			game.physics.arcade.collide(player, asteroid[i]);
    		}else{
    			asteroid[i].body.velocity.y = 0;
    		}
    		if(asteroid[i].y > 800){
    			console.log(asteroid.length	);
    			asteroid.splice	(i, 1)[0].destroy();
    			i--;
    		}
    	}	

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
	    if (cursors.left.isDown){
	        player.body.velocity.x = -300;
	    }
	    else if (cursors.right.isDown){
	        player.body.velocity.x = 300;
	    }
	    if(!gameIsOver){
	        text.text = "Time: "+Math.round(timer.seconds);
    	}
    }

};
