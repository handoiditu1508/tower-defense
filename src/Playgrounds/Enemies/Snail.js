var Snail = AbstractEnemy.extend({

    ctor: function(wayPoints){
        AbstractEnemy.prototype.ctor.call(this, res.snail_png, wayPoints);
    },

    die: function(){
        this.setIsAlive(false);

        var effect = new BlueStarDust();
        effect.setPosition(this.getPosition());
        this.getParent().getParent().addChild(effect);

        this.removeFromParent();
    },
});