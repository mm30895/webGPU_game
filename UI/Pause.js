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
        context.drawImage(this.image1, 0, 0, this.image1.width, this.image1.height);
    }
}