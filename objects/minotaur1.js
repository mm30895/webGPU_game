import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/minotaver5-7.gltf', import.meta.url));

const minotaurNode = gltfLoader.loadNode('Cube');
// const minotaurTriggerNode = gltfLoader.loadNode('Trigger');

minotaurNode.isStatic = true;
minotaurNode.visible = true;

// minotaurTriggerNode.visible = false;
// minotaurTriggerNode.isTrigger = true;

const transform = minotaurNode.components[0];
transform.translation = [-10, 7, 0];

// const transformTrigger = minotaurTriggerNode.components[0];
// transformTrigger.translation = [-10, 7, 0];

export { minotaurNode};
