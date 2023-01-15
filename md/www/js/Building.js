const BIG_BUILDING = [200, 60];
const MEDIUM_BUILDING = [150, 60];
const SMALL_BUILDING = [30, 40];
const NO_BUILDING = [0, 0];

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
        this.positionX--;

        if (this.positionX < 0 - this.width)
            buildings = arrayRemove(buildings, this);
    }

    randomizeSize() {
        let sizeArray = [BIG_BUILDING, MEDIUM_BUILDING, SMALL_BUILDING, NO_BUILDING]

        return sizeArray[Math.floor(Math.random() * sizeArray.length)];
    }

    render() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.positionX - this.width / 2, this.positionY - this.height / 2,
                        this.width, this.height);
    }

    pointIsInsideBoundingRectangle(pointX, pointY) {
        if (pointX < this.positionX)
            return false;

        if (pointX > this.positionX + this.width)
            return false;

        if (pointY < this.positionY)
            return false;

        if (pointY > this.positionY + this.height)
            return false;
        
        return true;
    }
}