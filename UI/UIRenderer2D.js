export class UIRenderer2D{

    constructor(canvas) {
        this.canvas = canvas;
    }

    init() {
        const context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = context;
        
    }

    render(layout) {
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height)
        
        layout.render(this.context)
        
    }


}