import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';
import { GUI } from 'dat';

import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { UnlitRenderer } from 'engine/renderers/UnlitRenderer.js';
import { FirstPersonController } from 'engine/controllers/FirstPersonController.js';

import { Camera, Model } from 'engine/core.js';

import {
    calculateAxisAlignedBoundingBox,
    mergeAxisAlignedBoundingBoxes,
} from 'engine/core/MeshUtils.js';

import { Physics } from './Physics.js';
import { cube } from '../objects/cube.js';
import { minotaur } from '../objects/minotaur.js';
import { sword } from '../objects/sword.js';


const canvas = document.querySelector('canvas');
const renderer = new UnlitRenderer(canvas);
await renderer.initialize();

const loader = new GLTFLoader();
await loader.load('assets/scene1-5.gltf');
//console.log(loader)
const scene = loader.loadScene(loader.defaultScene);
const camera = loader.loadNode('Camera1');

//camera.addChild(sword);

console.log(camera);
// Attach the sword to the camera
camera.addChild(sword);

// Adjust the sword's local position and rotation relative to the camera


camera.addComponent(new FirstPersonController(camera, canvas));
camera.isDynamic = true;
camera.aabb = {
    min: [-2, -2, -2],
    max: [2, 2, 2],
};

//scene.addChild(sword);
loader.loadNode('Plane.001').isStatic = true;
loader.loadNode('Plane.002').isStatic = true;
loader.loadNode('Plane').isStatic = true;

// add the obj
//console.log(cube)
scene.addChild(sword);
scene.addChild(cube);
scene.addChild(minotaur);
minotaur.isStatic = true;
//console.log(scene)

sword.addComponent(new FirstPersonController(sword, canvas));
sword.isDynamic = true;

const physics = new Physics(scene);
scene.traverse(node => {
    const model = node.getComponentOfType(Model);
    if (!model) {
        return;
    }

    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    node.aabb = mergeAxisAlignedBoundingBoxes(boxes);
});

function update(time, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
        node.update?.(time, dt);
    });

    const cameraTransform = camera.components[0];
    const swordTransform = sword.components[0];

    // Set the sword's position relative to the camera
    swordTransform.translation = [
        cameraTransform.translation[0] - 0.01 * Math.cos(cameraTransform.rotation[3]),
        cameraTransform.translation[1] - 0.5,
        cameraTransform.translation[2] - 1.0 * Math.cos(cameraTransform.rotation[3])
    ];

    // Copy the camera's rotation to the sword
    swordTransform.rotation = [...cameraTransform.rotation];
    
    physics.update(time, dt);
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}
const gui = new GUI();
const controller = camera.getComponentOfType(FirstPersonController);
gui.add(controller, 'pointerSensitivity', 0.0001, 0.01);
gui.add(controller, 'maxSpeed', 0, 10);
gui.add(controller, 'decay', 0, 1);
gui.add(controller, 'acceleration', 1, 100);


new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
