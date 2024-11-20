import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

export class BoringSword {
    constructor(url, nodeName) {
        this.url = url;
        this.nodeName = nodeName;
        this.gltfLoader = new GLTFLoader();
        this.node = null;
    }

    async load() {
        // Load the GLTF file
        await this.gltfLoader.load(new URL(this.url, import.meta.url));

        // Load the specific node
        this.node = this.gltfLoader.loadNode(this.nodeName);

        // Set default properties
        this.node.components[0].translation = [13.4, 7.299824600219727, -2];
        this.node.components[0].scale = [0.3, 0.3, 0.3];
        this.node.components[0].rotation = [0, 0, 0, 0];
    }

    setTranslation(x, y, z) {
        this.node.components[0].translation = [x, y, z];
    }

    setScale(x, y, z) {
        this.node.components[0].scale = [x, y, z];
    }

    setRotation(x, y, z, w) {
        this.node.components[0].rotation = [x, y, z, w];
    }

    getNode() {
        return this.node;
    }
}