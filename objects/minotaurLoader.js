import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/minotaver6.gltf', import.meta.url));

const minotaurNode = gltfLoader.loadNode('Cube.004');
const minotaurTriggerNode = gltfLoader.loadNode('Trigger');


const transform = minotaurNode.components[0];
transform.translation = [-99.13, -2, -63.0432 ];
transform.scale = [1.5, 1.5, 1.5];

minotaurNode.isStatic = true;
minotaurNode.visible = true;

minotaurTriggerNode.visible = false;
minotaurTriggerNode.isTrigger = true;


const transformTrigger = minotaurTriggerNode.components[0];
transformTrigger.translation = [-99.13, 0, -63.0432];
transformTrigger.scale = [1.5 * 4.239274501800537, 5 * 5.867170810699463, 5 * 2.936772108078003];

var children = minotaurNode.children;
children.forEach(child => {
    child.visible = true;
});

export { minotaurNode, minotaurTriggerNode};
