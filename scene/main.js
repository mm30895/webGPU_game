import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';

import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { Renderer } from './renderer.js';

import { Camera, Model, Node, Transform } from 'engine/core.js';

import {
    calculateAxisAlignedBoundingBox,
    mergeAxisAlignedBoundingBoxes,
} from 'engine/core/MeshUtils.js';

import { Physics } from './Physics.js';
import { minotaurNode, minotaurTriggerNode} from '../objects/minotaurLoader.js';
import { minionNode, minionTriggerNode} from '../objects/minionLoader.js';
import { chestClosed, chestTrigger, chestCollider } from '../objects/chestClosed.js';
import { chestOpened } from '../objects/cehstOpened.js';
import { ChestTrigger } from '../objects/chestTrigger.js';
import { BoringSword } from '../objects/boringSword.js';
import { SuperSword } from '../objects/superSword.js';
import { Light } from './Light.js';
import { Player } from './player.js';
import { Chest } from '../objects/chest.js';
import { Minotaur } from '../objects/minotaur.js';
import { Audio } from './Audio.js';
import { mainEntry, enemyEntry, enemyExit, mainExit } from './triggerDoors/triggerDoors.js';

const canvas = document.getElementById("canvas")
const renderer = new Renderer(canvas);
await renderer.initialize();

//ambient music
const music = new Audio();
// document.addEventListener('click', () => {
//     music.playMusic('./audio/the 14th sacrifice.mp3');
// });

const loader = new GLTFLoader();
await loader.load('assets/Labirint4gltf.gltf');
const scene = loader.loadScene('Scene');
const camera = loader.loadNode('Camera.001');
if (!camera) {
    console.log("Camera node 'Camera.001' not found in the GLTF file.");
}

//loading the objects
const boringSword = new BoringSword('assets/boring_sword.gltf', 'Cube.004');
await boringSword.load();
boringSword.getNode().visible = true;
camera.addChild(boringSword.getNode());

const superSword = new SuperSword('assets/cool_sword.gltf', 'Cube.006');
await superSword.load();
superSword.getNode().visible = false;
camera.addChild(superSword.getNode())


// light
const light = new Node();
light.addComponent(new Light());
// light.addComponent(new Camera({
//     near: 5,
//     far: 20,
//     fovy: 0.3,
// }));
light.addComponent(new Transform());
camera.addChild(light);

// player
camera.addComponent(new Player(camera, canvas, boringSword.getNode(), superSword.getNode(), light));
camera.isDynamic = true;
camera.aabb = {
    min: [-1, -1, -1],
    max: [5, 10, 5],
};

//load scene
loader.loadNode('tla').visible = true;
for(var i = 1; i <= 41; i++) {
    if (loader.loadNode(`wall.0${i}`) == null) {
    }
    loader.loadNode(`wall.0${i}`).isStatic = true;
    loader.loadNode(`wall.0${i}`).visible = true;
}


//close the end wall
const wall = loader.loadNode('wall.042');
wall.isStatic = true;
wall.visible = true;
wall.addComponent(Transform);
wall.components[0].translation = [-171.852, 22.8936, -61.0778];
const wall2 = loader.loadNode('wall.043');
wall2.isStatic = true;
wall2.visible = true;
wall2.addComponent(Transform);
wall2.components[0].translation = [50.849 , 22.8936, 27];

//minotaur trigger
let minotaur = new Minotaur(minotaurNode, scene,  camera.components[2], music, wall, false);
minotaurTriggerNode.triggerHandler = minotaur;
scene.addChild(minotaur.getNode());
scene.addChild(minotaurTriggerNode);
//minion trigger
let minion = new Minotaur(minionNode, scene,  camera.components[2], music, wall2, true);
minionTriggerNode.triggerHandler = minion;
scene.addChild(minion.getNode());
scene.addChild(minionTriggerNode);


// chest trigger 
let chest = new Chest(chestClosed, chestOpened, scene, camera.components[2]);
const chestTriggerN = new ChestTrigger(chestTrigger, chest);
const chestTriggerNode = chestTriggerN.getNode();
chestTriggerNode.visible = false;
chestTriggerNode.isTrigger = true;
chestTriggerNode.triggerHandler = chestTriggerN;

chestCollider.isStatic = true;
chestCollider.visible = false;
scene.addChild(chestCollider);
scene.addChild(chestTriggerNode);
scene.addChild(chest.currentNode);

/*
* ## trigger doors
*/
var mainTrig = loader.loadNode('Trigger.001');
var mainEntryTrig = new mainEntry(music);
mainTrig.isTrigger = true;
mainTrig.visible = false;
mainTrig.triggerHandler = mainEntryTrig;
const combatMusic = new Audio();
var enemyEntTrig = loader.loadNode('Trigger.002');
var enemyEntTrigH = new enemyEntry(music, minion, combatMusic);
enemyEntTrig.isTrigger = true;
enemyEntTrig.visible = false;
enemyEntTrig.triggerHandler = enemyEntTrigH;
const music2 = new Audio();
var enemyExtTrig = loader.loadNode('Trigger.003');
var enemyExtTrigH = new enemyExit(music2, minion, combatMusic);
enemyExtTrig.isTrigger = true;
enemyExtTrig.visible = false;
enemyExtTrig.triggerHandler = enemyExtTrigH;
const combatMusic2 = new Audio();
var enemyEntTrigBoss = loader.loadNode('Trigger.004');
var enemyEntTrigBossH = new enemyEntry(music2, minotaur, combatMusic2);
enemyEntTrigBoss.isTrigger = true;
enemyEntTrigBoss.visible = false;
enemyEntTrigBoss.triggerHandler = enemyEntTrigBossH;
const music3 = new Audio();
var mainExitTrig = loader.loadNode('Trigger.005');
var mainExitTrigH = new mainExit(music3, minotaur, combatMusic2);
mainExitTrig.isTrigger = true;
mainExitTrig.visible = false;
mainExitTrig.triggerHandler = mainExitTrigH;


// set the colliders
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

    minotaur.update(time, dt);
    minion.update(time, dt);
    physics.update(time, dt);
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}


new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
