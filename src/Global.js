var Global = {
    score: 0
};

var Factory = {
    createEnemy: function(enemyId, waypoints){
        switch (enemyId){
            case 0: return new Snail(waypoints);
            case 1: return new TheBoy(waypoints);
        }
    },
};