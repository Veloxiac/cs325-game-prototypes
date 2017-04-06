"use strict";

function make_main_game_state( game )
{
    function preload() {
        // Load an image and call it 'logo'.
    }
    
    var player;
    var obstacles;
    var obstacleSpawnTime = 0;
    var obstacle;
    var endObstacle;
    var detectionText;
    var timerText;
    var speed = 80;
    var timeLeft = 80;
    var gameHasEnded = false;
    
    function create() {
    	timeLeft = 100;
        gameHasEnded = false;
        game.physics.arcade.isPaused = false;
    	obstacles = game.add.group();
    	obstacles.enableBody = true;
   		obstacles.physicsBodyType = Phaser.Physics.ARCADE;
    	for (var i = 0; i < 10; i++){
    		var a = obstacles.create(0,0, 'soundCircle');
    		a.anchor.setTo(0.5,0.5);
    		a.exists = false;
    		a.visible = false;
    		a.scale.setTo(0.5,0.5);
    		a.body.customSeparateX = true;
    		a.body.customSeparateY = true;
    		a.body.setSize(230,85);
    	}
    	endObstacle = game.add.sprite(game.world.centerX,-300, 'avoid');
    	endObstacle.anchor.setTo( 0.5, 0.5 );
    	game.physics.enable( endObstacle, Phaser.Physics.ARCADE );
    	spawnObstacle();
        player = game.add.sprite(game.world.centerX,800, 'player');
        player.anchor.setTo( 0.5, 0.5 );
        game.physics.enable( player, Phaser.Physics.ARCADE );

        var style = { font: "25px Courier", fill: "#ffffff", align: "center"};
        detectionText = game.add.text(15, 850, "", style);
        detectionText.setShadow(0, 0, 'rgba(0,0,0,1)', 8);
        style = { font: "50px Courier", fill: "#ffffff", align: "center"};
        timerText = game.add.text(15, 15, "30", style);
        timerText.setShadow(0, 0, 'rgba(0,0,0,1)', 8);

        player.body.onCollide = new Phaser.Signal();
    	player.body.onCollide.add(hitObstacle, this);
    	player.body.collideWorldBounds = true;
    }
    
    function update() {
    	game.physics.arcade.collide(player, obstacles);
    	game.physics.arcade.collide(player, endObstacle);
    	timeLeft -= game.time.elapsed *0.001 * speed;
    	if(timeLeft>= 0){

    		timerText.setText(parseInt(timeLeft));
    	}
    	obstacles.forEach(function(item){
    		if(item.exists && !gameHasEnded && !game.physics.arcade.isPaused){
	    		if(item.y > 1100){
	    			item.kill();
	    		}
	    		item.body.velocity.y = speed * 20;
    		}
    	});
        spawnObstacle();
       	detectionText.setText("SPEED: " + parseInt(speed))
        if(timeLeft <= 0){
        	endObstacle.body.velocity.y = speed*20;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        	player.body.velocity.x = -5*speed;
    	}
   		else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
	        player.body.velocity.x = 5*speed;

	    }
	    if(speed <= 0){
	    	timerText.setText("You Win!");
    		gameOver();
	    }
    }

    function spawnObstacle(){
    	if(game.time.now >= obstacleSpawnTime){
    		obstacle = obstacles.getFirstExists(false);
    		if(obstacle){
    			obstacle.reset(Math.random()*500, -20);
    			obstacle.body.velocity.y = speed*10;
    			obstacleSpawnTime = game.time.now + 3000/ ((speed > 0 ? speed : 1)/10);
    		}
    	}
    }
    function hitObstacle(sprite1, sprite2){
    	if(sprite2 === endObstacle){
    		timerText.setText("You Failed!");
    		gameOver();
    	}else{
    		speed -= 10;
    		sprite2.kill();
    	}

    }
    function gameOver(){
    	game.paused = true;
    	gameHasEnded = true;
    }
    
    return { "preload": preload, "create": create, "update": update };
}


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
    
    var game = new Phaser.Game( 500, 900, Phaser.AUTO, 'game' );

    game.state.add("Boot", Eavesdrop.Boot);

    game.state.add('Preloader', Eavesdrop.Preloader);

    game.state.add('MainMenu', Eavesdrop.MainMenu);
    
    game.state.add( "main", make_main_game_state( game ) );
    
    game.state.start( "Boot" );
};
