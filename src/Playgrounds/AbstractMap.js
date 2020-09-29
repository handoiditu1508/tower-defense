var AbstractMapLayer = cc.Layer.extend({
    _enemiesParentNode: null,
    _delayBetweenEnemies: 0.5,
    _waveIndex: 0,
    _enemyGroupIndex: 0,
    _enemyLeft: 0,
    _enemyCountdown: 0,
    _waveDelay: 5,
    _waveCountdown: 0,
    _defaultLives: 10,

    _playerInfoLayer: null,

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
        Global.lives = this._defaultLives;
        Global.kills = 0;

        var bg = new cc.Sprite(background);
        bg.setPosition(this.width/2, this.height/2);
        this.addChild(bg);

        this._playerInfoLayer = ccs.load(res.PlayerInformation_json).node;
        this.addChild(this._playerInfoLayer);
        this._playerInfoLayer.getChildByName("PauseButton").addTouchEventListener(function (sender, type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    this._createLevelCompleteBoard();
                    break;
            }
        }, this);

        this._enemiesParentNode = new cc.Node();
        this._enemiesParentNode.setPosition(0, 0);
        this.addChild(this._enemiesParentNode);
        this._enemyLeft = this._waves[this._waveIndex][this._enemyGroupIndex].numberOfEnemies;
        this._waveCountdown = this._waveDelay;

        this._turretShop = new cc.Sprite(res.turret_png);
        this._turretShop.setPosition(this.width - 50, 50);
        this.addChild(this._turretShop);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            onTouchBegan: function(touch, event){
                if(cc.director.isPaused())
                    return;

                this._onTouchBegan(touch, event);
            }.bind(this),

            /*onTouchMoved: function (touch, event) {
                if(cc.director.isPaused())
                    return;

                this._onTouchMoved(touch, event);

            }.bind(this),

            onTouchEnded: function (touch, event) {
                if(cc.director.isPaused())
                    return;

                this._onTouchEnded(touch, event);
            }.bind(this),

            onTouchCancelled: function (touch, event) {
                if(cc.director.isPaused())
                    return;

                this._onTouchCancelled(touch, event);
            }.bind(this),*/
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,

            onMouseMove: function(event){
                if(cc.director.isPaused())
                    return;

                this._onMouseMove(event);
            }.bind(this),

            onMouseUp: function(event){
                if(cc.director.isPaused())
                    return;

                this._onMouseUp(event);
            }.bind(this),
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyPressed: function(key, event){
                if(cc.director.isPaused())
                    return;

                this._onKeyPressed(key, event);
            }.bind(this),
        }, this);

        this.scheduleUpdate();

        return true;
    },

    _reinitiateProperties: function(){
        for(var i in this._turretPlaced){
            this._turretPlaced[i] = false;
        }

        for(var i = this.getChildren().length - 1; i>-1; i--){
            var child = this.getChildren()[i];
            if(child instanceof Turret || child instanceof Bullet){
                child.removeFromParent();

            }
        }

        Global.score = 0;
        Global.lives = 10;
        Global.kills = 0;

        this._updateScoreText();

        this._enemiesParentNode.removeAllChildren();
        this._waveIndex = 0;
        this._enemyGroupIndex = 0;
        this._enemyLeft = this._waves[this._waveIndex][this._enemyGroupIndex].numberOfEnemies;
        this._enemyCountdown = 0;
        this._waveCountdown = this._waveDelay;
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
            else if(this._enemiesParentNode.getChildren().length < 1){
                this._createLevelCompleteBoard(true);
                this.unscheduleUpdate();
            }
        }
        else this._waveCountdown -= dt;

        this._updateScoreText();
        this._updateCoinText();
        this._updateLifeBar();

        if(Global.lives < 1){
            this._createLevelCompleteBoard(true);
            this.unscheduleUpdate();
            return;
        }
    },

    _spawnEnemy: function(){
        var e = Factory.createEnemy(this._waves[this._waveIndex][this._enemyGroupIndex].id, this._wayPoints);
        this._enemiesParentNode.addChild(e);
    },

    _updateScoreText: function(){
        this._playerInfoLayer.getChildByName("Score").setString("score: " + Global.score);
    },

    _updateCoinText: function(){
        this._playerInfoLayer.getChildByName("CoinValue").setString(Global.coins);
    },

    _updateLifeBar: function(){
        var lifeCal = Global.lives;
        if(Global.lives > this._defaultLives)
            lifeCal = this._defaultLives;
        this._playerInfoLayer.getChildByName("LifeBar").setScaleX(lifeCal/this._defaultLives);
    },

    _createLevelCompleteBoard: function(isGameOver){
        cc.director.pause();

        if(!isGameOver){
            isGameOver = false;
        }

        if(isGameOver)
            Global.coins += Global.score;

        var boardContainer = ccs.load(res.LevelCompleteBoard_json).node;
        boardContainer.setName("levelCompleteBoard");
        this.addChild(boardContainer);

        //dark background
        var gradient = new cc.LayerGradient(cc.color(0, 0, 0, 255));
        gradient.setOpacity(200);
        boardContainer.addChild(gradient, -1);

        //stars
        if(isGameOver){
            var starsCal = Global.lives/this._defaultLives;

            //3 stars
            if(starsCal >= 1){
            }
            //2 stars
            else if(starsCal > 0.5){
                boardContainer.getChildByName("Star3").setVisible(false);
            }
            //1 star
            else{
                boardContainer.getChildByName("Star3").setVisible(false);
                boardContainer.getChildByName("Star2").setVisible(false);
            }
        }
        else{
            boardContainer.getChildByName("Star3").setVisible(false);
            boardContainer.getChildByName("Star2").setVisible(false);
            boardContainer.getChildByName("Star1").setVisible(false);
        }

        //life
        boardContainer.getChildByName("LifeValue").setString(String(Global.lives));

        //coin
        boardContainer.getChildByName("CoinValue").setString(String(Global.coins));

        //home button
        boardContainer.getChildByName("HomeButton").addTouchEventListener(function (sender, type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    cc.director.runScene(new HelloWorldScene());
                    cc.director.resume();
                    break;
            }
        }, this);

        //menu button
        boardContainer.getChildByName("MenuButton").addTouchEventListener(function (sender, type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    cc.director.runScene(new MapChooser());
                    cc.director.resume();
                    break;
            }
        }.bind(this), this);

        //retry button
        boardContainer.getChildByName("RetryButton").addTouchEventListener(function (sender, type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    this._reinitiateProperties();
                    this.scheduleUpdate();
                    cc.director.resume();
                    boardContainer.removeFromParent();
                    break;
            }
        }.bind(this), this);

        //resume button
        if(isGameOver){
            boardContainer.getChildByName("ResumeButton").setBright(false);
            boardContainer.getChildByName("ResumeButton2").setBright(false);
        }
        else{
            var func = function (sender, type) {
                switch (type){
                    case ccui.Widget.TOUCH_ENDED:
                        boardContainer.removeFromParent();
                        cc.director.resume();
                        break;
                }
            };
            boardContainer.getChildByName("ResumeButton").addTouchEventListener(func.bind(this), this);
            boardContainer.getChildByName("ResumeButton2").addTouchEventListener(func.bind(this), this);
        }
    },

    _onTouchBegan: function(touch, event){
        //drag turret on map
        if(cc.rectContainsPoint(this._turretShop.getBoundingBox(), touch.getLocation())){
            this._turretDragger = new cc.Sprite(res.turret_png);
            this._turretDragger.setPosition(touch.getLocation());
            this._turretDragger.setOpacity(127);
            this.addChild(this._turretDragger);
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

    _onKeyPressed: function(key, event){
        if(key == cc.KEY.escape){
            var levelCompleteBoard = this.getChildByName("levelCompleteBoard");
            if(levelCompleteBoard == null){
                this._createLevelCompleteBoard();
            }
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