import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';
import { GUI } from 'dat';

import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { Renderer } from './renderer.js';
import { FirstPersonController } from 'engine/controllers/FirstPersonController.js';

import { Camera, Model, Node, Transform } from 'engine/core.js';

import {
    calculateAxisAlignedBoundingBox,
    mergeAxisAlignedBoundingBoxes,
} from 'engine/core/MeshUtils.js';

import { Physics } from './Physics.js';
import { cube } from '../objects/cube.js';
import { minotaur } from '../objects/minotaur.js';
import { Light } from './Light.js';

const canvas = document.getElementById("canvas")
const renderer = new Renderer(canvas);
await renderer.initialize();



const loader = new GLTFLoader();
await loader.load('assets/scene2-5.gltf');
//const scene = loader.loadScene(loader.defaultScene);
const scene = loader.loadScene('Scene');
const camera = loader.loadNode('Camera');



camera.addComponent(new FirstPersonController(camera, canvas));
camera.isDynamic = true;
camera.aabb = {
    min: [-2, -2, -2],
    max: [2, 2, 2],
};

loader.loadNode('Plane.001').isStatic = true;
loader.loadNode('Plane.002').isStatic = true;
loader.loadNode('Plane').isStatic = true;
const sword = loader.loadNode('Cube');


// add the obj


scene.addChild(cube);
scene.addChild(minotaur);
minotaur.isStatic = true;
//console.log(scene)

const light = new Node();
camera.addChild(light);
light.addComponent(new Light());
light.addComponent(new Transform());
console.log(light)

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

    
    physics.update(time, dt);
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}
// const gui = new GUI();
// const controller = camera.getComponentOfType(FirstPersonController);
// gui.add(controller, 'pointerSensitivity', 0.0001, 0.01);
// gui.add(controller, 'maxSpeed', 0, 10);
// gui.add(controller, 'decay', 0, 1);
// gui.add(controller, 'acceleration', 1, 100);


new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
