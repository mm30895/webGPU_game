import { Audio } from '../scene/Audio.js';
const combatMusic = new Audio();

export class Minotaur {
    constructor(minotaur, scene, player, ambientMusic, wall) {
        this.minotaur = minotaur;
        this.currentNode = minotaur;
        this.player = player;
        this.wall = wall;

        this.hp = 100;
        this.isDead = false;

        this.scene = scene;
        this.ambientMusic = ambientMusic;

        this.hitTimer = 100;
        this.hitTimerMax = 100;

        this.minotaurHit = false; // if hit "animate"
        this.minotaurHitTimer = 0;
        this.originalRotation = [0, 0, 0, 0];
        this.hpBarInvisible();
    }

    setTranslation(x, y, z) {
        this.currentNode.components[0].translation = [x, y, z];
    }

    setScale(x, y, z) {
        this.currentNode.components[0].scale = [x, y, z];
    }

    setRotation(x, y, z, w) {
        this.currentNode.components[0].rotation = [x, y, z, w];
    }

    getNode() {
        return this.minotaur;
    }

    onTrigger() {
        //this.ambientMusic.stop();
        //combatMusic.playMusic('./audio/Combat Music.mp3');
        if(!this.isDead) {
            if (this.player.hit) {
                this.hitTimer -= 1;
                if (this.hitTimer <= 0) {
                    this.hitTimer = this.hitTimerMax; 
                    this.takeDamage(this.player.awsome ? 15 : 5);
                }
            }
    
            this.player.minotaurHitTimer -= 0.1;
            if (this.player.minotaurHitTimer <= 0) {
                this.minotaurHit = true;
                this.player.minotaurHitTimer = 50; 
                this.player.hp -= 25; 
                console.log("Player HP: ", this.player.hp);
    
                // camera shake
                this.player.shake(0.07, 0.1, 0, true);
            }
        }

        //this.hpBarVisible();
    }

    takeDamage(amount) {
        this.hp -= amount;
        console.log(`Minotaur HP: ${this.hp}`);
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        console.log("Minotaur died");

        this.hpBarInvisible();

        // open the wall
        this.wall.components[0].translation = [-36.4799 ,22.6679 ,  -53.0416  ];
        this.wall.visible = false;
    }

    updateHPBar() {
        const hpBar = document.getElementById("hp-bar-minotaur");
        if (hpBar) {
            const hpPercentage = Math.max(0, this.hp); 
            hpBar.style.width = `${hpPercentage}%`;
        }
    }

    getRotation() {
        return [...this.currentNode.components[0].rotation];
    }
    
    update(t, dt) {
        this.updateHPBar();
        
        // if (this.isDead) {
        //     window.location.href = "winScreen.html";
        //     return; 
        // }
        
        if(!this.isDead){
            if (this.minotaurHit) {
                if (this.minotaurHitTimer === 0) {
                    this.originalRotation = this.getRotation();
                }
     
                this.setRotation(0.059492, -0.356913, 0.02273, 0.932242);
                //console.log("Hit animation");
        
                this.minotaurHitTimer = 1; 
                this.minotaurHit = false;
            }
        
        }
        if (this.minotaurHitTimer > 0) {
            this.minotaurHitTimer -= dt;
            if (this.minotaurHitTimer <= 0) {
                this.setRotation(0,0,0,0);
                //console.log("Returning to original rotation");
            }
            //console.log("holla", this.minotaurHitTimer)
        }
    }
    

    hpBarVisible() {
        const hpBar = document.getElementById("hp-container-minotaur");
        if (hpBar) {
            hpBar.style.display = "block";
        }
    }

    hpBarInvisible() {
        const hpBar = document.getElementById("hp-container-minotaur");
        if (hpBar) {
            hpBar.style.display = "none";
        }
    }

   
}
