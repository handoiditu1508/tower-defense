var Bullet = cc.Sprite.extend({
    _speed: 500,
    _targetEnemy: null,
    _minimumDistance: 10,
    _damage: 1,

    ctor: function(targetEnemy){
        cc.Sprite.prototype.ctor.call(this, res.projectile_png);

        this._targetEnemy = targetEnemy;

        this.scheduleUpdate();
    },

    update: function(dt){

        var distance = cc.pDistance(this._targetEnemy.getPosition(), this.getPosition())
        if(distance <= this._minimumDistance){
            this._damageEnemy();
        }
        var direction = cc.pSub(this._targetEnemy.getPosition(), this.getPosition());
        direction = cc.pNormalize(direction);

        this.setPosition(this.getPositionX() + direction.x * this._speed * dt, this.getPositionY() + direction.y * this._speed * dt);
    },

    _damageEnemy: function(){
        if(this._targetEnemy.getParent() != null){
            this._targetEnemy.takeDamage(this._damage);
        }
        this.removeFromParent();
    }
})