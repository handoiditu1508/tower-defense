var TheBoy = AbstractVividEnemy.extend({
    ctor: function(wayPoints){
        AbstractVividEnemy.prototype.ctor.call(this, res.the_boy_plist, res.the_boy_png, "Run (", 15, "Dead (", 15, wayPoints);
        this.setKeySuffix(").png");
    }
})