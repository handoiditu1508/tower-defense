var Effect = cc.Sprite.extend({
    spritesCount: null,
    currentIndex: 0,
    animationTime: null,
    repeatTimesLeft: null,
    timeBetweenSprites: null,
    timeCount: 0,

    ctor: function(plist, fileName, spritesCount, animationTime, repeat){
        cc.spriteFrameCache.addSpriteFrames(plist, fileName);

        this.spritesCount = spritesCount;
        this.animationTime = animationTime;
        this.timeBetweenSprites = this.animationTime/this.spritesCount;

        cc.Sprite.prototype.ctor.call(this, cc.spriteFrameCache.getSpriteFrame(this.currentIndex));

        if(!repeat || repeat == cc.REPEAT_FOREVER)
            this.schedule(this.repeatForever);
        else{
            this.repeatTimesLeft = repeat;
            this.schedule(this.repeat);
        }
    },

    repeatForever: function(dt){
        this.timeCount += dt;
        this.currentIndex += Math.floor(this.timeCount/this.timeBetweenSprites);
        this.currentIndex %= this.spritesCount;
        this.timeCount %= this.timeBetweenSprites;
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.currentIndex));
    },

    repeat: function(dt){
        this.timeCount += dt;
        this.currentIndex += Math.floor(this.timeCount/this.timeBetweenSprites);
        this.repeatTimesLeft -= Math.floor(this.currentIndex/this.spritesCount);
        this.currentIndex %= this.spritesCount;
        this.timeCount %= this.timeBetweenSprites;
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.currentIndex));
        if(this.repeatTimesLeft > 0){
            this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.currentIndex));
        }
        else this.removeFromParent();
    },
})