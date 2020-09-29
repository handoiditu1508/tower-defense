var Snail = AbstractEnemy.extend({

    ctor: function(wayPoints){
        AbstractEnemy.prototype.ctor.call(this, res.enemy_png, wayPoints);
    },

    die: function(){
        this._isAlive = false;

        var effect = new BlueStarDust();
        effect.setPosition(this.getPosition());
        this.getParent().getParent().addChild(effect);

        this.removeFromParent();
    },
});