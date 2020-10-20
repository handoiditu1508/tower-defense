var Global = {
    score: 0,
    lives: 0,
    coins: 0,
    kills: 0,
    test: null
};

var Factory = {
    createEnemy: function(enemyId, waypoints){
        switch (enemyId){
            case 0: return new Snail(waypoints);
            case 1: return new TheBoy(waypoints);
        }
    },
};