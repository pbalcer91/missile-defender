class Bonus extends GameObject {
    constructor(positionX, positionY) {
        super();
        this.positionX = positionX;
        this.positionY = positionY;

        this.height = 40;
        this.width = this.height;

        this.duration = 5000;

        this.spriteIndex = 1;
        this.spriteIndexChangedDisabled = false;
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
        if (!this.spriteIndexChangedDisabled) {
            this.spriteIndexChangedDisabled = true;

            this.spriteIndex = (this.spriteIndex == 4 ? 1 : this.spriteIndex + 1);

            setTimeout(() => {                
                this.spriteIndexChangedDisabled = false;
            }, 150);
        }

        ctx.drawImage(hitPointsSprite[this.spriteIndex - 1],
                        this.positionX - this.height / 2,
                        this.positionY - this.height / 2,
                        this.height, this.height);
    }
}