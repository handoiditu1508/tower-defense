var BulletHit = Effect.extend({
    ctor: function(){
        Effect.prototype.ctor.call(this, res.bullet_hit_plist, res.bullet_hit_png, 9, 1, 1, "bullet_hit");
    },
})