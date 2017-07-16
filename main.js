// Create the state that will contain the whole game
var mainState = {  
    preload: function() {  
        // Here we preload the assets
        game.load.image('enemy', 'assets/phaser-dude.png');
        game.load.audio('spawn', 'assets/plop.wav');
        game.load.audio('kill', 'assets/boom1.wav'); 
    },

    create: function() {
        // Here we create the game
        // If this is not a desktop (so it's a mobile device) 
        if (game.device.desktop == false) {
            // Set the scaling mode to SHOW_ALL to show all the game
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            // Set a minimum and maximum size for the game
            // Here the minimum is half the game size
            // And the maximum is the original game size
            game.scale.setMinMax(game.width/2, game.height/2, 
                game.width, game.height);
        }
        // Center the game horizontally and vertically
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        this.spawnAllowed = true;
        this.killAllowed = true;
        this.enemyGroup = game.add.group(); // create group

        // create enemy every 0.5s
        game.time.events.loop(250, this.randomSpawn, this);
        //game.time.events.loop(game.rnd.integerInRange(200, 800), this.createNewEnemy, this);
        
        // create sounds
        this.spawnSound = game.add.audio('spawn');
        this.killSound = game.add.audio('kill');
        
        // Add score in the top middle
        this.score = 0;
        this.labelScore = game.add.text(300, 15, "score : 0", 
            { font: "20px Arial", fill: "#ffffff" });
        this.timeLimit = 99;
        this.labelTime = game.add.text(190, 20, "99", 
            { font: "30px Arial", fill: "#ffffff" });
        
        // Create a custom timer
        this.timer = game.time.create();
        // Create a delayed event 30s from now
        this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 30, this.endTimer, this);
        // Start the timer
        this.timer.start();
    },

    update: function() {  
        // Here we update the game 60 times per second
    },
    
    render: function() {
        // If our timer is running, show the time in a nicely formatted way, else show 'Done!'
        if (this.timer.running) {
            this.labelTime.text = this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
        }
        else {
            this.labelTime.text = "";
            this.labelTime = game.add.text(120, 20, "Game Over", 
            { font: "30px Arial", fill: "#ffffff" });
            this.spawnAllowed = false;
            this.killAllowed = false;
            this.labelRestart = game.add.text(105, 230, "Click to restart", 
            { font: "30px Arial", fill: "#ffffff" });
            // Enable input on the label
            this.labelRestart.inputEnabled = true;
            // Attach a function to the input down ( click/tap)
            this.labelRestart.events.onInputDown.add(function() {
                this.game.state.start('main');
            }, this);
        }
    },
    
    endTimer: function() {
        // Stop the timer when the delayed event triggers
        this.timer.stop();
    },
    formatTime: function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return seconds.substr(-2);    
    },
    
    destroySprite: function(sprite) {
        if (this.killAllowed) {
            sprite.destroy();
            // increase score each time an enemy is destroyed
            this.score += 1;
            this.labelScore.text = "score : " + this.score;
            this.killSound.play();
        }
    },

    randomSpawn: function() {
        this.game.time.events.add(game.rnd.integerInRange(200, 800), this.createNewEnemy, this);
    },
    
    createNewEnemy: function() {
        //var mx = game.width - game.cache.getImage('enemy').width;
        //var my = game.height - game.cache.getImage('enemy').height;
        if (this.spawnAllowed) {
            var sprite = this.enemyGroup.create(game.rnd.integerInRange(0, game.width), game.rnd.integerInRange(0, game.height), 'enemy'); // add sprite to group
            sprite.inputEnabled = true;
            sprite.input.useHandCursor = true;
            sprite.events.onInputDown.add(this.destroySprite, this);
            this.spawnSound.play();
        }
    },
};

// Initialize the game and start our state
var game = new Phaser.Game(400, 490);  
game.state.add('main', mainState);  
game.state.start('main');