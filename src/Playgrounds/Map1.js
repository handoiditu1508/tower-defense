var Map1 = AbstractMap.extend({
    ctor:function () {
        var wayPoints = [
            {x: -32, y: 288},
            {x: 160, y: 288},
            {x: 160, y: 480},
            {x: 352, y: 480},
            {x: 352, y: 224},
            {x: 608, y: 224},
            {x: 608, y: 352},
            {x: 992, y: 352},
        ];
        var turretPoints = [
            {x: 96, y: 352},
            {x: 224, y: 416},
            {x: 288, y: 416},
            {x: 416, y: 288},
            {x: 544, y: 288},
            {x: 672, y: 288},
        ];
        var waves = [
            [
                {
                    id: 1,
                    numberOfEnemies: 5,
                },
                {
                    id: 0,
                    numberOfEnemies: 5,
                }
            ],
            [
                {
                    id: 1,
                    numberOfEnemies: 10,
                },
                {
                    id: 0,
                    numberOfEnemies: 10,
                }
            ],
            [
                {
                    id: 1,
                    numberOfEnemies: 15,
                },
                {
                    id: 0,
                    numberOfEnemies: 15,
                }
            ],
            [
                {
                    id: 1,
                    numberOfEnemies: 20,
                },
                {
                    id: 0,
                    numberOfEnemies: 20,
                }
            ],
        ];
        AbstractMap.prototype.ctor.call(this, res.map1_png, wayPoints, turretPoints, waves);
    }
});