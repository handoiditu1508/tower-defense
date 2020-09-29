var FireExplosion2 = Effect.extend({
    ctor: function(){
        Effect.prototype.ctor.call(this, res.puff_smoke_plist, res.puff_smoke_png, 32, 1, 1);
    },
})