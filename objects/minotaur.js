import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/minotaur.gltf', import.meta.url));

const minotaur = gltfLoader.loadNode('Cube');
//console.log(minotaur)

const transform = minotaur.components[0]; // The first component is the Transform
// Update the translation property
transform.translation = [-10, 7, 0];
//console.log(minotaur)
minotaur.update = (time, dt) => {
    //

};

export { minotaur };
