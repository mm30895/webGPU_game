import { Audio } from '../scene/Audio.js';

export class Minotaur {
    constructor(minotaur, minotaurTrig, scene, player, ambientMusic, wall, entWall, isMinion, boundries) {
        this.minotaur = minotaur;
        this.currentNode = minotaur;
        this.player = player;
        this.wall = wall;
        this.isMinion = isMinion;
        this.entWall = entWall;
        this.minotaurTrig = minotaurTrig;

        this.hp = 100;
        this.isDead = false;

        this.scene = scene;
        this.ambientMusic = ambientMusic;

        this.randomMovementTimer = 0;
        this.targetPosition = null;
        this.speed = 10;
        this.boundaries = boundries;

        this.hitTimer = 100;
        this.hitTimerMax = 100;

        this.minotaurHit = false; // if hit "animate"
        this.minotaurHitTimer = 0;
        this.originalRotation = [0, 0, 0, 0];
        this.hpBarInvisible();
    }

    setTranslation(x, y, z) {
        this.minotaurTrig.components[0].translation = [x, y, z];
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

    pickTarget() {
        const { xMin, xMax, zMin, zMax } = this.boundaries;
        return [
            Math.random() * (xMax - xMin) + xMin, 
            0,
            Math.random() * (zMax - zMin) + zMin
        ];
    }

    moveToTarget(dt) {
        if (!this.targetPosition) return;
    
        const currPosition = this.currentNode.components[0].translation;
        const direction = [
            this.targetPosition[0] - currPosition[0],
            0,
            this.targetPosition[2] - currPosition[2],
        ];
    
        const distance = Math.sqrt(
            direction[0] ** 2 +
            direction[1] ** 2 +
            direction[2] ** 2
        );
    
        if (distance < 0.1) {
            this.targetPosition = null;
            return;
        }
    
        const normDirection = [
            direction[0] / distance,
            0,
            direction[2] / distance,
        ];
    
        const movement = [
            normDirection[0] * this.speed * dt,
            0,
            normDirection[2] * this.speed * dt,
        ];
    
        // movement stays within boundaries
        const nextPosition = [
            Math.min(Math.max(currPosition[0] + movement[0], this.boundaries.xMin), this.boundaries.xMax),
            currPosition[1],
            Math.min(Math.max(currPosition[2] + movement[2], this.boundaries.zMin), this.boundaries.zMax),
        ];
    
        this.setTranslation(nextPosition[0], nextPosition[1], nextPosition[2]);
    }

    onTrigger() {
        console.log("we hereew")
        if(!this.isDead) {
            if (this.player.hit) {
                this.hitTimer -= 1;
                if (this.hitTimer <= 0) {
                    this.hitTimer = this.hitTimerMax; 
                    if(this.isMinion){
                        this.takeDamage(this.player.awsome ? 30 : 15);
                    }else{
                        this.takeDamage(this.player.awsome ? 15 : 5);
                    }
                }
            }
    
            this.player.minotaurHitTimer -= 0.1;
            if (this.player.minotaurHitTimer <= 0) {
                this.minotaurHit = true;
                this.player.minotaurHitTimer = 50; 
                
                this.isMinion? this.player.hp -= 10: this.player.hp -= 20; 
                console.log("Player HP: ", this.player.hp);
    
                // camera shake
                this.player.shake(0.07, 0.1, 0, true);
            }
        }
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
        if(this.isMinion) {
            this.setRotation(-0.707, 0,0, 0.707);
        }else {
            this.setRotation(-0.707, 0, 0, 0.707);
        }

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
    resetHpBar(){
        const hpBar = document.getElementById("hp-bar-minotaur");
        if (hpBar) {
            const hpPercentage = 100; 
            hpBar.style.width = `${hpPercentage}%`;
        }
    }

    getRotation() {
        return [...this.currentNode.components[0].rotation];
    }


    update(t, dt) {
        
        if(!this.isDead) {
            // the movement ai xD
            if (!this.targetPosition || this.randomMovementTimer <= 0) {
                this.targetPosition = this.pickTarget();
                this.randomMovementTimer = Math.random() * 2 + 3;
            } else {
                this.randomMovementTimer -= dt;
            }
            this.moveToTarget(dt);

            this.updateHPBar();
            if (this.minotaurHit) {
                if (this.minotaurHitTimer === 0) {
                    this.originalRotation = this.getRotation();
                }
                if(this.isMinion) {
                    this.setRotation(0, -0.931506, 0, -0.363725);
                }else{
                    this.setRotation(0.059492, -0.356913, 0.02273, 0.932242);
                }
                this.minotaurHitTimer = 1; 
                this.minotaurHit = false;
            }
        
            if (this.minotaurHitTimer > 0) {
                this.minotaurHitTimer -= dt;
                if (this.minotaurHitTimer <= 0) {
                    if(this.isMinion) {
                        this.setRotation(0,-1,0,0);
                    }else{
                        this.setRotation(0,0,0,0);
                    }
                }
            }
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
