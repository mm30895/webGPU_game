import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/cool_sword.gltf', import.meta.url));

const superSword = gltfLoader.loadNode('Cube.006');

superSword.components[0].translation = [
    13.4,
    7.299824600219727,
    -2
];
superSword.components[0].scale = [
    0.3,
    0.3,
    0.1
];
superSword.components[0].rotation = [
    0,
    0,
    0,
    0
];


export { superSword };

