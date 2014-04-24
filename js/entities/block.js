
game.BlockEntity = me.ObjectEntity.extend({

    init: function(x, y, settings) {
	
	this.parent(x, y, settings);
	
	//create a new texture atlas
	this.texture = new me.TextureAtlas(
	    me.loader.getJSON("block_spritesheet"),
	    me.loader.getImage("block_spritesheet")
	);
	
	//create animation from texture atlas
	this.renderable = this.texture.createAnimationFromName([
	    "boxCoin.png", "boxCoin_disabled.png",
	    "boxItem.png", "boxItem_disabled.png", "brickWall.png"
	]);
	
	this.item = settings.item;
	this.flickerTime = settings.flickerTime;
	this.type = settings.type;
	this.numberOfCoins = settings.numberOfCoins;
	this.coinColor = settings.coinColor;
	this.coinValue = settings.coinValue;

	if (this.coinColor == null) {
	    this.coinColor = "gold";
	}
	
	if (this.coinValue == null) {
	    this.coinValue = 1;
	}
	
	if (this.item == null) {
	   this.item = "star";
	}
	
	if (this.flickerTime == null) {
	    this.flickerTime = 100;
	}
	
	if (this.numberOfCoins == null) {
	    this.numberOfCoins = 10;
	}
	
	if (this.type == null) {
	    this.type = "brick";
	}
	
	this.addAnimation();
	this.activate();
	
	// set the renderable position to bottom center
	this.anchorPoint.set(0.5, 1.0);
	this.collidable = true;
    },
    
    addAnimation: function() {
	
	switch(this.type) {
	    
	    case "coin":
		this.renderable.addAnimation("active", [0]);
		this.renderable.addAnimation("disabled", [1]);
		break;
	    
	    case "item":
		this.renderable.addAnimation("active", [2]);
		this.renderable.addAnimation("disabled", [3]);
		break;
	    
	    case "brick":
		this.renderable.addAnimation("active", [4]);
		break;
	}
    },
    
    spawnItem: function() {
	
	var spawnObj = null;
	
	//spawn a different object based on the item
	switch (this.item) {
	    
	    case "fireball":
		spawnObj = new game.FireBallEntity(this.pos.x  + (this.width / 2), this.pos.y + (this.height / 2), {});
		break;
	    case "star":
		spawnObj = new game.StarEntity(this.pos.x  + (this.width / 2), this.pos.y + (this.height / 2), { fickerTime: this.flickerTime});
		break;
	    case "mushroom":
		spawnObj = new game.MushroomEntity(this.pos.x  + (this.width / 2), this.pos.y + (this.height / 2), {});
		break;
	}
	
	spawnObj.z = 3;
	
	//do vertical translation for 5 seconds.
	var tween = new me.Tween(spawnObj.pos).to({ y: this.pos.y }, 500);
	
	tween.easing(me.Tween.Easing.Quadratic.Out);
	
	tween.start();
	
	this.disable();
	
	me.game.add(spawnObj);
    },
    
    activate: function() {
	
	this.state = "active";
	
	if (!this.renderable.isCurrentAnimation("active")) {
	    this.renderable.setCurrentAnimation("active");
	}
    },
    
    disable: function() {
	
	this.state = "disabled";
	
	if (!this.renderable.isCurrentAnimation("disabled")) {
	    this.renderable.setCurrentAnimation("disabled");
	}
    },
    
    spawnCoin: function() {
	
	//if the player has not spawn every coin yet
	if (this.numberOfCoins > 0) {
	    
	    //create a new coin object.
	    var spawnObj = new game.CoinEntity(this.pos.x  + (this.width / 2), this.pos.y + (this.height / 2), { color: this.coinColor, value: this.coinValue});

	    spawnObj.z = 3;
	    
	    //move the coin north for 2.5 seconds then remove it from the game.
	    var tween = new me.Tween(spawnObj.pos).to({ y: this.pos.y }, 250).onComplete(function(){
		me.game.remove(spawnObj);
	    });
	
	    tween.easing(me.Tween.Easing.Quadratic.Out);
	    tween.start();
	
	    me.game.add(spawnObj);
	    
	    //decrease the number of coins left in the block.
	    this.numberOfCoins--;
	    
	    game.addCoin(spawnObj.value);
	}
	
	if (this.numberOfCoins == 0) {
	    this.disable();
	}
	
    },

    onCollision: function(res, obj) {
	
	if (res.y < 0) {
	    
	    if (this.type == "brick") {
		
		me.game.world.removeChild(this);

	    } else {
		
		if (this.state == "active") {
		    
		    if (this.type == "coin") {
			this.spawnCoin();
		    } else if (this.type == "item") {
			this.spawnItem();
		    }  
		} 
		
	    }

	    obj.pos.y = this.pos.y +  this.height;
	    obj.vel.y = 0;
	    
	} else if (res.y > 0) {
	    
	    obj.pos.y = this.pos.y - obj.height;
	    obj.vel.y = 0;
	    obj.falling = false;
	    obj.jumping = false;
	    
	} else if (res.x > 0) {
	    
	    obj.pos.x = this.pos.x - obj.width;
	    
	} else if (res.x < 0) {
	    
	    obj.pos.x = this.pos.x + this.width;
	}
    }
    
})

