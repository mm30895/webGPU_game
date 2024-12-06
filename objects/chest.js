import { Audio } from '../scene/Audio.js';

export class Chest {
    constructor(
        chestClosed,
        chestOpened,
        scene,
        player,
    ) {
        this.chestClosed = chestClosed;
        this.chestOpened = chestOpened;
        this.currentNode = chestClosed;

        this.player = player;

        this.isOpened = false;

        this.scene = scene;
    }


    updateNodeTransform() {
        const { translation, scale, rotation } = this.triggerNode.components[0];
        this.chestClosed.components[0].translation = [...translation];
        this.chestClosed.components[0].scale = [...scale];
        this.chestClosed.components[0].rotation = [...rotation];
        
        this.chestOpened.components[0].translation = [...translation];
        this.chestOpened.components[0].scale = [...scale];
        this.chestOpened.components[0].rotation = [...rotation];
    }

    setTranslation(x, y, z) {
        this.triggerNode.components[0].translation = [x, y, z];
        this.updateNodeTransform();
    }

    setScale(x, y, z) {
        this.triggerNode.components[0].scale = [x, y, z];
        this.updateNodeTransform();
    }

    setRotation(x, y, z, w) {
        this.triggerNode.components[0].rotation = [x, y, z, w];
        this.updateNodeTransform();
    }

    

    openChest(scene) {
        if (!this.isOpened) {
            this.isOpened = true;

            this.scene.removeChild(this.chestClosed);
            this.scene.addChild(this.chestOpened);
            this.currentNode = this.chestOpened;

            const effect = new Audio();
            effect.playEffect('./audio/chest effect.mp3');
            console.log("Chest has been opened!");
            console.log(this.chestOpened);
            
            setTimeout(() => {
                console.log("Timer triggered: Sword visibility updated.");
                this.player.awsomeSword.visible = true;
                this.player.sword.visible = false;
                this.player.awsome = true;
                this.chestOpened.removeChild(this.chestOpened.children[0]);
            }, 1000); // 1 second delay

        }
    }

    
}
