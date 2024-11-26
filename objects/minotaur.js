export class Minotaur {
    constructor(
        minotaur,
        scene,
        player,
    ) {
        this.minotaur = minotaur;
        this.currentNode = minotaur;
        this.player = player;

        this.hp = 100;
        this.isDead = false;
        this.isHit = false;

        this.scene = scene;
    }

    

    setTranslation(x, y, z) {
        this.currentNode.components[0].translation = [x, y, z];
        this.updateNodeTransform();
    }

    setScale(x, y, z) {
        this.currentNode.components[0].scale = [x, y, z];
        this.updateNodeTransform();
    }

    setRotation(x, y, z, w) {
        this.currentNode.components[0].rotation = [x, y, z, w];
        this.updateNodeTransform();
    }
    getNode() {
        return this.minotaur;
    }
    onTrigger() {
        
        //console.log(this.player.hit)
        if(this.player.hit) {
            //console.log("uwu");
            this.hp -= 0.1;
           // console.log(this.hp)
        }
        this.player.minotaurHitTimer -= 0.1;
        console.log(this.player.minotaurHitTimer )
    
    }
    addDamage() {
        
    }

    
}
