import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/minotaver5.gltf', import.meta.url));

const minionNode = gltfLoader.loadNode('Cube.004');
const minionTriggerNode = gltfLoader.loadNode('Trigger');

let x = 120.837;
let z = 0;
let y = 35.7558;
const transform = minionNode.components[0];
transform.translation = [x, z-2, y];
transform.scale = [1, 1, 1];
transform.rotation = [0, -1, 0, 0]
console.log(minionNode);
var axe = minionNode.children[5];
axe.removeChild(axe.children[0]);

minionNode.isStatic = true;
minionNode.visible = true;

minionTriggerNode.visible = false;
minionTriggerNode.isTrigger = true;


const transformTrigger = minionTriggerNode.components[0];
transformTrigger.translation = [x, z, y];
transformTrigger.scale = [1.4 * 4.239274501800537, 5 * 5.867170810699463, 5 * 2.936772108078003];
transformTrigger.rotation = [0, -1, 0, 0]


export { minionNode, minionTriggerNode};
