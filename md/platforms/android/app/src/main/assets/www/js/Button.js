class Button extends GameObject {
    constructor(positionY, text, color = "#a81919",
                highlightedColor = "#7d1313", borderColor = "#f5d105",
                textColor = "#ffffff") {

        super();

        this.height = 40;
        this.width = 160;
        this.positionX = canvas.width / 2;
        this.positionY = positionY;

        this.color = color;
        this.highlightedColor = highlightedColor;
        this.borderColor = borderColor;
        this.textColor = textColor;

        this.label = new StaticText(text, this.positionX, this.positionY,
                                    20, this.textColor, ALIGN_CENTER);
        this.label.start();

        this.isClicked = false;
    }

        pointIsInsideBoundingRectangle(pointX, pointY) {
        if (pointX < this.positionX - this.width / 2)
            return false;

        if (pointX > this.positionX + this.width / 2)
            return false;

        if (pointY < this.positionY - this.height / 2)
            return false;

        if (pointY > this.positionY + this.height / 2)
            return false;
        
        return true;
    }

    render() {
        if (isPlaying)
            return;
        
        ctx.strokeStyle = this.borderColor;
        ctx.fillStyle = (this.isClicked ? this.highlightedColor : this.color);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(this.positionX - this.width / 2, this.positionY - this.height / 2,
                    this.width, this.height, this.height / 2);
        ctx.stroke();
        ctx.fill();

        ctx.font='bold 20px Arial'
        this.label.render();
    }
}