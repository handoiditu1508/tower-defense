var Enemy = AbstractEnemy.extend({

    ctor: function(wayPoints){
        AbstractEnemy.prototype.ctor.call(this, res.enemy_png, wayPoints);
    },
});