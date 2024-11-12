import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/sword.gltf', import.meta.url));

const sword = gltfLoader.loadNode('Sword');
//console.log(minotaur)

/*  camera
"rotation" : [
                -0.06480596214532852,
                0.6444295048713684,
                0.047500040382146835,
                0.7604305148124695
            ],
            "translation" : [
                12.934004783630371,
                5.38804292678833,
                0
            ]
*/

const swordTransform = sword.components[0];
swordTransform.translation = [0.5, -0.5, -1.0]; // Position in front of the camera
swordTransform.rotation = [0, 0, 0, 1]; 
swordTransform.scale = [0.1, 0.1, 0.1]; 
export { sword };
