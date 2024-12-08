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
import { torch } from '../objects/torch.js';
import { Light } from './Light.js';
import { Player } from './player.js';
import { Chest } from '../objects/chest.js';
import { Minotaur } from '../objects/minotaur.js';
import { Audio } from './Audio.js';
import { mainEntry, enemyEntry, enemyExit, mainExit } from './triggerDoors/triggerDoors.js';
import { UIRenderer2D } from '../UI/UIRenderer2D.js';
import { Pause } from '../UI/Pause.js';
import { quat } from 'glm'

const canvas = document.getElementById("canvas")
const canvasFront = document.getElementById("canvasFront");
const renderer = new Renderer(canvas);
await renderer.initialize();
const UIRenderer = new UIRenderer2D(canvasFront);
await UIRenderer.init();

//ambient music
const music = new Audio();

const loader = new GLTFLoader();
await loader.load('assets/Labirint4.gltf');
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
light.addComponent(new Camera({
    near: 0.1,
    far: 300,
    fovy: 1,
}));
// light.addComponent(new Transform({
//     translation: [12.2,
//         7.299824600219727,
//         -2],
//     rotation: quat.create(),

// }));

camera.addChild(light);


camera.addChild(torch);
console.log("torch",camera)

// player
camera.addComponent(new Player(camera, canvas,torch, boringSword.getNode(), superSword.getNode(), light));
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
const wall3 = loader.loadNode('wall.044');
const wall4 = loader.loadNode('wall.045');

//minotaur trigger
var boudriesMinotaur = {// ai movement boundries
    xMin: -139.686,
    xMax: -64.7974,
    zMin: -100.475,
    zMax: 21.4433,
};
let minotaur = new Minotaur(minotaurNode, minotaurTriggerNode, scene,  camera.components[2], music, wall, wall4, false, boudriesMinotaur);
minotaurTriggerNode.triggerHandler = minotaur;
scene.addChild(minotaur.getNode());
scene.addChild(minotaurTriggerNode);
//minion trigger
var boudriesMinion = { // ai movement boundries
    xMin: 51.0223,
    xMax: 150.349,
    zMin:  9.2065,
    zMax: 72.9337,
};
let minion = new Minotaur(minionNode, minionTriggerNode, scene,  camera.components[2], music, wall2, wall3, true, boudriesMinion);
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

    if(!camera.components[2].paused) {

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
    
}
var pauseScreen = new Pause(canvasFront);
pauseScreen.init();

function render() {
    UIRenderer.context.clearRect(0, 0, UIRenderer.canvas.width, UIRenderer.canvas.height); //clear canvas
    renderer.render(scene, camera);
    
    if (camera.components[2].paused) {
        UIRenderer.render(pauseScreen);
    }
    /*if(minotaur.isDead)(
        UIRenderer.render()
    )*/
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}


new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
