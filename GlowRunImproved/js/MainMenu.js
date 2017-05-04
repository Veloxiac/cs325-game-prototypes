Eavesdrop.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
	this.startButton = null;
	this.text = null;
	this.background = null

};

Eavesdrop.MainMenu.prototype = {


	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.loopFull();
		this.music.play();
	        background= this.add.sprite(this.world.centerX,this.world.centerY, 'background');
	    	background.anchor.setTo(2, 2 );
	    	background.scale.setTo(0.75,0.75);

		//this.add.sprite(this.world.centerX,this.world.centerY, 'player');
		startButton = this.add.sprite(this.world.centerX, 800, 'player');
		startButton.anchor.setTo( 0.5, 0.5 );
        //startButton.scale.setTo(0.1,0.1);
		startButton.inputEnabled = true;
		startButton.events.onInputDown.addOnce(this.startGame, this);

		var style = { font: "40px Impact", fill: "#000000", align: "left"};
		text = this.add.text(15, 15, "It's dark, but you glow\nJump over Obstacles as you see them.\nRight Arrow = Dash\nYou can only Dash once every 2 seconds\nUp Arrow = Jump\nHold jump to jump higher.\n\nJump to start", style );
        text.setShadow(0, 0, '#ffffff', 8);



	},

	update: function () {

		if (this.input.keyboard.isDown(Phaser.Keyboard.UP)){
        	this.state.start('main');
    	}

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();
5
		//	And start the actual game
		this.state.start('main');

	}

};
