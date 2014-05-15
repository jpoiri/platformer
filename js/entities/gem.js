game.GemEntity = me.CollectableEntity.extend({

    init: function(x, y, settings) {
	
	this.parent(x, y, settings);
	this.color = settings.color;
	this.value = settings.value;
    
	if (this.value == null) {
	    this.value = 5;
	}
	
	if (this.color == null) {
	    this.color = "red";
	}

	this.initAnimation();
	this.collidable = true;
    },
    
    initAnimation: function() {
	
	//create a new texture atlas
	this.texture = new me.TextureAtlas(
	    me.loader.getJSON("gem_spritesheet"),
	    me.loader.getImage("gem_spritesheet")
	);
	
	//create animation from texture atlas
	this.renderable = this.texture.createAnimationFromName([
	    "gemBlue.png",
	    "gemRed.png",
	    "gemGreen.png",
	    "gemYellow.png"
	]);
	
	//check the tiled settings to know witch color to create.
	if (this.color == "blue") {
	    this.renderable.addAnimation("gem", [0]);
	} else if (this.color == "red") {
	    this.renderable.addAnimation("gem", [1]);
	} else if (this.color == "green") {
	    this.renderable.addAnimation("gem", [2]);
	} else if (this.color == "yellow") {
	    this.renderable.addAnimation("gem", [3]);
	}
	
	this.renderable.setCurrentAnimation("gem");
	
	// set the renderable position to bottom center
	this.anchorPoint.set(0.5, 1.0);
    },
    
    onCollision: function(res, obj) {
	
	game.addGem(this.value);
	
	//remove from world.
	me.game.world.removeChild(this);
    }
})

