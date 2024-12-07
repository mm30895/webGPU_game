export class Audio {

	constructor() {
		this.audioContext = new (window.AudioContext)();
		this.isPlaying = false;
		this.music = null;
		this.gainNode = this.audioContext.createGain();
		this.gainNode.connect(this.audioContext.destination);
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
		this.music.connect(this.gainNode);

		this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 2); // 1 second fade in
		this.music.start();
		this.isPlaying = true;
	}

	stop() {
		if (!this.isPlaying) {
			return;
		}
		this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioContext.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2);

		setTimeout(() => {
            this.music.stop();
            this.music.disconnect();
			this.isPlaying = false;
        }, 2000);
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