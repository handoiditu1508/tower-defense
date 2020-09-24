var HelloWorldLayer = cc.Layer.extend({

    ctor:function () {
        cc.Layer.prototype.ctor.call(this);

        var gradient = new cc.LayerGradient(cc.color(0, 0, 0, 255), cc.color(0, 0, 255, 255));
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