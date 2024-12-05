
export class enemyEntry {
    constructor(music, enemy, combatMusic) {
        this.enemy = enemy;
        this.music = music;
        this.combatMusic = combatMusic;

        this.played = false;
    }

    onTrigger() {
        if(!this.played) {
            this.music.stop();
            this.combatMusic.playMusic('./audio/Combat Music.mp3');
            this.played = true;
        }
        this.enemy.hpBarVisible();
    }
}
