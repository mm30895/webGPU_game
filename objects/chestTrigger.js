import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

export class ChestTrigger {
    constructor(url, nodeName, chest) {
        this.url = url;
        this.nodeName = nodeName;
        this.gltfLoader = new GLTFLoader();
        this.node = null;

        this.chest = chest;
    }

    async load() {
        // Load the GLTF file
        await this.gltfLoader.load(new URL(this.url, import.meta.url));

        // Load the specific node
        this.node = this.gltfLoader.loadNode(this.nodeName);
    }

    getNode() {
        return this.node;
    }
    onTrigger() {
        this.chest.openChest();
    }
}
