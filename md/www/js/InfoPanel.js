class InfoPanel extends GameObject {
    constructor(hitPoints) {
        super();

        this.height = canvas.height / 4;
        this.width = this.height * 2;
        this.positionX = -3;
        this.positionY = -3;

        this.controlResetButtonMargins = 40;
        this.controlResetButtonRadius = 8;

        this.controlResetButtonIsClicked = false;

        this.score = 0;
        this.hitPoints = hitPoints;

        this.spriteIndex = 1;
        this.spriteIndexChangedDisabled = false;

        this.scoresLabel = new StaticText(this.score, this.height / 2, this.positionY + this.height * 0.7, this.height / 3, "#000000");
        this.scoresLabel.start();
    }

    addScore(points) {
        this.score += points;
        this.scoresLabel.changeText(this.score);
    }

    resetScore() {
        this.score = 0;
        this.scoresLabel.changeText(this.score);
    }

    takeDamage() {
        window.navigator.vibrate(500);
        
        this.hitPoints--;
    }

    recoverHealth() {        
        this.hitPoints++;
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

        if (!this.spriteIndexChangedDisabled) {
            this.spriteIndexChangedDisabled = true;

            this.spriteIndex = (this.spriteIndex == 4 ? 1 : this.spriteIndex + 1);

            setTimeout(() => {                
                this.spriteIndexChangedDisabled = false;
            }, 150);
        }

        for(var i = 0; i < this.hitPoints; i++) {
            ctx.drawImage(hitPointsSprite[this.spriteIndex - 1],
                            this.positionX + this.height / 17 + (this.height / 3 + this.height / 17) * i,
                            this.positionY + this.height / 17,
                            this.height / 3, this.height / 3);
        }

        ctx.drawImage(scoreSprite[this.spriteIndex - 1],
                            this.positionX + this.height / 17,
                            this.positionY + this.height / 2,
                            this.height / 3, this.height / 3);

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