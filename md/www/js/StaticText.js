const ALIGN_CENTER = 0;
const ALIGN_LEFT = 1;
const ALIGN_RIGHT = 2;

class StaticText extends GameObject {
    constructor(text, x, y, fontSize, color, alignment = ALIGN_LEFT) {
        super(null); 

        this.text = text;
        this.x = x;
        this.y = y;
        this.font = "Arial";
        this.fontSize = fontSize;
        this.color = color;

        this.visible = true;

        this.alignment = alignment;
    }

    changeText(text) {
        this.text = text;
    }

    render() {   
        if (!this.visible)
            return;

        ctx.font = this.fontSize + "px " + this.font;    
        this.width = ctx.measureText(this.text).width; 

        ctx.fillStyle = this.color;
        ctx.textBaseline = "middle";

        let positionX;

        switch(this.alignment) {
            case ALIGN_CENTER:
                positionX = this.x - this.width / 2;
                break;
            case ALIGN_LEFT:
                positionX = this.x;
                break;
            case ALIGN_RIGHT:
                positionX = this.x - this.width;
                break;
        }

        ctx.fillText(this.text, positionX, this.y);
    }
}