var Turret = cc.Sprite.extend({
    _rotationSpeed: 100,
    _attackRange: 200,
    _enemiesList: null,
    _targetingEnemy: null,
    _attackRate: 1,
    _attackCountdown: null,

    ctor: function(enemiesList){
        cc.Sprite.prototype.ctor.call(this, res.turret_png);
        this.setAnchorPoint(this.anchorX, 0.35);

        this._enemiesList = enemiesList;
        this._attackCountdown = this._attackRate;

        this.scheduleUpdate();
    },

    update: function(dt){
        if(!this._targetingEnemy
            || !this._targetingEnemy.getIsAlive()
            || cc.pDistance(this.getPosition(), this._targetingEnemy.getPosition()) > this._attackRange){
            this._findNewTarget()
        }
        this._attack();

        this._attackCountdown-=dt;
    },

    _findNewTarget: function(){
        for(var i in this._enemiesList){
            if(cc.pDistance(this.getPosition(), this._enemiesList[i].getPosition()) <= this._attackRange){
                this._targetingEnemy = this._enemiesList[i];
                return;
            }
        }
        this._targetingEnemy = null;
    },

    _attack: function(){
        if(this._targetingEnemy && this._targetingEnemy.getIsAlive() && this._attackCountdown<=0){
            /*var angle = cc.radiansToDegrees(cc.pToAngle(this._targetingEnemy.getPosition()));
            var offset = 90;
            var t = cc.radiansToDegrees(cc.pToAngle(this.getPosition()));
            this.setRotation(offset - angle);*/
            //firing at enemy
            this._attackCountdown=this._attackRate;
            var bullet = new Bullet(this._targetingEnemy);
            bullet.setPosition(this.getPosition());
            this.getParent().addChild(bullet);
        }
    }
});