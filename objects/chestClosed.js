import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/skrinja.gltf', import.meta.url));

const chestClosed = gltfLoader.loadScene(gltfLoader.defaultScene);


export { chestClosed };

