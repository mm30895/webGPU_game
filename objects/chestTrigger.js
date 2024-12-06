export class ChestTrigger {
    constructor(chestTrigger, chest) {
        this.chestTrigger = chestTrigger;

        this.chest = chest;
    }
    getNode() {
        return this.chestTrigger;
    }
    onTrigger() {
        this.chest.openChest();
    }
}
