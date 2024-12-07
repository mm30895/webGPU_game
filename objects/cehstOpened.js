import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { Transform, Node } from '../engine/core.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/skrinjaodprta+sword.gltf', import.meta.url));

const chestOpened = gltfLoader.loadScene(gltfLoader.defaultScene);
chestOpened.visible = true;


let x = 128.837;
let z = -2;
let y = 64.7558;

var children = chestOpened.children;
children.forEach(child => {
    const transform = child.components[0];
    transform.translation = [x, z, y];
    transform.scale = [2, 2, 2]
    transform.rotation = [0, -1, 0, 0]
});
export { chestOpened };
