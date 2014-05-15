game.PlayerEntity = me.ObjectEntity.extend({
   
    init: function(x, y, settings) {
	
	//call parent constructor
	this.parent(x, y, settings);

	//create a new texture atlas.
	this.texture = new me.TextureAtlas(
	    me.loader.getJSON("player1_spritesheet"),
	    me.loader.getImage("player1_spritesheet")
	);
	
	//
	this.renderable = this.texture.createAnimationFromName([
								
	    "p1_walk01.png", "p1_walk02.png", "p1_walk03.png", "p1_walk04.png", "p1_walk05.png",
	    "p1_walk06.png", "p1_walk07.png", "p1_walk08.png", "p1_walk09.png", "p1_walk10.png",
	    "p1_walk11.png", "p1_duck.png", "p1_front.png", "p1_hurt.png", "p1_jump.png", "p1_stand.png",
	    "alienGreen_climb1.png", "alienGreen_climb2.png", "alienGreen_swim1.png",
	    "alienGreen_swim2.png", "alienGreen_walk1.png", "alienGreen_walk2.png"
	]);
	
	this.renderable.addAnimation("walk", [5, 6, 7, 8]);
	this.renderable.addAnimation("jump", [14]);
	this.renderable.addAnimation("crouch", [11]);
	this.renderable.addAnimation("stand", [15]);
	this.renderable.addAnimation("hurt", [13]);
	this.renderable.addAnimation("swim",  [18, 19]);
	
	this.renderable.setCurrentAnimation("stand");
	
	// set the renderable position to bottom center
	this.anchorPoint.set(0.5, 1.0);
	
	this.updateColRect(5, 58, -1, 0);
	
	this.crouch = false;
	this.collidable = true;
	
	//follow the viewport on both axis.
	me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },

    update: function() {
    
	if (me.input.isKeyPressed("run")) {
	    this.setVelocity(7, 23);
	} else {
	    this.setVelocity(4, 23);
	}
	
	if (me.input.isKeyPressed("left")) {
	    
	    if (!me.input.isKeyPressed("down")) {
	    
		this.vel.x -= this.accel.x * me.timer.tick;
		
		if (!this.falling && !this.jumping) {
		    this.setAnimation("walk");
		}
		
	    } else {
		
		this.vel.x = 0;
		this.setAnimation("crouch");
	    }
	    
	    this.flipX(true);
	    
	} else if (me.input.isKeyPressed("right")) {
	    
	    if (!me.input.isKeyPressed("down")) {
		
		this.vel.x += this.accel.x * me.timer.tick;
		
		if (!this.falling && !this.jumping) {
		   this.setAnimation("walk");
		}
		
	    } else {
		
		this.vel.x = 0;
		this.setAnimation("crouch");
	    }
	    
	     this.flipX(false);
	     
	} else if (me.input.isKeyPressed("down")) {
	    
	    this.setAnimation("crouch");
	    
	} else {
	
	    this.setAnimation("stand");
	    this.vel.x = 0;
	}

	if (me.input.isKeyPressed('jump')) {
	    
            // make sure we are not already jumping or falling
            if (!this.jumping && !this.falling) {
		
		this.setAnimation("jump");

                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
            }
        }
	
	var res = me.game.collide(this);
	
	console.log("player collision" + res);
    
        // check & update player movement
        this.updateMovement();
	
	var res = me.game.collide(this);
 
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
         
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
	
    },
    
    setAnimation: function(animationName) {
	if (!this.renderable.isCurrentAnimation(animationName)) {
	    this.renderable.setCurrentAnimation(animationName);
	}
    },
    
    
    setInvincible: function(flickerTime) {
	
	this.invincible = true;
	this.vel.x = 7
	
	var obj = this;
	
	this.renderable.flicker(flickerTime, function() {
	   obj.invincible = false;
	});
    }
    
    
    
});