import { ImageLoader } from '../../engine/loaders/ImageLoader.js'


export class Pause {

    constructor ({
        canvas,
        imageUrl1 = "../UI/escMenu1.png",

    }) {
        this.canvas = canvas;

        this.imageUrl1 = imageUrl1;
    }

    async init() {
        const imageLoader = new ImageLoader();

        this.image1 = await imageLoader.load(this.imageUrl1)


    }

    render(context) {

    // Draw the image with the new dimensions
        context.drawImage(this.image1, 90, 90, 724, 910);
    }
}