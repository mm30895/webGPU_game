export class Light {

    constructor({
        color = [ 1, 1, 1], // white
        direction = [0, 1, 0],
        initialRelativePos = [0, 0, -2], // Light positioned 2 units in front of the camera
    } = {}){
        this.color = color;
        this.direction= direction;
        this.initialRelativePos = initialRelativePos;
    }
}