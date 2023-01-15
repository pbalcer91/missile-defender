class ScrollingBackgroundImage extends GameObject {
    constructor(image, x, y, height, miliseconds) {
        super(miliseconds);
        this.image = image;

        this.positionX = x;
        this.positionY = y;
        this.height = height;
        this.speed = 1;
    }

    updateState() {   
        this.positionX -= this.speed;
        if (this.positionX <= -canvas.width)
            this.positionX = 0;
    }

    render() {
        ctx.drawImage(this.image, this.positionX, this.positionY, canvas.width, this.height);
        ctx.drawImage(this.image, this.positionX + canvas.width, this.positionY, canvas.width, this.height);
    }
}