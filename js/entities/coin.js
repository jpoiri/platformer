game.CoinEntity = me.CollectableEntity.extend({

    init: function(x, y, settings) {
	
	this.parent(x, y, settings);
	this.color = settings.color;
	this.value = settings.value;
    
	if (this.value == null) {
	    this.value = 1;
	}
	
	if (this.color == null) {
	    this.color = "gold";
	}

	this.initAnimation();
	this.collidable = true;
    },
    
    initAnimation: function() {
	
	//create a new texture atlas
	this.texture = new me.TextureAtlas(
	    me.loader.getJSON("coin_spritesheet"),
	    me.loader.getImage("coin_spritesheet")
	);
	
	//create animation from texture atlas
	this.renderable = this.texture.createAnimationFromName([
	    "coinBronze.png",
	    "coinSilver.png",
	    "coinGold.png"
	]);
	
	//check the tiled settings to know witch color to create.
	if (this.color == "bronze") {
	    this.renderable.addAnimation("coin", [0]);
	} else if (this.color == "silver") {
	    this.renderable.addAnimation("coin", [1]);
	} else if (this.color == "gold") {
	    this.renderable.addAnimation("coin", [2]);
	}
	
	this.renderable.setCurrentAnimation("coin");
	
	// set the renderable position to bottom center
	this.anchorPoint.set(0.5, 1.0);
    },
    
    onCollision: function(res, obj) {
	
	game.addCoin(this.value);
	
	//remove from world.
	me.game.world.removeChild(this);
    }
    
    
    
})

