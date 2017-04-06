Eavesdrop.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
	this.startButton = null;
	this.text = null;

};

Eavesdrop.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.loopFull();
		this.music.play();

		//this.add.sprite(this.world.centerX,this.world.centerY, 'player');
		startButton = this.add.sprite(this.world.centerX, 800, 'player');
		startButton.anchor.setTo( 0.5, 0.5 );
        //startButton.scale.setTo(0.1,0.1);
		startButton.inputEnabled = true;
		startButton.events.onInputDown.addOnce(this.startGame, this);

		var style = { font: "25px Courier", fill: "#ffffff", align: "left"};
		text = this.add.text(15, 15, "Your brakes don't work!\nHit obstacles to stop yourself.\n\nControl with Arrow Keys\nArrow Keys to start", style );
        text.setShadow(0, 0, 'rgba(0,0,0,1)', 8);

	},

	update: function () {

		if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        	this.state.start('main');
    	}
   		else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
	        this.state.start('main');

	    }

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('main');

	}

};
