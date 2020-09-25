var FireExplosion = cc.Sprite.extend({
    _keyPrefix: "Explosion_",
    _keySuffix: ".png",
    _numberOfSprites: 7,
    _timesBetweenSprites: 0.1,

    ctor: function(){

        cc.spriteFrameCache.addSpriteFrames(res.fire_explosion_plist, res.fire_explosion_png);

        cc.Sprite.prototype.ctor.call(this);

        var actions = [new cc.callFunc(this.setSpriteFrame.bind(this, cc.spriteFrameCache.getSpriteFrame(this.getKey(1))))];
        for(var i = 2; i<=this._numberOfSprites; i++){
            var action1 = new cc.delayTime(this._timesBetweenSprites);
            var action2 = new cc.callFunc(this.setSpriteFrame.bind(this, cc.spriteFrameCache.getSpriteFrame(this.getKey(i))));
            actions.push(action1);
            actions.push(action2);
        }
        actions.push(new cc.callFunc(this.removeFromParent.bind(this)));
        this.runAction(cc.sequence(actions));
    },

    getKey: function(index){
        return this._keyPrefix + index + this._keySuffix;
    }
})