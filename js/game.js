
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		coins: 0,
		lives: 3,
		gems: 0,
		
	},
	
	addCoin: function(coin) {
		
		this.data.coins += coin;
		
		console.log("coins:" + this.data.coins);
		
		if (this.data.coins == 100) {
			
		   this.data.lives++;
		   this.data.coins = 0;
		   
		   console.log("lives:" + this.data.lives);
		   console.log("coins:" + this.data.coins);
		}
	},
	
	addGem: function(gem) {
		
		this.data.gems += gem;
		
		console.log("gems:" + this.data.gems);
		
		if (this.data.gems == 100) {
			
		   this.data.lives++;
		   this.data.gems = 0;
		   
		   console.log("lives:" + this.data.lives);
		   console.log("gems:" + this.data.gems);
		}
	},
	
	
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	if (!me.video.init("screen", 1024, 728, true)) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(debugPanel, "debug");
		});
	}

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
		
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		
		// add our player entity in the entity pool
		me.entityPool.add("player", game.PlayerEntity);
		me.entityPool.add("block", game.BlockEntity);
		me.entityPool.add("coin", game.CoinEntity);
		me.entityPool.add("gem", game.GemEntity);
		me.entityPool.add("star", game.StarEntity);
		me.entityPool.add("mushroom", game.MushroomEntity);
		me.entityPool.add("fireball", game.FireBallEntity);
		me.entityPool.add("platform", game.PlatformEntity);
             
		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,  "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.DOWN, "down");
		me.input.bindKey(me.input.KEY.Z, "run");
		me.input.bindKey(me.input.KEY.X,  "jump", true);
      
		// Start the game.
		me.state.change(me.state.PLAY);
		
		me.debug.renderHitBox = true;
		me.plugin.register(debugPanel, "debug");
	}
};
