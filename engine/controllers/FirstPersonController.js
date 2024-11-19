import { quat, vec3 } from 'glm';

import { Transform } from '../core/Transform.js';
import { Light } from '../../scene/Light.js';

export class FirstPersonController {

    constructor(node, domElement, {
        pitch = 0,
        yaw = 0,
        velocity = [0, 0, 0],
        acceleration = 50,
        maxSpeed = 10,
        decay = 0.99999,
        pointerSensitivity = 0.002,
        lightSpeedFactor = 0.01,  // Added to control light speed
    } = {}) {
        this.node = node;
        this.domElement = domElement;

        this.keys = {};

        this.pitch = pitch;
        this.yaw = yaw;

        this.velocity = velocity;
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
        this.decay = decay;
        this.pointerSensitivity = pointerSensitivity;
        this.lightSpeedFactor = lightSpeedFactor;  // Store light speed factor

        this.initHandlers();
    }

    initHandlers() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);

        element.addEventListener('click', e => element.requestPointerLock());
        doc.addEventListener('pointerlockchange', e => {
            if (doc.pointerLockElement === element) {
                doc.addEventListener('pointermove', this.pointermoveHandler);
            } else {
                doc.removeEventListener('pointermove', this.pointermoveHandler);
            }
        });
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

    update(t, dt) {
        // Calculate forward and right vectors.
        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        const forward = [-sin, 0, -cos];
        const right = [cos, 0, -sin];

        // Map user input to the acceleration vector.
        const acc = vec3.create();
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            vec3.add(acc, acc, right);
        }
        if (this.keys['KeyA']) {
            vec3.sub(acc, acc, right);
        }

        // Update velocity based on acceleration.
        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

        // If there is no user input, apply decay.
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            const decay = Math.exp(dt * Math.log(1 - this.decay));
            vec3.scale(this.velocity, this.velocity, decay);
        }

        // Limit speed to prevent accelerating to infinity and beyond.
        const speed = vec3.length(this.velocity);
        if (speed > this.maxSpeed) {
            vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);
        }

        const transform = this.node.getComponentOfType(Transform);
        // Update the camera's translation based on velocity.
        if (transform) {
            
            vec3.scaleAndAdd(transform.translation, transform.translation, this.velocity, dt);
            const rotation = quat.create();
            // Create a rotation quaternion based on pitch and yaw.
            quat.rotateY(rotation, rotation, this.yaw);
            quat.rotateX(rotation, rotation, this.pitch);
            
            transform.rotation = rotation;
            const cameraPos = transform.translation;

            for (const child of this.node.children) {
                const childTransform = child.getComponentOfType(Transform);

                if (childTransform && childTransform.initialRelativePos) {
                    childTransform.rotation = rotation;
                    const rotatedPos = vec3.create();
                    vec3.transformQuat(rotatedPos, childTransform.initialRelativePos, rotation);

                    vec3.add(childTransform.translation, cameraPos, rotatedPos);
                }
                
                const childLight = child.getComponentOfType(Light);
                if (childLight) {
                    const light = childLight;
                    
                    const rotatedPos = vec3.create();
                    vec3.transformQuat(rotatedPos, light.initialRelativePos, rotation);
                    const adjustedPos = vec3.create();
                    vec3.scale(adjustedPos, rotatedPos, this.lightSpeedFactor);

                    vec3.add(light.initialRelativePos, cameraPos, adjustedPos);

                    vec3.set(light.direction, adjustedPos[0], adjustedPos[1], adjustedPos[2]);
                    vec3.normalize(light.direction, light.direction);
                }
            }
            
        }
    }

    pointermoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;

        this.pitch -= dy * this.pointerSensitivity;
        this.yaw   -= dx * this.pointerSensitivity;

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
