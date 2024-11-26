import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { Audio } from '../scene/Audio.js';

export class ChestTrigger {
    constructor(chestTrigger, chest) {
        // this.url = url;
        // this.nodeName = nodeName;
        // this.gltfLoader = new GLTFLoader();
        // this.node = null;
        this.chestTrigger = chestTrigger;

        this.chest = chest;
    }

    // async load() {
    //     // Load the GLTF file
    //     await this.gltfLoader.load(new URL(this.url, import.meta.url));

    //     // Load the specific node
    //     this.node = this.gltfLoader.loadNode(this.nodeName);
    // }

    getNode() {
        return this.chestTrigger;
    }
    onTrigger() {
        this.chest.openChest();
        const effect = new Audio();
        effect.playEffect('./audio/mixkit-mechanical-crate-pick-up-3154.mp3');
    }
}
