var Map2 = AbstractMap.extend({
    ctor:function () {
        var wayPoints = [
            {x: -32, y: 152},
            {x: 417, y: 179},
            {x: 545, y: 217},
            {x: 601, y: 319},
            {x: 522, y: 408},
            {x: 435, y: 430},
            {x: 320, y: 382},
            {x: 307, y: 291},
            {x: 354, y: 193},
            {x: 417, y: 179},
            {x: 992, y: 151},
        ];
        var turretPoints = [
            {x: 222, y: 253},
            {x: 266, y: 497},
            {x: 609, y: 483},
            {x: 692, y: 245},
            {x: 436, y: 285},
            {x: 436, y: 62},
        ];
        var waves = [
            [
                {
                    id: 1,
                    numberOfEnemies: 1,
                },
                {
                    id: 0,
                    numberOfEnemies: 5,
                },
                {
                    id: 1,
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
        AbstractMap.prototype.ctor.call(this, res.map2_png, wayPoints, turretPoints, waves);
    }
});