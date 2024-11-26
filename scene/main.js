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
import { minotaurNode} from '../objects/minotaur1.js';
import { chestClosed } from '../objects/chestClosed.js';
import { chestOpened } from '../objects/cehstOpened.js';
import { ChestTrigger } from '../objects/chestTrigger.js';
import { BoringSword } from '../objects/boringSword.js';
import { SuperSword } from '../objects/superSword.js';
import { Light } from './Light.js';
import { Player } from './player.js';
import { Chest } from '../objects/chest.js';
import { Minotaur } from '../objects/minotaur.js';
import { Audio } from './Audio.js';

const canvas = document.getElementById("canvas")
const renderer = new Renderer(canvas);
await renderer.initialize();

const music = new Audio();
document.addEventListener('click', () => {
    music.playMusic('./audio/the 14th sacrifice.mp3');
});

const loader = new GLTFLoader();
await loader.load('assets/scene2-7.gltf');
//const scene = loader.loadScene(loader.defaultScene);
const scene = loader.loadScene('Scene');
const camera = loader.loadNode('Camera.001');

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
    min: [-1, -1, -1],
    max: [5, 10, 5],
};
for(var i = 1; i <= 9; i++) {
    loader.loadNode(`Cube.00${i}`).isStatic = true;
    loader.loadNode(`Cube.00${i}`).visible = true;
}
for(var i = 1; i <= 1; i++) {
    loader.loadNode(`Trigger.00${i}`).visible = false;
    loader.loadNode(`Trigger.00${i}`).isTrigger = true;
}

console.log(camera)

// minotaur trigger
// let minotaur = new Minotaur(minotaurNode, scene,  camera.components[2]);
// minotaurTriggerNode.triggerHandler = minotaur;
// scene.addChild(minotaur.getNode());
// scene.addChild(minotaurTriggerNode);

scene.addChild(minotaurNode);


// chest trigger 
let chest = new Chest(chestClosed, chestOpened, scene, camera.components[2]);
const chestTrigger = new ChestTrigger('assets/chestTrigger.gltf', 'Trigger.001', chest);
await chestTrigger.load();

const chestTriggerNode = chestTrigger.getNode();
chestTriggerNode.visible = true;
chestTriggerNode.isTrigger = true;
chestTriggerNode.triggerHandler = chestTrigger;

scene.addChild(chestTriggerNode);
scene.addChild(chest.currentNode);

console.log("scene", scene)

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
