import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/skrinjaodprta+sword.gltf', import.meta.url));

const chestOpened = gltfLoader.loadScene(gltfLoader.defaultScene);
chestOpened.visible = true;

export { chestOpened };
