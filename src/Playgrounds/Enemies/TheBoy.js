var TheBoy = AbstractVividEnemy.extend({
    ctor: function(wayPoints){
        AbstractVividEnemy.prototype.ctor.call(this, res.the_boy_plist, res.the_boy_png, 15, 15, 2, "the_boy_run", "the_boy_die", wayPoints);
        this.health = 100;
    }
})