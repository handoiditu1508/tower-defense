var Turret = cc.Sprite.extend({
    _rotationSpeed: 10,
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
        this._attack(dt);

        this._attackCountdown-=dt;
    },

    _findNewTarget: function(){
        for(var i in this._enemiesList){
            if(this._enemiesList[i].getIsAlive() && cc.pDistance(this.getPosition(), this._enemiesList[i].getPosition()) <= this._attackRange){
                this._targetingEnemy = this._enemiesList[i];
                return;
            }
        }
        this._targetingEnemy = null;
    },

    _attack: function(dt){
        if(this._targetingEnemy){
            //rotate gun
            var angle = cc.radiansToDegrees(cc.pToAngle( cc.pSub(this._targetingEnemy.getPosition(), this.getPosition()) ));
            var offset = 90;
            //this.setRotation(offset - angle);
            this.setRotation(this.getRotation() + ((offset-angle) - this.getRotation()) * this._rotationSpeed * dt);
            if(this._targetingEnemy.getIsAlive() && this._attackCountdown<=0){
                //firing at enemy
                this._attackCountdown=this._attackRate;
                var bullet = new Bullet(this._targetingEnemy);
                bullet.setPosition(this.getPosition());
                this.getParent().addChild(bullet);
            }
        }
    }
});