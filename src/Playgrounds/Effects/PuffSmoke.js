var PuffSmoke = AbstractEffect.extend({
    ctor: function(){
        AbstractEffect.prototype.ctor.call(this, res.puff_smoke_plist, res.puff_smoke_png, 32, 1, 1, "puff_smoke");
    },
})