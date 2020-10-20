var AbstractEnemy = cc.Sprite.extend({
    _speed: 200,
    _wayPoints: null,
    _destinationIndex: 1,
    _minimumDistance: 10,
    health: 2,
    _isAlive: true,
    _value: 1,

    ctor: function(image, wayPoints){
        cc.Sprite.prototype.ctor.call(this, image);
        this._wayPoints = wayPoints;
        this.setPosition(wayPoints[0]);

        this.scheduleUpdate();
    },

    update: function(dt){
        //move along waypoints
        if(this._isAlive) {
            var distance = cc.pDistance(this.getPosition(), this.getDestination());
            if (distance <= this._minimumDistance) {
                if (this._destinationIndex + 1 >= this._wayPoints.length){
                    Global.lives --;
                    if(Global.lives < 0)
                        Global.lives = 0;
                    this.removeFromParent();
                    return;
                }
                else this._destinationIndex++;
            }

            var direction = cc.pSub(this.getDestination(), this.getPosition());
            direction = cc.pNormalize(direction);

            this.setScaleX(direction.x / Math.abs(direction.x));
            this.setPosition(this.getPositionX() + direction.x * this._speed * dt, this.getPositionY() + direction.y * this._speed * dt);
        }
    },

    getDestination: function(){
        return this._wayPoints[this._destinationIndex];
    },

    takeDamage: function(damage){
        if(this._isAlive){
            this.health -= damage;
            if(this.health <= 0){
                this.die();
                Global.score += this._value;
            }
        }
    },

    die: function(){
        this._isAlive = false;
        this.removeFromParent();
    },

    getIsAlive: function(){
        return this._isAlive;
    },
    setIsAlive: function(isAlive){
        this._isAlive = isAlive;
    },
});