var AbstractVividEnemy = cc.Sprite.extend({
    _speed: 200,
    _wayPoints: null,
    _destinationIndex: 1,
    _minimumDistance: 10,
    _health: 2,
    _runKeyPrefix: "",
    _dieKeyPrefix: "",
    _keySuffix: ".png",
    _numberOfRunSprites: null,
    _numberOfDieSprites: null,
    _currentSpriteIndex: 1,
    _timesBetweenSprites: 0.1,
    _timer: 0,
    _isAlive: true,

    ctor: function(plist, image, runKeyPrefix, numberOfRunSprites, dieKeyPrefix, numberOfDieSprites, wayPoints){
        cc.spriteFrameCache.addSpriteFrames(plist, image);

        cc.Sprite.prototype.ctor.call(this, cc.spriteFrameCache.getSpriteFrame(this.getRunKey(1)));

        this._runKeyPrefix = runKeyPrefix;
        this._numberOfRunSprites = numberOfRunSprites;
        this._dieKeyPrefix = dieKeyPrefix;
        this._numberOfDieSprites = numberOfDieSprites;

        this._wayPoints = wayPoints;
        this.setPosition(wayPoints[0]);

        this.scheduleUpdate();
    },

    update: function(dt){
        /*var distance = cc.pDistance(this.getPosition(), this.getDestination());
        if(distance <= this._minimumDistance){
            if(this._destinationIndex + 1 >= this._wayPoints.length)
                this.removeFromParent();
            else this._destinationIndex++;
        }

        var direction = cc.pSub(this.getDestination(), this.getPosition());
        direction = cc.pNormalize(direction);

        this.setPosition(this.getPositionX() + direction.x * this._speed * dt, this.getPositionY() + direction.y * this._speed * dt);


        if(this._timer >= this._timesBetweenSprites){
            this._currentSpriteIndex++;
            if(this._isAlive){
                this._currentSpriteIndex = (this._currentSpriteIndex % this._numberOfRunSprites) + Math.floor(this._currentSpriteIndex / this._numberOfRunSprites);
                this.setSpriteFrame.bind(this, cc.spriteFrameCache.getSpriteFrame(this.getRunKey(this._currentSpriteIndex)));
            }
            else if(this._currentSpriteIndex > this._numberOfDieSprites){
                this.removeFromParent();
            }
            else{
                this.setSpriteFrame.bind(this, cc.spriteFrameCache.getSpriteFrame(this.getDieKey(this._currentSpriteIndex)));
            }
        }*/

        if(this._isAlive){
            var distance = cc.pDistance(this.getPosition(), this.getDestination());
            if(distance <= this._minimumDistance){
                if(this._destinationIndex + 1 >= this._wayPoints.length)
                    this.removeFromParent();
                else this._destinationIndex++;
            }

            var direction = cc.pSub(this.getDestination(), this.getPosition());
            direction = cc.pNormalize(direction);

            this.setScaleX(direction.x/Math.abs(direction.x));
            this.setPosition(this.getPositionX() + direction.x * this._speed * dt, this.getPositionY() + direction.y * this._speed * dt);


            this._timer+=dt;
            if(this._timer >= this._timesBetweenSprites){
                this._currentSpriteIndex++;
                this._currentSpriteIndex = (this._currentSpriteIndex % this._numberOfRunSprites) + Math.floor(this._currentSpriteIndex / this._numberOfRunSprites);
                this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.getRunKey(this._currentSpriteIndex)));
                this._timer-=this._timesBetweenSprites;
            }
        }
    },

    getDestination: function(){
        return this._wayPoints[this._destinationIndex];
    },

    takeDamage: function(damage){
        if(this._isAlive){
            this._health -= damage;
            if(this._health <= 0){
                //this._isAlive = false;
                //this._currentSpriteIndex = 1;
                this.die();
                Global.score++;
            }
        }
    },

    die: function(){
        this._isAlive = false;

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

    setSpeed: function(speed){
        this._speed = speed;
    },
    getSpeed: function(){
        return this._speed;
    },

    setHealth: function(health){
        this._health = health;
    },
    getHealth: function(){
        return this._health;
    },

    getRunKey: function(index){
        return this._runKeyPrefix + index + this._keySuffix;
    },

    getDieKey: function(index){
        return this._dieKeyPrefix + index + this._keySuffix;
    },

    setKeySuffix: function(suffix){
        this._keySuffix = suffix;
    },

    getIsAlive: function(){
        return this._isAlive;
    }
});