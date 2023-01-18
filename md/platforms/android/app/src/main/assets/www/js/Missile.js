class Missile extends GameObject {
    constructor(positionX, positionY, rotation) {
        super();
        
        this.height = 2;
        this.width = 10;
        this.positionX = positionX;
        this.positionY = positionY;
        this.rotation = rotation;

        this.speed = 2;

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

    render() {
        if (!isPlaying)
            return;

        ctx.save();
        ctx.translate(this.positionX, this.positionY);
        ctx.rotate(Math.radians(-this.rotation));
        ctx.translate(-this.positionX, -this.positionY);

        //ctx.drawImage(missile, this.positionX, this.positionY, this.width, this.height);

        ctx.fillStyle = "red";
        ctx.fillRect(this.positionX - this.width / 2, this.positionY - this.height / 2,
                        this.width, this.height);

        ctx.restore();
    }
}