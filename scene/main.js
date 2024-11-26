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
import { minotaur } from '../objects/minotaur.js';
import { chestClosed } from '../objects/chestClosed.js';
import { chestOpened } from '../objects/cehstOpened.js';
import { BoringSword } from '../objects/boringSword.js';
import { SuperSword } from '../objects/superSword.js';
import { Light } from './Light.js';
import { Player } from './player.js';
import { Audio } from './Audio.js';

const canvas = document.getElementById("canvas")
const renderer = new Renderer(canvas);
await renderer.initialize();

const music = new Audio();
document.addEventListener('click', () => {
    music.playMusic('./audio/the 14th sacrifice.mp3');
});

const loader = new GLTFLoader();
await loader.load('assets/scene2-6.gltf');
//const scene = loader.loadScene(loader.defaultScene);
const scene = loader.loadScene('Scene');
const camera = loader.loadNode('Camera');

//loading the objects
const boringSword = new BoringSword('assets/boring_sword.gltf', 'Cube.004');
await boringSword.load();
boringSword.getNode().visible = true;
//console.log(boringSword.getNode())
camera.addChild(boringSword.getNode());

const superSword = new SuperSword('assets/cool_sword.gltf', 'Cube.006');
await superSword.load();
superSword.getNode().visible = false;
//console.log(superSword.getNode())
camera.addChild(superSword.getNode())

const light = new Node();
light.addComponent(new Light());
light.addComponent(new Transform());
camera.addChild(light);

const light2 = new Node();
light2.addComponent(new Light());
scene.addChild(light2)
console.log(camera)

camera.addComponent(new Player(camera, canvas, boringSword.getNode(), superSword.getNode(), light));
camera.isDynamic = true;
camera.aabb = {
    min: [-0.5, -2, -0.5],
    max: [0.5, 0.7, 0.5],
};

loader.loadNode('Plane.001').isStatic = true;
loader.loadNode('Plane.002').isStatic = true;
loader.loadNode('Plane').isStatic = true;


// add the obj

scene.addChild(minotaur);
scene.addChild(chestOpened);
//scene.addChild(superSword);
//scene.addChild(boringSword);

//console.log(boringSword);
minotaur.isStatic = true;
//console.log(scene)
//camera.addChild(boringSword);



console.log(camera)
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
