export class Chest {
    constructor(
        chestClosed,
        chestOpened,
        scene,
        player,
    ) {
        this.chestClosed = chestClosed; // Model for the closed chest
        this.chestOpened = chestOpened; // Model for the opened chest
        this.currentNode = chestClosed;

        this.player = player;

        this.isOpened = false; // State to track if the chest has been opened

        this.scene = scene;
    }

    // async load() {
        
    //     // Set the default state to closed chest
    //     this.currentNode = this.chestClosed;
    //     //this.updateNodeTransform();
    // }

    updateNodeTransform() {
        // Ensure the opened and closed models share the same transform
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

            // Remove the closed chest node from the scene
            this.scene.removeChild(this.chestClosed);

            // Add the opened chest node to the scene
            this.scene.addChild(this.chestOpened);

            // Set the current node to the opened chest
            this.currentNode = this.chestOpened;

            console.log("Chest has been opened!");
            
            setTimeout(() => {
                console.log("Timer triggered: Sword visibility updated.");
                this.player.awsomeSword.visible = true;
                this.player.sword.visible = false;
            }, 1000); // 1 second delay
            //scene.addChild(this.player.awsomeSword)

        }
    }

    
}
