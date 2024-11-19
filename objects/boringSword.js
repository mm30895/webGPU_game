import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/boring_sword.gltf', import.meta.url));

const boringSword = gltfLoader.loadNode('Cube.004');

boringSword.components[0].translation = [
    13.4,
    7.299824600219727,
    -2
];
boringSword.components[0].scale = [
    0.3,
    0.3,
    0.3
];
boringSword.components[0].rotation = [
    0,
    0,
    0,
    0
];


export { boringSword };

