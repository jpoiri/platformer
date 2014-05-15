game.FireBallEntity = me.CollectableEntity.extend({

    init: function(x, y, settings) {
	
	//call parent constructor.
	this.parent(x, y, settings);
	
	//set the entity has collidable
	this.collidable = true;
	
	//load animation from texture atlas.
	this.loadTexture();	
    },
    
    loadTexture: function() {
	
	//create a new texture atlas
	this.texture = new me.TextureAtlas(
	    me.loader.getJSON("fireball_spritesheet"),
	    me.loader.getImage("fireball_spritesheet")
	);
	
	//create animation from texture atlas
	this.renderable = this.texture.createAnimationFromName([
	    "fireball.png",
	]);
	
	this.renderable.addAnimation("fireball", [0]);
	this.renderable.setCurrentAnimation("fireball");
	
	// set the renderable position to bottom center
	this.anchorPoint.set(0.5, 1.0);
    },
    
    onCollision: function(res, obj) {
	
	//remove from world.
	me.game.world.removeChild(this);
    }
})

