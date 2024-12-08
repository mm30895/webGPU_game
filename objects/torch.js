import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { Transform, Node } from '../engine/core.js';

const gltfLoader = new GLTFLoader();
await gltfLoader.load(new URL('assets/torch.gltf', import.meta.url));

const torchScene = gltfLoader.loadScene(gltfLoader.defaultScene);

torchScene.visible = true;
const torch = gltfLoader.loadNode('Cube');
const torchhead = gltfLoader.loadNode('Sphere');
torch.addChild(torchhead);
torch.visible = true;

var trchheadTrans = torchhead.getComponentOfType(Transform);
trchheadTrans.translation = [0, 0.6, 0];
trchheadTrans.scale = [0.4 * 1.7262724041938782, 0.4 * 0.7262724041938782, 0.4 * 1.7262724041938782];

var trchTrans = torch.getComponentOfType(Transform);
trchTrans.translation = [-70.7, 8.7, 167.6];
trchTrans.scale = [0.1* 0.5992628931999207, 0.1 * 2.705570936203003, 0.1 * 0.5992628931999207];

export { torch };