class ScrollingBackgroundImage extends GameObject {
    constructor(image, x, y, width, height, miliseconds) {
        super(miliseconds);
        this.image = image;

        this.positionX = x;
        this.positionY = y;
        this.width = width
        this.height = height;
        this.speed = 0.5;
    }

    updateState() {   
        this.positionX -= this.speed;
        if (this.positionX <= -this.width)
            this.positionX = 0;
    }

    render() {
        ctx.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
        ctx.drawImage(this.image, this.positionX + this.width, this.positionY, this.width, this.height);
    }
}