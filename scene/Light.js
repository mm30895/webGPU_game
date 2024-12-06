import {vec3, quat} from 'glm'

export class Light {

    constructor({
        //resolution = [512, 512],
        color = [ 1.0, 0.9, 0.9], // white
        direction = [0, 1, 0],
        position = [12.2,
            7.299824600219727,
            -2],     
    } = {}){
        //this.resolution = resolution;
        this.color = color;
        this.direction= direction;
        this.position = position;

        this.prevCameraPos = [ 12.828324317932129,
            7.669824600219727,
            0];
        this.prevCameraRotation = quat.create();
        
    }
}