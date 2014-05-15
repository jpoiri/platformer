
game.SolidEntity = me.ObjectEntity.extend({

    init: function(x, y, settings) {
	this.parent(x, y, settings);
    },

    onCollision: function(res, obj) {
	
	if (res.y < 0) {
	    
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

