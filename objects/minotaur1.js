import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/minotaver5-8.gltf', import.meta.url));

const minotaurNode = gltfLoader.loadNode('Cube.003');
// const minotaurTriggerNode = gltfLoader.loadNode('Trigger');


const transform = minotaurNode.components[0];
transform.translation = [-10, 0, -4];
transform.scale = [1.4, 1.4, 1.4];

minotaurNode.isStatic = true;
minotaurNode.visible = true;

// minotaurTriggerNode.visible = false;
// minotaurTriggerNode.isTrigger = true;


// const transformTrigger = minotaurTriggerNode.components[0];
// transformTrigger.translation = [-10, 7, 0];

export { minotaurNode};
