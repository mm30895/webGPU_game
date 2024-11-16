import {vec3, quat} from 'glm'

export class Light {

    constructor({
        color = [ 1, 1, 1], // white
        direction = [0, 1, 0],
        initialRelativePos = [0, 0,-2], // Light positioned 2 units in front of the camera
    } = {}){
        this.color = color;
        this.direction= direction;
        this.initialRelativePos = initialRelativePos;

        this.prevCameraPos = [0, 0, 0];
        this.prevCameraRotation = quat.create();
        
    }

    updatePosition(cameraPos, cameraRotation) {
        // if the camera's position or rotation has changed
        if (!this.isCameraUpdated(cameraPos, cameraRotation)) {
            return; // Skip updating light position if camera hasn't changed
        }

        // Calculate the rotated position based on the camera's rotation
        const rotatedPos = vec3.create();
        vec3.transformQuat(rotatedPos, this.initialRelativePos, cameraRotation);

        // Update the light's position based on the camera's position
        vec3.add(this.initialRelativePos, cameraPos, rotatedPos);

        // Optionally, update the light's direction based on the camera's rotation
        vec3.set(this.direction, -rotatedPos[0], -rotatedPos[1], -rotatedPos[2]);
        vec3.normalize(this.direction, this.direction);

        // Update the previous camera state for next frame comparison
        this.prevCameraPos = [...cameraPos];
        quat.copy(this.prevCameraRotation, cameraRotation);
    }

    isCameraUpdated(cameraPos, cameraRotation) {
        return !vec3.equals(this.prevCameraPos, cameraPos) || !quat.equals(this.prevCameraRotation, cameraRotation);
    }
}