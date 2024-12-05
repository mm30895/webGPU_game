export class mainEntry {
    constructor(music) {
        this.music = music;

        this.played = false;
    }

    onTrigger() {
        if(!this.played) {
            this.music.playMusic('./audio/the 14th sacrifice.mp3');
            this.played = true;
        }
    }
}
