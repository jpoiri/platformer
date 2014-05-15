game.MushroomEntity = me.CollectableEntity.extend({

    init: function(x, y, settings) {
	
	//call parent constructor.
	this.parent(x, y, settings);
	
	//set the entity has collidable
	this.collidable = true;
	
	this.color = settings.color;
	
	if (this.color == null) {
	    this.color = "red";
	}
    
	//load animation from texture atlas.
	this.loadTexture();	
    },
    
    loadTexture: function() {
	
	//create a new texture atlas
	this.texture = new me.TextureAtlas(
	    me.loader.getJSON("mushroom_spritesheet"),
	    me.loader.getImage("mushroom_spritesheet")
	);
	
	//create animation from texture atlas
	this.renderable = this.texture.createAnimationFromName([
	    "mushroomBrown.png",
	    "mushroomRed.png"
	]);
	
	if (this.color == "red") {
	    this.renderable.addAnimation("mushroom", [0]);
	} else if (this.color == "brown") {
	    this.renderable.addAnimation("mushroom", [1]);
	}

	this.renderable.setCurrentAnimation("mushroom");
	
	// set the renderable position to bottom center
	this.anchorPoint.set(0.5, 1.0);
    },
    
    onCollision: function(res, obj) {
	
	//remove from world.
	me.game.world.removeChild(this);
    }
})

