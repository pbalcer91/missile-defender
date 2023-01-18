class Building extends GameObject {
    constructor(miliseconds) {
        super(miliseconds);

        this.size = this.randomizeSize();

        this.height = this.size[0];
        this.width = this.size[1];
        this.positionX = canvas.width + this.width;
        this.positionY = canvas.height - this.height / 2 - GROUND_HEIGHT / 2;
    }

    updateState() {
        this.positionX -= 0.5;

        if (this.positionX < 0 - this.width)
            buildings = arrayRemove(buildings, this);
    }

    randomizeSize() {
        let sizeArray = [[canvas.height / 2, canvas.height / 2 * 0.62],
                        [canvas.height / 3, canvas.height / 2 * 0.62],
                        [canvas.height / 4, canvas.height / 2 * 0.62],
                        [0, 0]]

        return sizeArray[Math.floor(Math.random() * sizeArray.length)];
    }

    render() {
        ctx.drawImage(buildingImage, this.positionX - this.width / 2, this.positionY - this.height / 2,
                this.width, this.height);
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
}