"use strict";

function make_main_game_state( game )
{
    function preload() {
        // Load an image and call it 'logo'.
    }
    
    var player;
    var obstacles;
    var roadTiles;
    var obstacleSpawnTime = 0;
    var timeTillRoadSpawn = 0;
    var obstacle;
    var fakeObstacle;
    var endObstacle;
    var detectionText;
    var timerText;
    var speed = 80;
    var timeLeft = 225;
    var gameHasEnded = false;
    
    function create() {
        game.physics.arcade.isPaused = false;
        roadTiles = game.add.group();
   		roadTiles.enableBody = true;
    	obstacles = game.add.group();
    	obstacles.enableBody = true;
   		obstacles.physicsBodyType = Phaser.Physics.ARCADE;
   		

    	for (var i = 0; i < 10; i++){
    		var a = obstacles.create(0,0, 'obstacle');
    		a.anchor.setTo(0.5,0.5);
    		a.exists = false;
    		a.visible = false;
    		a.scale.setTo(0.5,0.5);
    		a.body.setSize(230,85);
    		a.body.bounce.setTo(1,1);
    		var b= roadTiles.create(0,0,'roadTile');
    		b.anchor.setTo(0.5,0.5);
    		b.scale.setTo(0.75,0.75);
    		b.visible = true;
    		b.reset(game.world.centerX,i*0.75*650-300);
    		b.body.velocity.y = speed*20;
    	}
    	endObstacle = game.add.sprite(game.world.centerX,-300, 'avoid');
    	endObstacle.anchor.setTo( 0.5, 0.5 );
    	game.physics.enable( endObstacle, Phaser.Physics.ARCADE );


    	spawnObstacle();
        player = game.add.sprite(game.world.centerX,800, 'player');
        player.anchor.setTo( 0.5, 0.5 );
        game.physics.enable( player, Phaser.Physics.ARCADE );
        player.body.immovable = true;

        fakeObstacle = game.add.sprite(game.world.centerX,1300, 'obstacle');
   		game.physics.enable(fakeObstacle, Phaser.Physics.ARCADE );
   		fakeObstacle.body.allowGravity = true;
   		fakeObstacle.body.velocity.y= -200;
   		fakeObstacle.scale.setTo(0.55,0.55);
   		fakeObstacle.anchor.setTo(0.5,0.5);

        var style = { font: "50px Impact", fill: "#000000", align: "center"};
        detectionText = game.add.text(15, 840, "", style);
        detectionText.setShadow(0, 0, '#ffffff', 8);
        style = { font: "100px Impact", fill: "#000000", align: "center"};
        timerText = game.add.text(game.world.centerX, 20, "30", style);
        timerText.setShadow(0, 0, '#ffffff', 8);
        timerText.anchor.setTo(0.5,0);

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
        spawnObstacle();
        spawnTile();
       	detectionText.setText("SPEED: " + parseInt(speed))
        obstacles.forEach(function(item){
            if(item.exists && !gameHasEnded && !game.physics.arcade.isPaused){
                if(item.y > 1100){
                    item.kill();
                }if(item.y < 750){
                    item.body.velocity.y = speed * 20;
                }
            }
        });
        roadTiles.forEach(function(tile){
            if(tile.exists && !gameHasEnded && !game.physics.arcade.isPaused){
                if(tile.y > 1300){
                    tile.kill();
                }
                tile.body.velocity.y = speed * 20;
            }
        });
        if(timeLeft <= 0){
            endObstacle.body.velocity.y = 0;
            player.body.velocity.y = -speed*20;
            obstacles.forEach(function(item){
                if(item.exists && !gameHasEnded && !game.physics.arcade.isPaused){

                        item.body.velocity.y = 0;
                }
            });
            roadTiles.forEach(function(tile){
                if(tile.exists && !gameHasEnded && !game.physics.arcade.isPaused){
                    tile.body.velocity.y = 0;
                }
            });
        }else if (timeLeft < 25){
            endObstacle.body.velocity.y = speed*20;

        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        	player.body.velocity.x = -5*speed;
    	}
   		else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
	        player.body.velocity.x = 5*speed;

	    }
	    if(speed <= 0){
	    	timerText.setText("You\nWin!");
    		gameOver();
	    }
    }

    function spawnObstacle(){
    	if(game.time.now >= obstacleSpawnTime){
    		obstacle = obstacles.getFirstExists(false);
    		if(obstacle){
    			obstacle.reset(Math.random()*500, -20);
    			obstacle.body.velocity.y = speed*10;
    			obstacleSpawnTime = game.time.now + 2400/ ((speed > 0 ? speed : 1)/10);
    		}
    	}
    }
    function spawnTile(){
    	if(timeTillRoadSpawn <= 0){
    		var roadTile = roadTiles.getFirstExists(false);
    		if(roadTile){
    			roadTile.reset(game.world.centerX, -650*(0.75/2));
    			roadTile.body.velocity.y = speed*20;
    			timeTillRoadSpawn = (650*(0.75/2))/(speed*20) ;
    		}
    	}
    	timeTillRoadSpawn -= game.time.elapsed*speed*20;
    }
    function hitObstacle(sprite1, sprite2){
    	if(sprite2 === endObstacle){
    		timerText.setText("You\nFailed!");
    		gameOver();
    	}else{
    		speed -= 10;
    		var vel = sprite1.x - sprite2.x;
    		fakeObstacle.x = sprite2.x;
    		fakeObstacle.y = sprite2.y-150;
    		sprite2.kill();
    		fakeObstacle.body.velocity.y = -speed*10;
    		fakeObstacle.body.velocity.x = -vel*10;
    		fakeObstacle.body.gravity.y = 5000;
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
