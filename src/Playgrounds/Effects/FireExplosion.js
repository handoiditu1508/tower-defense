var FireExplosion = Effect.extend({
    ctor: function(){
        Effect.prototype.ctor.call(this, res.fire_explosion_plist, res.fire_explosion_png, 24, 1, 1, "fire_explosion");
    },
})