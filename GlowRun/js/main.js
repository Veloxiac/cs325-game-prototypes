"use strict";

function make_main_game_state( game )
{
    function preload() {
        // Load an image and call it 'logo'.
    }
    
    var player;
    var obstacles;
    var obstacleSpawnTime = 0;
    var timeTillRoadSpawn = 0;
    var obstacle;
    var detectionText;
    var timerText;
    var timeLeft = 0;
    var gameHasEnded = false;
    var jumpPressedLastFrame=false;
    var grounded =false;
    
    function create() {
        var background = game.add.sprite(game.world.centerX-50,game.world.centerY, 'background');
        background.anchor.setTo(0.3,0.5);
        background.scale.setTo(1,1);
        game.physics.arcade.gravity.y = 1500;
        game.physics.arcade.isPaused = false;
    	obstacles = game.add.group();
    	obstacles.enableBody = true;
   		obstacles.physicsBodyType = Phaser.Physics.ARCADE;
   		

    	for (var i = 0; i < 10; i++){
    		var a = obstacles.create(0,0, 'obstacle');
    		a.anchor.setTo(0.5,0.5);
    		a.exists = false;
    		a.visible = false;
    		a.scale.setTo(0.5,0.5);
    		a.body.bounce.setTo(1,1);
            a.body.allowGravity = false;
                    a.body.immovable = true;
    	}
        var b = obstacles.create(game.world.centerX,500, 'obstacle');
        b.anchor.setTo(0.5,0.5);
        b.scale.setTo(8,0.25);
        b.allowGravity = false;
        b.body.immovable = true;
        b.body.moves =false;


    	spawnObstacle();
        player = game.add.sprite(100,250, 'player');
        player.scale.setTo(1.5,1.5);
        player.anchor.setTo( 0.5, 0.5 );
        game.physics.enable( player, Phaser.Physics.ARCADE );
        player.body.offset.setTo(500,500);
        player.body.setSize(20 ,35);
        player.body.allowGravity = true;

        var style = { font: "100px Impact", fill: "#000000", align: "center"};
        timerText = game.add.text(game.world.centerX, 20, "30", style);
        timerText.setShadow(0, 0, '#ffffff', 8);
        timerText.anchor.setTo(0.5,0);

        player.body.onCollide = new Phaser.Signal();
    	player.body.onCollide.add(hitObstacle, this);
    	player.body.collideWorldBounds = true;
    }
    
    function update() {
        player.x =100;
    	game.physics.arcade.collide(player, obstacles);
    	timeLeft += game.time.elapsed *0.001;
        timerText.setText(parseInt(timeLeft));
        if(player.body.blocked.left){
            
        }else if(player.body.touching.right){
            gameOver();
        }else if(player.body.touching.down){
            console.log("yo");
            player.body.immovable= true;
            player.body.moves=false;
        }else{
            player.body.immovable= false;
            player.body.moves=true;
        }
        spawnObstacle();

        obstacles.forEach(function(item){
            if(item.exists && !gameHasEnded && !game.physics.arcade.isPaused){
                if(item.x < -100){
                    item.kill();
                }
            }
        });

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            if(!jumpPressedLastFrame && grounded){
                player.body.immovable= false;
                player.body.moves=true;
                player.body.velocity.y = -1000;
                //player.body.velocity.x = 300;
                jumpPressedLastFrame =true;
                grounded =false;
            }
        }else{
            jumpPressedLastFrame = false;
        }
    }

    function spawnObstacle(){
    	if(game.time.now >= obstacleSpawnTime){
    		obstacle = obstacles.getFirstExists(false);
    		if(obstacle){
    			obstacle.reset(1200, 500-Math.random()*50);
    			obstacle.body.velocity.x = -300;
                var y =Math.random()*2+1;
                var x =Math.random()*2+1;
                obstacle.scale.setTo(x,y);
    			obstacleSpawnTime = game.time.now + 100+Math.random()*1000;
    		}
    	}
    }
    function hitObstacle(sprite1, sprite2){
        grounded= true;
    }
    function gameOver(){
        timerText.setText("Game Over!\nFinal Score: "+parseInt(timeLeft));

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
    
    var game = new Phaser.Game( 700, 500, Phaser.AUTO, 'game' );

    game.state.add("Boot", Eavesdrop.Boot);

    game.state.add('Preloader', Eavesdrop.Preloader);

    game.state.add('MainMenu', Eavesdrop.MainMenu);
    
    game.state.add( "main", make_main_game_state( game ) );
    
    game.state.start( "Boot" );
};
