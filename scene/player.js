import { quat, vec3, vec4 } from 'glm';
import { Transform } from 'engine/core/Transform.js';
import { Light } from './Light.js';
import { Audio } from '../scene/Audio.js';

export class Player {
    constructor(
        node,
        domElement,
        sword,
        awsomeSword,
        light,
        {
            pitch = 0,
            yaw = 0,
            moveSpeed = 40,
            pointerSensitivity = 0.002,
            
        } = {}
    ) {
        this.node = node;
        this.domElement = domElement;
        this.sword = sword;
        this.awsomeSword = awsomeSword;
        this.light = light;

        this.keys = {};

        this.pitch = pitch;
        this.yaw = yaw;

        this.moveSpeed = moveSpeed;
        this.pointerSensitivity = pointerSensitivity;
        this.staticRotation = new vec4(0.1, 0.8, 0, 0);
        this.hit = false;
        this.hittimer = 1000;
        this.rotationTimer = 0; 
        this.rotationDuration = 0.5; 

        this.hp = 100;

        this.minotaurHitTimer = 50;

        this.pickup = false;
        this.audio = new Audio();
        this.effect = new Audio();

        this.awsome = false;
        this.paused = false;

        this.initHandlers();
        this.initChildTransforms();
    }

    initHandlers() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.mousedownHandler = this.mousedownHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);
        doc.addEventListener('mousedown', this.mousedownHandler);

        element.addEventListener('click', () => element.requestPointerLock());

        doc.addEventListener('pointerlockchange', () => {
            if (doc.pointerLockElement === element) {
                doc.addEventListener('pointermove', this.pointermoveHandler);
                this.paused = false;
            } else {
                doc.removeEventListener('pointermove', this.pointermoveHandler);
                console.log("pressed esc");
                this.paused = true;
                //window.location.href = "pauseScreen.html"
            }
        });
    }

    mousedownHandler(e) {
        if (e.button === 0) { // Left mouse button
            if (!this.hit) {
                this.staticRotation = new vec4(0.3, -0.9, 0.3, 0); // sword animation
                this.hit = true;
                this.rotationTimer = 0;

                this.effect.playEffect('./audio/stabby stabby.mp3');
            }
        }
    }

    shake(factor, length, timer, hit) {
        this.shkIntensity = factor;
        this.shkLength = length;
        this.shkTimer = timer;
        this.shkTime = 0;
        this.shaking = true;
        this.hit = hit
    }

    initChildTransforms() {
        const cameraPos = this.node.getComponentOfType(Transform).translation;

        for (const child of this.node.children) {
            const childTransform = child.getComponentOfType(Transform);
            if (childTransform) {
                // Calculate and store the initial relative position from the camera
                childTransform.initialRelativePos = vec3.create();
                vec3.sub(childTransform.initialRelativePos, childTransform.translation, cameraPos);
            }
        }
    }

    updateChildTransform(child, cameraPos, rotation) {
        const childTransform = child.getComponentOfType(Transform);
        if (!childTransform) return;

        const rotatedPos = vec3.create();
        vec3.transformQuat(rotatedPos, childTransform.initialRelativePos, rotation);
        vec3.add(childTransform.translation, cameraPos, rotatedPos);

        const staticRotation = quat.create();
        if (this.hit) {
            quat.multiply(staticRotation, rotation, this.staticRotation);
            childTransform.rotation = staticRotation;
        } else {
            childTransform.rotation = rotation;
        }
    }
    updateHPBar() {
        const hpBar = document.getElementById('hp-bar');
        if (hpBar) {
            const hpPercentage = Math.max(1, this.hp); // give 1 last hp XD
            hpBar.style.width = `${hpPercentage}%`;
        }
    }

    update(t, dt) {
        //if dead
        if (this.hp <= 0) {
            // Navigate to death screen
            window.location.href = "deathScreen.html";
            return; // Stop further updates
        }
        this.updateHPBar();

        if (this.keys['KeyP']) {
            this.awsomeSword.visible = true;
            this.sword.visible = false;
            this.awsome = true;
        }
        if (this.keys['KeyO']) {
            this.awsomeSword.visible = false;
            this.sword.visible = true;
            this.awsome = false;
        }


        // Update the timer for rotation duration
        if (this.hit) {
            this.rotationTimer += dt;
            if (this.rotationTimer >= this.rotationDuration) {
                this.staticRotation = new vec4(0.1, 0.8, 0, 0);// Reset to default rotation
                this.hit = false;
            }
        }

        // Calculate forward and right vectors.
        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        const forward = [-sin, 0, -cos];
        const right = [cos, 0, -sin];

        // audio instance for playing the sound of footsteps (plays during keypress)
        const moving = this.keys['KeyW'] || this.keys['KeyA'] || this.keys['KeyS'] || this.keys['KeyD'];
        if (moving && !this.audio.isPlaying) {
            this.audio.playFootsteps('./audio/walking.mp3');
        }
        
        // camera shaking during walking
        if (moving && !this.shaking) {
            this.shake(0.05, 0.01, 0.0058, false);
        }

        if (this.shaking) {
            this.shkTime += dt;
            this.shkTimer -= dt;

            if (this.shkTime > this.shkLength) {
                this.shaking = false;
            } else {
                const transform = this.node.getComponentOfType(Transform);
                if (transform && this.shkTimer <= 0) {
                    const shkY = (Math.random() * 2 - 1) * this.shkIntensity;
                    transform.translation[1] += shkY;

                    if (this.hit) {
                        const shkX = (Math.random() * 2 - 1) * this.shkIntensity;
                        const shkZ = (Math.random() * 2 - 1) * this.shkIntensity;

                        transform.translation[0] += shkX;
                        transform.translation[2] += shkZ;
                    }
                    this.shkTimer = 0.0058;
                }
            }
        }

        // Constant movement in the direction of keys pressed
        const acc = vec3.create();
        if (this.keys['KeyW']) vec3.add(acc, acc, forward);
        if (this.keys['KeyS']) vec3.sub(acc, acc, forward);
        if (this.keys['KeyD']) vec3.add(acc, acc, right);
        if (this.keys['KeyA']) vec3.sub(acc, acc, right);

        // Normalize direction to avoid faster diagonal movement
        vec3.normalize(acc, acc);

        // Update position based on constant speed
        const transform = this.node.getComponentOfType(Transform);
        if (transform) {
            vec3.scaleAndAdd(transform.translation, transform.translation, acc, this.moveSpeed * dt);

            const rotation = quat.create();
            quat.rotateY(rotation, rotation, this.yaw);
            quat.rotateX(rotation, rotation, this.pitch);

            transform.rotation = rotation;

            const cameraPos = transform.translation;
            this.updateChildTransform(this.sword, cameraPos, rotation);
            this.updateChildTransform(this.awsomeSword, cameraPos, rotation);

            const childLight = this.light.getComponentOfType(Light);
            if (childLight) {
                const lightDirection = vec3.create();
                vec3.transformQuat(lightDirection, [0, 0, -1], rotation); // Transform forward vector by camera rotation
                vec3.copy(childLight.position, cameraPos);
            }
        }
    }

    pointermoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;

        this.pitch -= dy * this.pointerSensitivity;
        this.yaw -= dx * this.pointerSensitivity;

        const twopi = Math.PI * 2;
        const halfpi = Math.PI / 2;

        this.pitch = Math.min(Math.max(this.pitch, -halfpi), halfpi);
        this.yaw = ((this.yaw % twopi) + twopi) % twopi;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }
}