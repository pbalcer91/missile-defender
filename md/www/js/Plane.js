const LEFT = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;

const NO_ROTATION = 0
const CLOCKWISE = 1;
const COUNTER_CLOCKWISE = 2;

const FULL_ANGLE = 359;

class Plane extends GameObject {
    constructor(positionX, positionY) {
        super();

        this.hitPoints = 5;

        this.isReloading = false;
        this.reloadTime = 1;
        this.seriesCount = 3;

        this.width = 50;
        this.height = this.width * 0.55;

        this.positionX = positionX;
        this.positionY = positionY;

        this.xShift = 0;
        this.yShift = 0;

        this.rotation = 0;
        this.manoeuvrability = 0.5
        this.speed = 4;

        this.minSpeed = 2;
        this.maxSpeed = 5;

        this.direction = LEFT;

        this.missiles = [];

        this.defaultLeft = playerDefaultLeft;
        this.defaltRight = playerDefaultRight;
        this.upLeft = playerUpLeft;
        this.upRight = playerUpRight
        this.downLeft = playerDownLeft
        this.downRight = playerDownRight

        this.image = this.defaltRight;
        this.imageChangeInProgress = false;
    }

    move() {
        this.xShift = Math.cos(Math.radians(this.rotation));
        this.yShift = -Math.sin(Math.radians(this.rotation));

        this.positionX += this.xShift / (6 - this.speed)
        this.positionY += this.yShift / (6 - this.speed);
    }

    setSpriteImage(direction) {
        this.imageChangeInProgress = true;

        let image;

        if (this.rotation <= 90 || this.rotation >= 270) {
            switch(direction) {
                case NO_ROTATION:
                    image = this.defaltRight;
                    break;
                case CLOCKWISE:
                    image = (this.image == this.upRight ?
                                this.defaltRight
                                : this.downRight);
                    break;
                case COUNTER_CLOCKWISE:
                    image = (this.image == this.downRight ?
                        this.defaltRight
                        : this.upRight);
                break;
            }
        }

        if (this.rotation > 90 && this.rotation < 270) {
            switch(direction) {
                case NO_ROTATION:
                    image = this.defaultLeft;
                    break;
                case CLOCKWISE:
                    image = (this.image == this.downLeft ?
                                this.defaultLeft
                                : this.upLeft);
                    break;
                case COUNTER_CLOCKWISE:
                    image = (this.image == this.upLeft ?
                        this.defaultLeft
                        : this.downLeft);
                break;
            }
        }

        setTimeout(() => {
            this.image = image;
            this.imageChangeInProgress = false;
        }, 150);
    }

    rotate(direction) {
        let result = (direction == CLOCKWISE ?
                                this.rotation - this.manoeuvrability
                                : direction == COUNTER_CLOCKWISE ?
                                    this.rotation + this.manoeuvrability
                                    : this.rotation);
        
        if (result > FULL_ANGLE)
            result -= FULL_ANGLE;

        if (result < 0)
            result += FULL_ANGLE;

        if (direction == NO_ROTATION
            && (this.image == playerDefaultLeft
                || this.image == playerDefaultRight))
            return;

        this.rotation = result;

        if (this.imageChangeInProgress)
            return;

        this.setSpriteImage(direction);
    }

    changeDirection(direction) {
        this.direction = direction;

        switch (direction) {
            case LEFT:
                if (this.rotation == 180 || this.rotation == 0) {
                    this.rotate(NO_ROTATION);
                    return;
                }

                if (this.rotation > 0
                    && this.rotation < 180)
                    this.rotate(COUNTER_CLOCKWISE);

                if (this.rotation <= 359
                    && this.rotation > 180)
                    this.rotate(CLOCKWISE);

                return;
            case UP:
                 if (this.rotation == 90 || this.rotation == 270) {
                    this.rotate(NO_ROTATION);
                    return;
                 }

                if (this.rotation < 90
                    || this.rotation > 270)
                    this.rotate(COUNTER_CLOCKWISE);

                if (this.rotation > 90
                    && this.rotation < 270)
                    this.rotate(CLOCKWISE);

                return;
            case RIGHT:
                if (this.rotation == 0 || this.rotation == 180) {
                    this.rotate(NO_ROTATION);
                    return;
                }

                if (this.rotation < 180)
                    this.rotate(CLOCKWISE);

                if (this.rotation > 180)
                    this.rotate(COUNTER_CLOCKWISE);

                return;
            case DOWN:
                if (this.rotation == 270 || this.rotation == 90) {
                    this.rotate(NO_ROTATION);
                    return;
                }

                if (this.rotation > 270
                    || this.rotation < 90)
                    this.rotate(CLOCKWISE);

                if (this.rotation < 270
                    && this.rotation > 90)
                    this.rotate(COUNTER_CLOCKWISE);

                return;
        }
    }

    updateState() {
        if (!isPlaying)
            return;
            
        this.changeDirection(this.direction);
        this.move();

        if (this.positionX + this.width / 2 > canvas.width)
            gameOver();

        if (this.positionX - this.width / 2 < 0)
            gameOver();

        if (this.positionY < 0)
            gameOver();

        if (this.positionY + this.height / 2 > canvas.height - GROUND_HEIGHT)
            gameOver();
    }

    fireMissile() {
        if (this.isReloading)
            return;

            shootingSound.play();

        let seriesCount = this.seriesCount;

        let fireSeries = setInterval(() => {
            this.missiles.push(new Missile(this.positionX,
                                        this.positionY,
                                        this.rotation));
            this.missiles.at(-1).start();
            seriesCount--;

            if (seriesCount == 0)
                clearInterval(fireSeries);
        }, 150);

        this.isReloading = true;

        setTimeout(() => {
            this.isReloading = false;
        }, this.reloadTime * 1000);
    }

    changeSpeed(multiplier) {
        let speedRange = this.maxSpeed - this.minSpeed;

        this.speed = this.minSpeed + speedRange * multiplier;
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

    collisionWithObject(object) {
        if (this.pointIsInsideBoundingRectangle(object.positionX - object.width / 2,
                                                object.positionY - object.height / 2))
            return true;

        if (this.pointIsInsideBoundingRectangle(object.positionX - object.width / 2,
                                                object.positionY + object.height / 2))
            return true;

        if (this.pointIsInsideBoundingRectangle(object.positionX + object.width / 2,
                                                object.positionY - object.height / 2))
            return true;

        if (this.pointIsInsideBoundingRectangle(object.positionX + object.width / 2,
                                                object.positionY + object.height / 2))
            return true;

        if (object.pointIsInsideBoundingRectangle(this.positionX - this.width / 2,
                                                this.positionY - this.height / 2))
            return true;

        if (object.pointIsInsideBoundingRectangle(this.positionX - this.width / 2,
                                                this.positionY + this.height / 2))
            return true;

        if (object.pointIsInsideBoundingRectangle(this.positionX + this.width / 2,
                                                this.positionY - this.height / 2))
            return true;

        if (object.pointIsInsideBoundingRectangle(this.positionX + this.width / 2,
                                                this.positionY + this.height / 2))
            return true;

        return false;
    }

    render() {
        if (!isPlaying)
            return;

        this.missiles.forEach(missile => {
            if (missile.isDestroyed == true)
                this.missiles = arrayRemove(this.missiles, missile);

            missile.render();
        })

        ctx.save();
        ctx.translate(this.positionX, this.positionY);
        ctx.rotate(Math.radians(-this.rotation));
        ctx.translate(-this.positionX, -this.positionY);

        ctx.drawImage(this.image, this.positionX - this.width / 2, this.positionY - this.height / 2,
                        this.width, this.height);

        ctx.restore();
    }
}