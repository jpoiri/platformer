game.StarEntity = me.CollectableEntity.extend({

    init: function(x, y, settings) {
	
	//call parent constructor.
	this.parent(x, y, settings);
	
	//set the flicker time from the area map.
	this.flickerTime =  settings.flickerTime;
	
	//if no flicker time set default to 500 milliseconds.
	if (this.flickerTime == null) {
	    this.flickerTime = 500;
	}
	
	//set the entity has collidable
	this.collidable = true;
	
	//load animation from texture atlas.
	this.loadTexture();
    },
    
    loadTexture: function() {
	
	//create a new texture atlas
	this.texture = new me.TextureAtlas(
	    me.loader.getJSON("star_spritesheet"),
	    me.loader.getImage("star_spritesheet")
	);
	
	//create animation from texture atlas
	this.renderable = this.texture.createAnimationFromName([
	    "star.png"
	]);
	
	this.renderable.addAnimation("star", [0]);
	this.renderable.setCurrentAnimation("star");
	
	// set the renderable position to bottom center
	this.anchorPoint.set(0.5, 1.0);
    },
    
    onCollision: function(res, obj) {
	
	//remove from world.
	me.game.world.removeChild(this);
	
	//set the object invincible.
	obj.setInvincible(this.flickerTime);
    }
})

