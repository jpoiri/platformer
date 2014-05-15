
game.PlatformEntity = game.SolidEntity.extend({

    init: function(x, y, settings) {
	this.parent(x, y, settings);
	
	//create a new texture atlas
	this.texture = new me.TextureAtlas(
	    me.loader.getJSON("block_spritesheet"),
	    me.loader.getImage("block_spritesheet")
	);
	
	//create animation from texture atlas
	this.renderable = this.texture.createAnimationFromName([
	     "brickWall.png"
	]);
	
	// set the renderable position to bottom center
	this.anchorPoint.set(0.5, 1.0);
	this.renderable.addAnimation("animation", [0]);
	this.renderable.setCurrentAnimation("animation");
	
	this.vertical = false;
	this.offsetX = 300;
	this.offsetY = 300;
	
	if (this.vertical) {
	    this.setVelocity(0, 3);
	} else {
	    this.setVelocity(3, 0);
	}
	
    	this.startY =  this.pos.y;
	this.endY = this.pos.y - this.offsetY;
	this.startX = this.pos.x;
	this.endX = this.pos.x + this.offsetX;
	
	this.collidable = true;

	//this.moveUp = true;
    },
    
    update: function() {

	var res = null;
    
	if (this.vertical) {
	    
	    
	    if (this.moveUp && this.pos.y <= this.endY) {
		this.moveUp = false;
	    } else if (!this.moveUp && (this.pos.y + this.height) >= this.startY) {
		this.moveUp = true;
	    }
	
	    if (this.moveUp) {
		this.vel.y += this.accel.x * me.timer.tick;
	    } else {
		this.vel.y -= this.accel.x * me.timer.tick;
	    }
	  
	} else {

	    if (this.moveRight && this.pos.x >= this.endX) {
		this.moveRight = false;
	    } else if (!this.moveRight && (this.pos.x + this.width) <= this.startX) {
		this.moveRight = true;
	    }
	
	    if (this.moveRight) {
		
		this.vel.x += this.accel.x * me.timer.tick;
		
	    } else {

		this.vel.x -= this.accel.x * me.timer.tick;
	    }
	}

	this.updateMovement();
	
        if (this.vel.x!=0 || this.vel.y!=0) {
	    
            this.parent();
            return true;
        }
	
	return false;
    },

    onCollision: function(res, obj) {
	this.parent(res, obj);
    }
    
})
