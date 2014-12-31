
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
	this.blockType = settings.blockType;
	this.numberOfCoins = settings.numberOfCoins;
	this.numberOfGems = settings.numberOfGems;
	this.coinColor = settings.coinColor;
	this.coinValue = settings.coinValue;
	this.gemColor = settings.gemColor;
	this.gemValue = settings.gemValue;
	this.width = settings.width;
	this.height = settings.height;
	this.spawnWidth = 70;
	this.spawnHeight = 70;
	
	if (this.numberOfCoins == null) {
	    this.numberOfCoins = 10;
	}
	
	if (this.numberOfGems == null) {
	    this.numberOfGems = 10;
	}
	
	if (this.blockType == null) {
	    this.blockType = "brick";
	}
	
	this.addAnimation();
	this.activate();
	
	// set the renderable position to bottom center
	this.anchorPoint.set(0.5, 1.0);
	this.collidable = true;
    },
    
    addAnimation: function() {
	
	switch(this.blockType) {
	    
	    case "coin":
		this.renderable.addAnimation("active", [0]);
		this.renderable.addAnimation("disabled", [1]);
		break;
	    
	    case "gem":
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
		spawnObj = new game.FireBallEntity(this.pos.x, this.pos.y, { height : this.spawnHeight, width: this.spawnWidth} );
		break;
	    case "star":
		spawnObj = new game.StarEntity(this.pos.x, this.pos.y, { height : this.spawnHeight, width: this.spawnWidth,  fickerTime: this.flickerTime} );
		break
	    case "mushroom":
		spawnObj = new game.MushroomEntity(this.pos.x, this.pos.y, { height : this.spawnHeight, width: this.spawnWidth} );
		break;
	}
	
	spawnObj.z = 3;
	
	//do vertical translation for 5 seconds.
	var tween = new me.Tween(spawnObj.pos).to({ y: this.pos.y - (this.spawnHeight + 5) }, 500);
	
	tween.easing(me.Tween.Easing.Quadratic.Out);
	
	tween.start();
	
	this.disable();
	
	me.game.world.addChild(spawnObj);
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
	    var spawnObj = new game.CoinEntity(this.pos.x, this.pos.y, {height: this.spawnHeight, width: this.spawnWidth, color: this.coinColor, value: this.coinValue});

	    spawnObj.z = 3;
	    
	    //move the coin north for 2.5 seconds then remove it from the game.
	    var tween = new me.Tween(spawnObj.pos).to({ y: this.pos.y - this.spawnHeight }, 250).onComplete(function(){
		me.game.world.removeChild(spawnObj);
	    });
	
	    tween.easing(me.Tween.Easing.Quadratic.Out);
	    tween.start();
	
	    me.game.world.addChild(spawnObj);
	    
	    //decrease the number of coins left in the block.
	    this.numberOfCoins--;
	    
	    game.addCoin(spawnObj.value);
	}
	
	if (this.numberOfCoins == 0) {
	    this.disable();
	}
    },
    
    spawnGem: function() {
	
	//if the player has not spawn every coin yet
	if (this.numberOfGems > 0) {
	    
	    //create a new coin object.
	    var spawnObj = new game.GemEntity(this.pos.x, this.pos.y, {height: this.spawnHeight, width: this.spawnWidth, color: this.gemColor, value: this.gemValue});

	    spawnObj.z = 3;
	    
	    //move the coin north for 2.5 seconds then remove it from the game.
	    var tween = new me.Tween(spawnObj.pos).to({ y: this.pos.y - this.spawnHeight}, 250).onComplete(function(){
		me.game.world.removeChild(spawnObj);
	    });
	
	    tween.easing(me.Tween.Easing.Quadratic.Out);
	    tween.start();
	
	    me.game.world.addChild(spawnObj);
	    
	    //decrease the number of coins left in the block.
	    this.numberOfGems--;
	    
	    game.addCoin(spawnObj.value);
	}
	
	if (this.numberOfGems == 0) {
	    this.disable();
	}
    },

    onCollision: function(res, obj) {
	this.parent(res, obj);
	
	if (res.y < 0 && !obj.falling) {
	    
	    if (this.state == "active") {
		    
		switch (this.blockType) {
			
		    case "coin": 
			this.spawnCoin();
			break;
		    case "item":
			this.spawnItem();
			break;
		    case "gem":
			this.spawnGem();
			break;
		    case "brick":
			me.game.world.removeChild(this);
			break;
		}
	    } 
	}
    }

})

