import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { Transform, Node } from '../engine/core.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/chest+trigger.gltf', import.meta.url));

const chestClosed = gltfLoader.loadScene(gltfLoader.defaultScene);
chestClosed.visible = true;

const chestTrigger = gltfLoader.loadNode('ChestTrigger');
const chestCollider= gltfLoader.loadNode('chestCollider');

let x = 128.837;
let z = -2;
let y = 64.7558;
var children = chestClosed.children;
children.forEach(child => {
    child.visible = true;
    const transform = child.components[0];
    transform.translation = [x, z, y];
    transform.scale = [2, 2, 2]
    transform.rotation = [0, -1, 0, 0]
});



export { chestClosed, chestTrigger, chestCollider };

