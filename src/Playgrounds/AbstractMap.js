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
        Global.lives = this._defaultLives;
        Global.kills = 0;

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
        this._turretPlaced = [];
        for(var i in this._turretPoints){
            this._turretPlaced.push(false);
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
        this._scoreLabel.setString("score: " + Global.score);
    },

    _createLevelCompleteBoard: function(isGameOver){
        cc.director.pause();

        if(!isGameOver){
            isGameOver = false;
        }

        if(isGameOver)
            Global.coins += Global.score;

        var boardContainer = new cc.Node();
        boardContainer.setPosition(0, 0);
        boardContainer.setName("levelCompleteBoard");
        this.addChild(boardContainer);

        //dark background
        var gradient = new cc.LayerGradient(cc.color(0, 0, 0, 255), cc.color(0, 0, 0, 255));
        gradient.setOpacity(200);
        boardContainer.addChild(gradient);

        //board
        var board = new cc.Sprite(res.level_complete_board_png);
        board.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        boardContainer.addChild(board);

        //stars
        if(isGameOver){
            var starsPosition = [
                {x: 400.41, y: 312},
                {x: 560.41, y: 312},
                {x: 480, y: 334.77},
            ];
            var starsScale = [1, 1, 1.15];
            var starsCal = Global.lives/this._defaultLives;

            if(starsCal >= 1){
                for(var i = 0; i < 3; i++){
                    var star = new cc.Sprite(res.star_png);
                    star.setPosition(starsPosition[i]);
                    star.setScale(starsScale[i]);
                    boardContainer.addChild(star);
                }
            }
            else if(starsCal > 0.5){
                for(var i = 0; i < 2; i++){
                    var star = new cc.Sprite(res.star_png);
                    star.setPosition(starsPosition[i]);
                    star.setScale(starsScale[i]);
                    boardContainer.addChild(star);
                }
            }
            else{
                for(var i = 0; i < 1; i++){
                    var star = new cc.Sprite(res.star_png);
                    star.setPosition(starsPosition[i]);
                    star.setScale(starsScale[i]);
                    boardContainer.addChild(star);
                }
            }
        }

        //life
        var lifeLabel = new cc.LabelTTF("Life", "Arial", 36);
        lifeLabel.setPosition(395.28, 232);
        boardContainer.addChild(lifeLabel);

        var lifeIcon = new cc.Sprite(res.life_png);
        lifeIcon.setPosition(465.51, 236.15);
        lifeIcon.setScale(0.55);
        boardContainer.addChild(lifeIcon);

        var lifeValue = new cc.LabelTTF(String(Global.lives), "Arial", 24);
        lifeValue.setPosition(535.42, 232);
        boardContainer.addChild(lifeValue);

        //coin
        var coinIcon = new cc.Sprite(res.coin_png);
        coinIcon.setPosition(465.51, 178.95);
        coinIcon.setScale(0.55);
        boardContainer.addChild(coinIcon);

        var coinLabel = new cc.LabelTTF("Coin", "Arial", 36);
        coinLabel.setPosition(395.28, 176);
        boardContainer.addChild(coinLabel);

        var lifeValue = new cc.LabelTTF(String(Global.coins), "Arial", 24);
        lifeValue.setPosition(535.42, 176);
        boardContainer.addChild(lifeValue);

        //home button
        var homeButton = new ccui.Button(res.home_button_normal_png, res.home_button_press_png, res.home_button_disable_png);
        homeButton.setPosition(387, 96);
        homeButton.setScale(0.65);
        homeButton.addTouchEventListener(function (sender, type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    cc.director.runScene(new HelloWorldScene());
                    cc.director.resume();
                    break;
            }
        }, this);
        boardContainer.addChild(homeButton);

        //menu button
        var menuButton = new ccui.Button(res.menu_button_normal_png, res.menu_button_press_png, res.menu_button_disable_png);
        menuButton.setPosition(449, 96);
        menuButton.setScale(0.65);
        menuButton.addTouchEventListener(function (sender, type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    cc.director.runScene(new MapChooser());
                    cc.director.resume();
                    break;
            }
        }.bind(this), this);
        boardContainer.addChild(menuButton);

        //retry button
        var retryButton = new ccui.Button(res.retry_button_normal_png, res.retry_button_press_png, res.retry_button_disable_png);
        retryButton.setPosition(511, 96);
        retryButton.setScale(0.65);
        retryButton.addTouchEventListener(function (sender, type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    this._reinitiateProperties();
                    this.scheduleUpdate();
                    cc.director.resume();
                    boardContainer.removeFromParent();
                    break;
            }
        }.bind(this), this);
        boardContainer.addChild(retryButton);

        //play button
        var playButton = new ccui.Button(res.play_button_normal_png, res.play_button_press_png, res.play_button_disable_png);
        playButton.setPosition(573, 96);
        playButton.setScale(0.65);
        if(isGameOver){
            playButton.setBright(false);
        }
        else{
            playButton.addTouchEventListener(function (sender, type) {
                switch (type){
                    case ccui.Widget.TOUCH_ENDED:
                        boardContainer.removeFromParent();
                        cc.director.resume();
                        break;
                }
            }.bind(this), this);
        }
        boardContainer.addChild(playButton);
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