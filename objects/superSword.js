import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

export class SuperSword {
    constructor(url, nodeName) {
        this.url = url;
        this.nodeName = nodeName;
        this.gltfLoader = new GLTFLoader();
        this.node = null;
    }

    async load() {
        await this.gltfLoader.load(new URL(this.url, import.meta.url));
        this.node = this.gltfLoader.loadNode(this.nodeName);

        this.node.components[0].translation = [-69, 8.7, 167.6];
        this.node.components[0].scale = [0.11, 0.045, 0.05];
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
