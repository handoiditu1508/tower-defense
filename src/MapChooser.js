var MapChooserLayer = cc.Layer.extend({
    _mapLocations: [
        {x: 240, y: 160},
        {x: 720, y: 160}
    ],
    _miniMapSize: {
        width: 288,
        height: 192
    },
    _backText: null,

    ctor:function () {
        cc.Layer.prototype.ctor.call(this);

        var gradient = new cc.LayerGradient(cc.color(0, 0, 0, 255), cc.color(255, 0, 0, 255));
        this.addChild(gradient);

        var map1MenuItem = new cc.MenuItemImage(res.map1_mini_png, res.map1_png, function(){cc.director.runScene(new Map1());}, this);
        map1MenuItem.setPosition(this._mapLocations[0]);
        var map2MenuItem = new cc.MenuItemImage(res.map2_mini_png, res.map2_png, function(){cc.director.runScene(new Map2());}, this);
        map2MenuItem.setPosition(this._mapLocations[1]);
        var backMenuItem = new cc.MenuItemFont("back to Menu", function(){cc.director.runScene(new HelloWorldScene());})
        backMenuItem.setPosition(150, 600);

        var menu = new cc.Menu(
            map1MenuItem,
            map2MenuItem,
            backMenuItem
        );
        menu.setPosition(0, 0);
        this.addChild(menu);
    },

    update: function(dt){
    },
});

var MapChooser = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MapChooserLayer();
        this.addChild(layer);
    }
});