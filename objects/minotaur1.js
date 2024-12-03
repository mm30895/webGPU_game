import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/minotaver5.gltf', import.meta.url));

const minotaurNode = gltfLoader.loadNode('Cube.004');
const minotaurTriggerNode = gltfLoader.loadNode('Trigger');


const transform = minotaurNode.components[0];
transform.translation = [0, 0, -20];
transform.scale = [1.4, 1.4, 1.4];

minotaurNode.isStatic = true;
minotaurNode.visible = true;

minotaurTriggerNode.visible = false;
minotaurTriggerNode.isTrigger = true;


const transformTrigger = minotaurTriggerNode.components[0];
transformTrigger.translation = [0, 0, -20];
transformTrigger.scale = [1.4 * 4.239274501800537, 1.4 * 5.867170810699463, 5 * 2.936772108078003];


export { minotaurNode, minotaurTriggerNode};
