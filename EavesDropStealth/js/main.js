"use strict";

function make_main_game_state( game )
{
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'soundCircle', 'assets/white_circle.png' );
        game.load.image( 'player', 'assets/robo.png' );
    }
    
    var player;
    var enemies;
    var enemySpawnTime = 0;
    var enemy;
    var text;
    var detectionText;
    var leftClick;
    var score = 0;
    var suspicion = 0;
    var gameHasEnded = false;
    
    function create() {
        gameHasEnded = false;
        game.physics.arcade.isPaused = false;
    	enemies = game.add.group();
    	enemies.enableBody = true;
   		enemies.physicsBodyType = Phaser.Physics.ARCADE;
    	for (var i = 0; i < 10; i++){
    		var a = enemies.create(0,0, 'soundCircle');
    		a.anchor.setTo(0.5,0.5);
    		a.exists = false;
    		a.visible = false;
    	}
    	spawnEnemy();
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        player = game.add.sprite(game.world.centerX,game.world.centerY, 'player');
        player.anchor.setTo( 0.5, 0.5 );
        player.scale.setTo(0.1,0.1);
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( player, Phaser.Physics.ARCADE );

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Courier", fill: "#ffffff", align: "center"};
        text = game.add.text( game.world.centerX, 15, "Eavesdrop without detection\nLeft Click to Pause", style );
        text.setShadow(0, 0, 'rgba(0,0,0,1)', 8);
        detectionText = game.add.text(15, 575, "", style);
        detectionText.setShadow(0, 0, 'rgba(0,0,0,1)', 8);
        text.anchor.setTo( 0.5, 0.0 );

        game.input.onDown.add(togglePause, this);
    }
    
    function update() {
    	enemies.forEach(function(item){
    		if(item.exists && !gameHasEnded && !game.physics.arcade.isPaused){
	    		if(game.physics.arcade.distanceBetween(player, item) < 100){
	    			item.tint = 0xdd3333;
	    			suspicion+= game.time.elapsed;
	    		}else if(game.physics.arcade.distanceBetween(player, item) < 200){
	    			score+=game.time.elapsed*0.01;
	    			item.tint = 0x00cc00;
	    		}else{
	    			item.tint = 0xffffff;
	    		}
	    		if(item.x > 1100 || item.x < -300){
	    			item.kill();
	    		}
    		}
    	});
        game.physics.arcade.moveToPointer( player, 120 ,game.input.activePointer, 250 );
        spawnEnemy();
        if(game.time.now > 3000 && !game.physics.arcade.isPaused){
        	text.setText('SCORE: '+ parseInt(score));
        	detectionText.setText("DETECTION: " + parseInt(suspicion) + "%")
        }
        if(suspicion >=  100){
        	gameOver()
        }else if(suspicion > 0){
        	suspicion -= game.time.elapsed*0.01; 
        }
    }

    function spawnEnemy(){
    	if(game.time.now >= enemySpawnTime){
    		enemy = enemies.getFirstExists(false);
    		if(enemy){
    			var randomizer = (Math.random());
    			if(randomizer < 0.5){
    				randomizer -= 1;
    				enemy.reset(1000, Math.random()*600);
    			}// randomizer now set to somewhere between -1 and -0.5, or between 0.5 and 1
    			else{
    				enemy.reset(-200,Math.random()*600);
    			}
    			enemy.body.velocity.x = 200*randomizer;
    			enemySpawnTime = game.time.now + 2000;
    		}
    	}
    }
    function gameOver(){
    	game.physics.arcade.isPaused = true;
    	gameHasEnded = true;
    	detectionText.setText("DETECTION: 100%");
    	text.setText("Game over!\nYour final score was "+parseInt(score));
    }

    //the following function is from an example on phaser.io
    function togglePause() {
    	if(gameHasEnded){
            //insert restartscene code here
    	}else{
    		game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
    	}
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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );
    
    game.state.add( "main", make_main_game_state( game ) );
    
    game.state.start( "main" );
};
