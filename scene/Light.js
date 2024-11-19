import {vec3, quat} from 'glm'

export class Light {

    constructor({
        color = [ 255, 255, 255], // white
        direction = [0, 1, 0],
        initialRelativePos = [12.2,
            7.299824600219727,
            -2],     
    } = {}){
        this.color = color;
        this.direction= direction;
        this.initialRelativePos = initialRelativePos;

        this.prevCameraPos = [ 12.828324317932129,
            7.669824600219727,
            0];
        this.prevCameraRotation = quat.create();
        
    }

    // updatePosition(cameraPos, cameraRotation) {
    //     if (!this.isCameraUpdated(cameraPos, cameraRotation)) {
    //         return;
    //     }

    //     // Calculate the rotated position based on the camera's rotation
    //     const rotatedPos = vec3.create();
    //     vec3.transformQuat(rotatedPos, this.initialRelativePos, cameraRotation);

    //     // Update the light's position based on the camera's position
    //     vec3.add(this.initialRelativePos, cameraPos, rotatedPos);

    //     // Optionally, update the light's direction based on the camera's rotation
    //     vec3.set(this.direction, -rotatedPos[0], -rotatedPos[1], -rotatedPos[2]);
    //     vec3.normalize(this.direction, this.direction);

    //     // Update the previous camera state for next frame comparison
    //     this.prevCameraPos = [...cameraPos];
    //     quat.copy(this.prevCameraRotation, cameraRotation);
    // }

    // isCameraUpdated(cameraPos, cameraRotation) {
    //     return !vec3.equals(this.prevCameraPos, cameraPos) || !quat.equals(this.prevCameraRotation, cameraRotation);
    // }
}