import { vec3, mat4 } from '../../../lib/gl-matrix-module.js';
import { getGlobalModelMatrix } from '../engine/core/SceneUtils.js';
import { PlayerGameLogic } from './playerGameLogic.js';

export class Tripwire {

    constructor({
        tripwireNode,
        playerNode,
        passObject,
        marginX = 1,
        marginZ = 1,
        repeat = false,
        triggerNodes,

    } = {}) {
        this.tripwireNode = tripwireNode;
        this.playerNode = playerNode;
        this.passObject = passObject;
        this.marginX = marginX;
        this.marginZ = marginZ;
        this.repeat = repeat;
        this.triggerNodes = triggerNodes;

        this.triggered = false;
 

    }

    update() {

        if(this.triggered){
            if(this.repeat){
                this.remainingTime -= this.timer.currTime - this.timer.lastTime;
                if(this.remainingTime < 0){
                    this.triggered = false;
                    this.remainingTime = this.cooldown;
                }
                else{
                    return;
                }
            } else {
                return;
            }
        }

        let tripwire = mat4.getTranslation(vec3.create(), getGlobalModelMatrix(this.tripwireNode));
        let player = mat4.getTranslation(vec3.create(), getGlobalModelMatrix(this.playerNode));

        if(Math.abs(tripwire[0]-player[0]) < this.marginX && Math.abs(tripwire[2]-player[2]) <this.marginZ){
            
            this.triggered = true;
            for(const node of this.triggerNodes){
                for (const component of node.components) {
                    component.trigger?.(this.passObject);
                }
            }
        }
    }

}