
game.PlatformEntity = me.ObjectEntity.extend({

    init: function(x, y, settings) {
	this.parent(x, y, settings);
	
	//create a new texture atlas
	this.texture = new me.TextureAtlas(
	    me.loader.getJSON("platform_spritesheet"),
	    me.loader.getImage("platform_spritesheet")
	);
	
	this.type = settings.type;
	this.terrain = settings.terrain != null ? settings.terrain : "brick";
	this.velocity = settings.velocity != null ? settings.velocity : 3;
	this.offsetX = settings.offset != null ? settings.offset : 300;
	this.offsetY = settings.offset != null  ? settings.offset: 300;
	this.direction = settings.direction != null ? settings.direction :  "right";
	this.gravity = 0;
	
		//create animation from texture atlas
	this.renderable = this.texture.createAnimationFromName([
	     this.terrain + ".png"
	]);
	
	this.anchorPoint.set(0.5, 1.0);
	this.renderable.addAnimation("animation", [0]);
	this.renderable.setCurrentAnimation("animation");
	this.alwaysUpdate = true;

	
	switch(this.direction) {
	    
	    case "left":
		
		this.startX = this.pos.x;
		this.endX = this.pos.x - this.offsetX;
		this.setVelocity(this.velocity, 1);
		break;
	    
	    case "right":
		
		this.startX = this.pos.x;
		this.endX = this.pos.x + this.offsetX;
		this.setVelocity(this.velocity, 1);
		break;
	    
	    case "up":
		
		this.startY = this.pos.y;
		this.endY = this.pos.y - this.offsetY;
		this.setVelocity(1, this.velocity);
		break;
	    
	    case "down":
		
		this.startY = this.pos.y;
		this.endY = this.pos.y + this.offsetY;
		this.setVelocity(1, this.velocity);
		break;
	}
	
	
	this.collidable = true;
    },
    
    update: function(delta) {
	
	//right case
	if (this.startX <= this.endX) {
	   
	   if (this.direction == "right" && this.pos.x >= this.endX) {  
		this.direction = "left";
	   } else  if (this.direction == "left" && this.pos.x <= this.startX) {
		this.direction = "right";
	   }
	
	//left case    
	} else if (this.startX >= this.endX) {
	    
	    if (this.direction == "left" && this.pos.x <= this.endX) {
		this.direction = "right";
	    } else if (this.direction == "right" && this.pos.x >= this.startX) {
		this.direction = "left";
	    }
	 
	//up case   
	} else if (this.startY >= this.endY) {
	    
	    if (this.direction == "up" && this.pos.y <= this.endY) {
		this.direction = "down";
	    } else if (this.direction == "down" && this.pos.y >= this.startY) {
		this.direction = "up";
	    }
	
	//down case    
	} else if (this.startY <= this.endY) {
	    
	    if (this.direction == "down" && this.pos.y >= this.endY) {
		this.direction = "up";
	    } else if (this.direction == "up" && this.pos.y <= this.startY) {
		this.direction = "down";
	    }
	}
	
	switch(this.direction) {
	    
	    case "left":
		
		this.vel.x -= this.accel.x * me.timer.tick;
		break;
	    
	    case "right":
		
		this.vel.x += this.accel.x * me.timer.tick;
		break;
	    
	    case "up":
		
		this.vel.y -= this.accel.y * me.timer.tick;
		break;
	    
	    case "down":
		
		this.vel.y += this.accel.y * me.timer.tick;
		break;
	}
    
	this.updateMovement();
	
        if (this.vel.x!=0 || this.vel.y!=0) {
	    
            this.parent(delta);
            return true;
        }
	
	return false;
    },    
})

