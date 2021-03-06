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
	this.lives = 3;
	
	this.crouch = false;
	this.collidable = true;
	this.alwaysUpdate = true;
	
	//get access to background layer on the tile map.
	this.backgroundLayer = me.game.currentLevel.getLayerByName("Background");
	
	//follow the viewport on both axis.
	me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },

    update: function(delta) {
    
	if (me.input.isKeyPressed("run")) {
	    this.setVelocity(7, 21);
	} else {
	    this.setVelocity(4, 21);
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
	
	    if (!this.hurting) {
		this.setAnimation("stand");
	    }
	    
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
	
	this.updateMovement();
	
	//Pit logic.	
	if (!this.inViewport && this.pos.y > me.game.viewport.getHeight()) {
	    this.die();
	    return true;
	}
	
	//Logic to check if player landing on fire or water
	var tile = this.backgroundLayer.layerData[~~(this.pos.x / this.backgroundLayer.tilewidth)][~~(this.pos.y / this.backgroundLayer.tileheight)];           
    
	if (tile != null) {
	    
	    var tileProperties = this.backgroundLayer.tileset.getTileProperties(tile.tileId);
	    
	    if (tileProperties != null
		    && tileProperties.hurt != null
		    && tileProperties.hurt) {

		this.hurt();
                this.vel.y = -this.maxVel.y * me.timer.tick;
		return true;
	    }
	}

	//check if the player had collided with object. 
	var res = me.game.world.collide(this);
	
	if (res != null) {
	    
	    switch (res.type) {
		
		case "block":
		    
		    this.onBlockCollision(res);
		    break;
		
		case "platform":
		    
		    this.onPlatformCollision(res);
		    break;
	    }
	}

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent(delta);
            return true;
        }
         
        return false;
    },
    
    onBlockCollision: function(res) {
	
	this.pos.x -= res.x;
        this.pos.y -= res.y;
	
        if (res.x) {
	    this.vel.x = 0;
	}
        
	if (res.y) {
	    this.vel.y = 0;
	}
	    
	if (res.y > 0) {
	    
	    this.falling = false;
	    this.jumping = false;
	}
    },
    
    onPlatformCollision: function(res) {
	
	
	this.pos.x -= res.x;
        this.pos.y -= res.y;
	
        if (res.x) {
	    this.vel.x = 0;
	}
        
	if (res.y) {
	    this.vel.y = 0;
	}
	    
	if (res.y > 0) {
	    
	    this.falling = false;
	    this.jumping = false;
			
	}
	
	if (game.collision.isBottomCollision(res)) {
		
	    switch(res.obj.direction) {
	    
		case "left":
	    
		    this.pos.x -= res.obj.accel.x * me.timer.tick
		    me.game.world.collide(this);
		    break;
	    
		case "right":

		    this.pos.x += res.obj.accel.x * me.timer.tick
		    me.game.world.collide(this);
		    break;
	    
		case "up":
		    
		    me.game.world.collide(this);
		    break;
	    
		case "down":
		
		    this.vel.y += res.obj.accel.y * me.timer.tick
		    me.game.world.collide(this);
		    break;
	    }

	} else if (game.collision.isTopCollision(res)) {
		
	    this.vel.y += this.accel.y * me.timer.tick;
	}
    },
    
    /**
     * This method is responsible to handle when the player gets hurt
     */
    hurt: function() {
	
	--this.lives;
	
	this.setAnimation("hurt");
	
	if (this.lives == 0) {
	    this.die();
	} else {
	    
	    //set the hurt flag true
	    this.hurting = true;
	    
	    //get reference to the player
	    var obj = this;
	    
	    this.renderable.flicker(500, function() {
	      obj.hurting = false;
	    }); 
	}
    },
    
    /**
     * This method is responsible to handle when the players dies.
     */
    die: function() {
	me.game.world.removeChild(this);
	me.state.change(me.state.PLAY);
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