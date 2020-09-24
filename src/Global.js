var Global = {
    score: 0
};

var Factory = {
    createEnemy: function(enemyId, waypoints){
        switch (enemyId){
            case 0: return new Enemy(waypoints);
            case 1: return new TheBoy(waypoints);
        }
    },
};