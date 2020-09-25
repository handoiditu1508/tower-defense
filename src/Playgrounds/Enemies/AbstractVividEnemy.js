var AbstractVividEnemy = AbstractEnemy.extend({
    _runKeyPrefix: "",
    _dieKeyPrefix: "",
    _keySuffix: ".png",
    _numberOfRunSprites: null,
    _numberOfDieSprites: null,
    _timesBetweenSprites: 0.1,

    ctor: function(plist, image, runKeyPrefix, numberOfRunSprites, dieKeyPrefix, numberOfDieSprites, keySuffix, wayPoints){
        cc.spriteFrameCache.addSpriteFrames(plist, image);

        this._runKeyPrefix = runKeyPrefix;
        this._numberOfRunSprites = numberOfRunSprites;
        this._dieKeyPrefix = dieKeyPrefix;
        this._numberOfDieSprites = numberOfDieSprites;
        this._keySuffix = keySuffix;

        AbstractEnemy.prototype.ctor.call(this, cc.spriteFrameCache.getSpriteFrame(this.getRunKey(1)), wayPoints);

        var actions = [];
        for(var i = 1; i <= numberOfRunSprites; i++){
            var action1 = new cc.callFunc(this.setSpriteFrame.bind(this, cc.spriteFrameCache.getSpriteFrame(this.getRunKey(i))));
            var action2 = new cc.delayTime(this._timesBetweenSprites);
            actions.push(action1);
            actions.push(action2);
        }
        this.runAction(cc.repeatForever(cc.sequence(actions)));
    },

    die: function(){
        this.setIsAlive(false);

        this.stopAllActions();
        var actions = [new cc.callFunc(this.setSpriteFrame.bind(this, cc.spriteFrameCache.getSpriteFrame(this.getDieKey(1))))];
        for(var i = 2; i<=this._numberOfDieSprites; i++){
            var action1 = new cc.delayTime(this._timesBetweenSprites);
            var action2 = new cc.callFunc(this.setSpriteFrame.bind(this, cc.spriteFrameCache.getSpriteFrame(this.getDieKey(i))));
            actions.push(action1);
            actions.push(action2);
        }
        actions.push(new cc.callFunc(this.removeFromParent.bind(this)));
        this.runAction(cc.sequence(actions));
    },

    getRunKey: function(index){
        return this._runKeyPrefix + index + this._keySuffix;
    },

    getDieKey: function(index){
        return this._dieKeyPrefix + index + this._keySuffix;
    },
});