class Missile extends GameObject {
    constructor(positionX, positionY, rotation) {
        super();
        
        this.height = 1;
        this.width = 8;
        this.positionX = positionX;
        this.positionY = positionY;
        this.rotation = rotation;

        this.speed = 4;

        this.range = 200;
        this.rangeCounter = 0;

        this.isDestroyed = false;
    }

    updateState() {
         this.rangeCounter++;

        if (this.rangeCounter > this.range) {
            this.stop();
            this.isDestroyed = true;
        }

         let xShift = Math.cos(Math.radians(this.rotation)) * this.speed;
         let yShift = -Math.sin(Math.radians(this.rotation)) * this.speed;


        this.positionX += xShift;
        this.positionY += yShift;
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
        if (!isPlaying)
            return;

        ctx.save();
        ctx.translate(this.positionX, this.positionY);
        ctx.rotate(Math.radians(-this.rotation));
        ctx.translate(-this.positionX, -this.positionY);

        ctx.drawImage(bulletImage, this.positionX - this.width / 2, this.positionY - this.height / 2,
                this.width, this.height);

        ctx.restore();
    }
}