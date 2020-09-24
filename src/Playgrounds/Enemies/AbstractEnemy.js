var AbstractEnemy = cc.Sprite.extend({
    _speed: 200,
    _wayPoints: null,
    _destinationIndex: 1,
    _minimumDistance: 10,
    _health: 2,
    _isAlive: true,

    ctor: function(image, wayPoints){
        cc.Sprite.prototype.ctor.call(this, image);
        this._wayPoints = wayPoints;
        this.setPosition(wayPoints[0]);

        this.scheduleUpdate();
    },

    update: function(dt){
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
    },

    getDestination: function(){
        return this._wayPoints[this._destinationIndex];
    },

    takeDamage: function(damage){
        if(this._isAlive){
            this._health -= damage;
            if(this._health <= 0){
                this.die();
                Global.score++;
            }
        }
    },

    die: function(){
        this._isAlive = false;
        var explosion = new FireExplosion();
        explosion.setPosition(this.getPosition());
        this.getParent().getParent().addChild(explosion);
        this.removeFromParent();
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

    getIsAlive: function(){
        return this._isAlive;
    }
});