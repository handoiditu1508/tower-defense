var HelloWorldLayer = cc.Layer.extend({

    ctor:function () {
        cc.Layer.prototype.ctor.call(this);

        /*
        console.log(cc.radiansToDegrees(cc.pToAngle({x:0, y: 1})));//90
        console.log(cc.radiansToDegrees(cc.pToAngle({x:1, y: 1})));//45
        console.log(cc.radiansToDegrees(cc.pToAngle({x:1, y: 0})));//0
        console.log(cc.radiansToDegrees(cc.pToAngle({x:1, y: -1})));//-45
        console.log(cc.radiansToDegrees(cc.pToAngle({x:0, y: -1})));//-90
        console.log(cc.radiansToDegrees(cc.pToAngle({x:-1, y: -1})));//-135
        console.log(cc.radiansToDegrees(cc.pToAngle({x:-1, y: 0})));//180
        console.log(cc.radiansToDegrees(cc.pToAngle({x:-1, y: 1})));//135
        */

        var gradient = new cc.LayerGradient(cc.color(0, 0, 0, 255), cc.color(255, 0, 0, 255));
        this.addChild(gradient);

        var playMenuItem = new cc.MenuItemFont("Play", function(){cc.director.runScene(new MapChooser());});
        var optionMenuItem = new cc.MenuItemFont("Main", function(){});

        var menu = new cc.Menu(
            playMenuItem,
            optionMenuItem
        );
        menu.setPosition(this.width/2, this.height/2);
        menu.alignItemsVertically();
        this.addChild(menu);
    },

    update: function(dt){
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});