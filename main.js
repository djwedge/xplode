// Create the state that will contain the whole game
var mainState = {  
    preload: function() {  
        // Here we preload the assets
        game.load.image('enemy', 'assets/phaser-dude.png');
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
        this.enemyGroup = game.add.group(); // create group

        //time = this.game.time.create(false);
        game.time.events.loop(500, this.createNewEnemy, this);
    },

    update: function() {  
        // Here we update the game 60 times per second
    },
    
    destroySprite: function(sprite) {
        sprite.destroy();
    },

    createNewEnemy: function() {
        //var mx = game.width - game.cache.getImage('enemy').width;
        //var my = game.height - game.cache.getImage('enemy').height;
        if (this.spawnAllowed) {
            var sprite = this.enemyGroup.create(game.rnd.integerInRange(0, game.width), game.rnd.integerInRange(0, game.height), 'enemy'); // add sprite to group
            sprite.inputEnabled = true;
            sprite.input.useHandCursor = true;
            sprite.events.onInputDown.add(this.destroySprite, this);
        }
    },
};

// Initialize the game and start our state
var game = new Phaser.Game(400, 490);  
game.state.add('main', mainState);  
game.state.start('main');