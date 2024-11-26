export class Audio {

	constructor() {
		this.audioContext = new (window.AudioContext)();
		this.isPlaying = false;
	}
	
	async loadAudio(url) {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		return await this.audioContext.decodeAudioData(arrayBuffer);
	}
	
	async playMusic(path) {
		if (this.isPlaying) {
			console.log("music already playing");
			return;
		}

		const music = this.audioContext.createBufferSource();
		music.buffer = await this.loadAudio(path);
		music.loop = true;
		music.connect(this.audioContext.destination);
		music.start();
		this.isPlaying = true;
	}

	async playEffect(path) {
		const effect = this.audioContext.createBufferSource();
		effect.buffer = await this.loadAudio(path);
		effect.connect(this.audioContext.destination);
		effect.start();
	}
}