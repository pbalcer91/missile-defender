class SpeedSlider extends GameObject {
     constructor() {
        super();

        this.radius = 10;
        this.positionX = 40;
        this.positionY = canvas.height - canvas.height / 3;

        this.width = 10;
        this.height = canvas.height / 2;

        this.indicatorWidth = 40;
        this.indicatorHeight = 20;

        this.isClicked = false;

        this.centerX = this.positionX;
        this.centerY = canvas.height - canvas.height / 3;

        this.lowestPosition = this.positionY + this.height / 2;
        this.highestPosition = this.positionY - this.height / 2;

        this.value = Math.abs((this.centerY - this.highestPosition) / this.height - 1);
    }

    changeValue(newPositionY) {
        if (newPositionY >= this.lowestPosition) {
            this.centerY = this.lowestPosition;
            this.value = 0;
            return;
        }
        
        if (newPositionY <= this.highestPosition) {
            this.centerY = this.highestPosition;
            this.value = 1;
            return;
        }

        this.centerY = newPositionY;
        this.value = Math.abs((this.centerY - this.highestPosition) / this.height - 1)
    }

    render() {
        if (!isPlaying)
            return;

        ctx.strokeStyle = "#96150cc4";
        ctx.fillStyle = "#00000040";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(this.positionX - this.width / 2, this.positionY - this.height / 2,
                    this.width, this.height, this.height / 2);
        ctx.stroke();
        ctx.fill();

        ctx.strokeStyle = "#00000090";
        ctx.fillStyle = (this.isClicked ? "#b6352c" : "#96150c");
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(this.centerX - this.indicatorWidth / 2, this.centerY,
                    this.indicatorWidth, this.indicatorHeight, this.indicatorHeight / 2);
        ctx.stroke();
        ctx.fill();
    }

    pointIsInsideBoundingCircle(pointX, pointY) {
        if (pointX < this.centerX - this.indicatorWidth / 2)
            return false;

        if (pointX > this.centerX + this.indicatorWidth / 2)
            return false;

        if (pointY < this.centerY)
            return false;

        if (pointY > this.centerY + this.indicatorHeight)
            return false;
        
        return true;
    }
}