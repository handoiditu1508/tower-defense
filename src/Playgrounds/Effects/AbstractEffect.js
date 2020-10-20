var AbstractEffect = cc.Sprite.extend({
    _keyPrefix: null,

    ctor: function(plist, fileName, numberOfSprites, animationTime, repeat, keyPrefix){
        cc.spriteFrameCache.addSpriteFrames(plist, fileName);

        cc.Sprite.prototype.ctor.call(this);

        this._keyPrefix = keyPrefix;

        var timeBetweenSprites;

        if(repeat == 1){
            timeBetweenSprites = animationTime/(numberOfSprites-1);
        }
        else timeBetweenSprites = animationTime/numberOfSprites;

        var animFrames = [];
        for (var i = 0; i < numberOfSprites; i++) {
            var frame = cc.spriteFrameCache.getSpriteFrame(this.getKey(i));
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, timeBetweenSprites, repeat);
        var animate   = new cc.Animate(animation);
        var del = cc.callFunc(function(){
            this.removeFromParent();
        }.bind(this));
        this.runAction(cc.sequence(animate, del));
    },

    getKey: function(index){
        return this._keyPrefix + index;
    }
})