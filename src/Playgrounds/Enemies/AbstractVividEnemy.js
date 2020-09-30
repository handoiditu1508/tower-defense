var AbstractVividEnemy = AbstractEnemy.extend({
    _numberOfDieSprites: null,
    _timeBetweenSprites: null,

    _runKeyPrefix: null,
    _dieKeyPrefix: null,

    ctor: function(plist, image, numberOfRunSprites, numberOfDieSprites, animationTime, runKeyPrefix, dieKeyPrefix, wayPoints){
        cc.spriteFrameCache.addSpriteFrames(plist, image);

        AbstractEnemy.prototype.ctor.call(this, undefined, wayPoints);

        this._numberOfDieSprites = numberOfDieSprites;
        this._timeBetweenSprites = animationTime/numberOfRunSprites;
        this._runKeyPrefix = runKeyPrefix;
        this._dieKeyPrefix = dieKeyPrefix;

        var animFrames = [];
        for (var i = 0; i < numberOfRunSprites; i++) {
            var frame = cc.spriteFrameCache.getSpriteFrame(this.getRunKey(i));
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, this._timeBetweenSprites, Number.MAX_SAFE_INTEGER);
        var animate   = new cc.Animate(animation);
        this.runAction(animate);
    },

    die: function(){
        this.setIsAlive(false);

        this.stopAllActions();

        var animFrames = [];
        for (var i = 0; i < this._numberOfDieSprites; i++) {
            var frame = cc.spriteFrameCache.getSpriteFrame(this.getDieKey(i));
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, this._timeBetweenSprites);
        var animate   = new cc.Animate(animation);
        var del = cc.callFunc(this.removeFromParent.bind(this));
        this.runAction(cc.sequence(animate, del));
    },

    getRunKey: function(index){
        return this._runKeyPrefix + index;
    },

    getDieKey: function(index){
        return this._dieKeyPrefix + index;
    },
});