class InfoPanel extends GameObject {
    constructor(hitPoints) {
        super();

        this.height = canvas.height / 4;
        this.width = canvas.width / 4;
        this.positionX = -3;
        this.positionY = -3;

        this.controlResetButtonMargins = 40;
        this.controlResetButtonRadius = 8;

        this.controlResetButtonIsClicked = false;

        this.score = 0;
        this.hitPoints = hitPoints;

        this.scoresLabel = new StaticText("Points: " + this.score, 20, 35, 24, "#000000b4");
        this.scoresLabel.start();

        this.hitPointsLabel = new StaticText("HP: " + this.hitPoints, 20, 70, 24, "#000000b4");
        this.hitPointsLabel.start();
    }

    addScore(points) {
        this.score += points;
        this.scoresLabel.changeText("Points: " + this.score);
    }

    resetScore() {
        this.score = 0;
        this.scoresLabel.changeText("Points: " + this.score);
    }

    takeDamage() {
        window.navigator.vibrate(500);
        
        this.hitPoints--;
        this.hitPointsLabel.changeText("HP: " + this.hitPoints);
    }

    render() {
        if (!isPlaying)
            return;

        ctx.strokeStyle = "#96150cc4";
        ctx.fillStyle = "#00000010";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(this.positionX, this.positionY,
                    this.width, this.height, [0, 0, this.height / 2, 0]);
        ctx.stroke();
        ctx.fill();

        this.scoresLabel.render();
        this.hitPointsLabel.render();

        ctx.strokeStyle = "#96150cc4";
        ctx.fillStyle = (this.controlResetButtonIsClicked ? "#96150c50" : "#00000020");
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.controlResetButtonMargins,
                this.positionY + this.height + this.controlResetButtonMargins,
                this.controlResetButtonRadius * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = (this.controlResetButtonIsClicked ? "#96150c50" : "#96150cc4");
        ctx.beginPath();
        ctx.arc(this.controlResetButtonMargins,
                this.positionY + this.height + this.controlResetButtonMargins,
                this.controlResetButtonRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    pointIsInsideBoundingCircle(pointX, pointY) {
        if (pointX < this.controlResetButtonMargins - this.controlResetButtonRadius)
            return false;

        if (pointX > this.controlResetButtonMargins + this.controlResetButtonRadius)
            return false;

        if (pointY < this.controlResetButtonMargins + this.height - this.controlResetButtonRadius)
            return false;

        if (pointY > this.controlResetButtonMargins + this.height + this.controlResetButtonRadius)
            return false;
        
        return true;
    }
}