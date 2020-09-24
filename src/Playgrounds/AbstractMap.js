var AbstractMapLayer = cc.Layer.extend({
    _enemiesParentNode: null,
    _delayBetweenEnemies: 0.5,
    _waveIndex: 0,
    _enemyLeft: 0,
    _enemyCountdown: 0,
    _waveDelay: 5,
    _waveCountdown: 0,
    _enemyGroupIndex: 0,

    _scoreLabel: null,

    _backText: null,

    _turretShop: null,
    _turretDragger: null,

    _wayPoints: [],
    _turretPoints: [],
    _waves: [],
    _turretPlaced: [],

    ctor:function (background, wayPoints, turretPoints, waves) {
        cc.Layer.prototype.ctor.call(this);

        this._wayPoints = wayPoints;
        this._turretPoints = turretPoints;
        this._waves = waves;
        this._turretPlaced = [];
        for(var i in this._turretPoints){
            this._turretPlaced.push(false);
        }

        Global.score = 0;

        var bg = new cc.Sprite(background);
        bg.setPosition(this.width/2, this.height/2);
        this.addChild(bg);

        this._scoreLabel = new cc.LabelTTF("score: 0", "Arial", 18);
        this._scoreLabel.setPosition(this.width/2, this.height-50);
        this.addChild(this._scoreLabel);

        this._backText = new cc.LabelTTF("back to Map Chooser", "Arial", 40);
        this._backText.setPosition(200, 600);
        this.addChild(this._backText);

        this._enemiesParentNode = new cc.Node();
        this._enemiesParentNode.setPosition(0, 0);
        this.addChild(this._enemiesParentNode);
        this._enemyLeft = this._waves[this._waveIndex][this._enemyGroupIndex].numberOfEnemies;
        this._waveCountdown = this._waveDelay;

        this._turretShop = new cc.Sprite(res.turret_png);
        this._turretShop.setPosition(this.width - 50, 50);
        this.addChild(this._turretShop);

        /*var turret = new Turret(this._enemiesParentNode.getChildren());
        turret.setPosition(this.width/2, this.height/2);
        this.addChild(turret);*/

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            onTouchBegan: function(touch, event){
                this._onTouchBegan(touch, event);
            }.bind(this),

            /*onTouchMoved: function (touch, event) {
                //console.log(touch.getLocation());
                this._onTouchMoved(touch, event);

            }.bind(this),

            onTouchEnded: function (touch, event) {
                //console.log(touch.getLocation());
                this._onTouchEnded(touch, event);
            }.bind(this),

            onTouchCancelled: function (touch, event) {
                //console.log(touch.getLocation());
                this._onTouchCancelled(touch, event);
            }.bind(this),*/
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,

            onMouseMove: function(event){
                this._onMouseMove(event);
            }.bind(this),

            onMouseUp: function(event){
                this._onMouseUp(event);
            }.bind(this),
        }, this);

        this.scheduleUpdate();

        return true;
    },

    update: function(dt){
        if(this._waveCountdown <= 0){
            if(this._waveIndex < this._waves.length){
                if(this._enemyLeft > 0){
                    if(this._enemyCountdown <= 0){
                        this._spawnEnemy();
                        this._enemyLeft--;
                        this._enemyCountdown = this._delayBetweenEnemies;
                    }
                    this._enemyCountdown -= dt;
                }
                /*else{
                    this._waveIndex++;
                    this._waveCountdown = this._waveDelay;
                    if(this._waveIndex < this._waves.length)
                        this._enemyLeft = this._waves[this._waveIndex].numberOfEnemies;
                }*/
                else{
                    this._enemyGroupIndex++;
                    if(this._enemyGroupIndex < this._waves[this._waveIndex].length){
                        this._enemyLeft = this._waves[this._waveIndex][this._enemyGroupIndex].numberOfEnemies;
                    }
                    else{
                        this._waveIndex++;
                        this._enemyGroupIndex = 0;
                        if(this._waveIndex < this._waves.length){
                            this._enemyLeft = this._waves[this._waveIndex][this._enemyGroupIndex].numberOfEnemies;
                            this._waveCountdown = this._waveDelay;
                        }
                    }
                }
            }
        }
        else this._waveCountdown -= dt;

        this._updateScoreText();
    },

    _spawnEnemy: function(){
        //var e = new Enemy(this._wayPoints);
        //var e = new TheBoy(this._wayPoints);
        var e = Factory.createEnemy(this._waves[this._waveIndex][this._enemyGroupIndex].id, this._wayPoints);
        this._enemiesParentNode.addChild(e);
    },

    _updateScoreText: function(){
        this._scoreLabel.setString("score: " + Global.score);
    },

    _onTouchBegan: function(touch, event){
        //drag turret on map
        if(cc.rectContainsPoint(this._turretShop.getBoundingBox(), touch.getLocation())){
            this._turretDragger = new cc.Sprite(res.turret_png);
            this._turretDragger.setPosition(touch.getLocation());
            this._turretDragger.setOpacity(127);
            this.addChild(this._turretDragger);
        }

        //back to map chooser
        if(cc.rectContainsPoint(this._backText.getBoundingBox(), touch.getLocation())){
            //cc.director.popScene();
            cc.director.runScene(new MapChooser());
        }
    },

    /*_onTouchMoved: function(touch, event){
        if(this._turretDragger){
            this._turretDragger.setPosition(touch.getLocation());
        }
    },

    _onTouchEnded: function(touch, event){
        if(this._turretDragger){
            for(var i in this._turretPoints){
                if(cc.rectContainsPoint(this._turretDragger.getBoundingBox(), this._turretPoints[i])){
                    var turret = new Turret(this._enemiesParentNode.getChildren());
                    turret.setPosition(this._turretPoints[i]);
                    this.addChild(turret);
                    break;
                }
            }
            this._deleteTurretDragger();
        }
    },

    _onTouchCancelled: function(touch, event){
        this._deleteTurretDragger();
    },*/

    _onMouseMove: function(event){
        if(this._turretDragger){
            this._turretDragger.setPosition(event.getLocation());
        }
    },

    _onMouseUp: function(event){
        if(this._turretDragger){
            for(var i in this._turretPoints){
                if(!this._turretPlaced[i] && cc.rectContainsPoint(this._turretDragger.getBoundingBox(), this._turretPoints[i])){
                    var turret = new Turret(this._enemiesParentNode.getChildren());
                    turret.setPosition(this._turretPoints[i]);
                    this.addChild(turret);
                    this._turretPlaced[i] = true;
                    break;
                }
            }
            this._deleteTurretDragger();
        }
    },

    _deleteTurretDragger: function(){
        this._turretDragger.removeFromParent();
        this._turretDragger = null;
    }

});

var AbstractMap = cc.Scene.extend({
    ctor:function (background, wayPoints, turretPoints, waves) {
        this._super();
        var layer = new AbstractMapLayer(background, wayPoints, turretPoints, waves);
        this.addChild(layer);
    }
});