export class enemyExit {
    constructor(music, enemy, combatMusic) {
        this.music = music;
        this.enemy = enemy;
        this.combatMusic = combatMusic;

        this.played = false;
    }

    onTrigger() {
        if(!this.played) {
            this.combatMusic.stop();
            this.music.playMusic('./audio/the 14th sacrifice.mp3');
            this.played = true;
        }
        this.enemy.resetHpBar();
        this.enemy.hpBarInvisible();
    }
}
