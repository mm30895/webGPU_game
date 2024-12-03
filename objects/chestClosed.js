import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/skrinja+trigger.gltf', import.meta.url));

const chestClosed = gltfLoader.loadScene(gltfLoader.defaultScene);
chestClosed.visible = true;

const chestTrigger = gltfLoader.loadNode('ChestTrigger');
const chestCollider= gltfLoader.loadNode('chestCollider');



export { chestClosed, chestTrigger, chestCollider };

