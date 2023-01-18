class FireButton extends GameObject {
     constructor() {
        super();

        this.radius = canvas.height / 10;
        this.positionX = canvas.width - this.radius * 2;
        this.positionY = canvas.height - this.radius * 2

        let missileImage = new Image();
        missileImage.src = "img/missile_button.png";

        let missileImageSize = this.radius * 1.2;

        this.missileIcon = new StaticImage(missileImage,
                                    this.positionX - missileImageSize / 2,
                                    this.positionY - missileImageSize / 2,
                                    missileImageSize,
                                    missileImageSize);


        this.isClicked = false;
    }

    render() {
        if (!isPlaying)
            return;

        this.missileIcon.render();

        ctx.strokeStyle = "#96150cc4";
        ctx.fillStyle = (this.isClicked ? "#96150c50" : "#00000020");
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
    }

    pointIsInsideBoundingCircle(pointX, pointY) {
        if (pointX < this.positionX - this.radius)
            return false;

        if (pointX > this.positionX + this.radius)
            return false;

        if (pointY < this.positionY - this.radius)
            return false;

        if (pointY > this.positionY + this.radius)
            return false;
        
        return true;
    }
}