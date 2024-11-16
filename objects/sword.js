import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/sword.gltf', import.meta.url));

const sword = gltfLoader.loadNode(gltfLoader.defaultScene);


export { sword };

