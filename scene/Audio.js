export class Audio {

	constructor() {
		this.audioContext = new (window.AudioContext)();
		this.isPlaying = false;
		this.music = null;
	}
	
	async loadAudio(url) {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		return await this.audioContext.decodeAudioData(arrayBuffer);
	}
	
	async playMusic(path) {
		if (this.isPlaying) {
			//console.log("music already playing");
			return;
		}

		this.music = this.audioContext.createBufferSource();
		this.music.buffer = await this.loadAudio(path);
		this.music.loop = true;
		this.music.connect(this.audioContext.destination);
		this.music.start();
		this.isPlaying = true;
	}

	stop() {
		this.music.stop();
		this.music.disconnect();
	}

	async playEffect(path) {
		const effect = this.audioContext.createBufferSource();
		effect.buffer = await this.loadAudio(path);
		effect.connect(this.audioContext.destination);
		effect.start();
	}

	async playFootsteps(path) {
		const walking = this.audioContext.createBufferSource();
		walking.buffer = await this.loadAudio(path);
		walking.connect(this.audioContext.destination);
		walking.start();
		this.isPlaying = true;

		setTimeout(() => {
			this.isPlaying = false;
		}, 1500); 
	}
}