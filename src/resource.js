var res = {
    LevelCompleteBoard_json: "res/LevelCompleteBoard.json",
    PlayerInformation_json: "res/PlayerInformation.json",
    map1_png: "res/Playgrounds/map1.png",
    map1_mini_png: "res/Playgrounds/map1_mini.png",
    map2_png: "res/Playgrounds/map2.png",
    map2_mini_png: "res/Playgrounds/map2_mini.png",
    enemy_png: "res/Playgrounds/Enemies/enemy.png",
    the_boy_png: "res/Playgrounds/Enemies/the_boy.png",
    the_boy_plist: "res/Playgrounds/Enemies/the_boy.plist",
    fire_explosion_png: "res/Playgrounds/Enemies/Explosions/fire_explosion.png",
    fire_explosion_plist: "res/Playgrounds/Enemies/Explosions/fire_explosion.plist",
    turret_png: "res/Playgrounds/Turrets/turret.png",
    projectile_png: "res/Playgrounds/Turrets/Projectiles/projectile.png",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
