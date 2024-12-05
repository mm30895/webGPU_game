export class mainExit {
    constructor(music, enemy, combatMusic, ) {
        this.music = music;
        this.enemy = enemy;
        this.combatMusic = combatMusic;

        this.played = false;
    }

    onTrigger() {
        // if(!this.played) {
        //     this.combatMusic.stop();
        //     this.music.playMusic('./audio/the 14th sacrifice.mp3');
        //     this.played = true;
        // }
        if (this.enemy.isDead) {
            window.location.href = "winScreen.html";
            return; 
        }
    }
}
