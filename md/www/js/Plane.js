const LEFT = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;

const CLOCKWISE = 0;
const COUNTER_CLOCKWISE = 1;

const FULL_ANGLE = 359;

class Plane extends GameObject {
    constructor(positionX, positionY) {
        super();

        this.hitPoints = 5;

        this.isReloading = false;
        this.reloadTime = 2;

        this.height = 50;
        this.width = 50;
        this.positionX = positionX;
        this.positionY = positionY;

        this.shiftVector = [0, 0];
        this.rotation = 0;
        this.manoeuvrability = 0.5
        this.speed = 4;

        this.minSpeed = 2;
        this.maxSpeed = 5;

        this.direction = LEFT;

        this.missiles = [];

        this.playerDefaultRight = new Image();
        this.playerDefaultRight.src = "img/player_sprite/Fokker_default_right.png";
        this.playerUpRight = new Image();
        this.playerUpRight.src = "img/player_sprite/Fokker_up_right.png";
        this.playerDownRight = new Image();
        this.playerDownRight.src = "img/player_sprite/Fokker_down_right.png";

        this.image = this.playerDefaultRight;
        this.imageChangeinProgress = false;
    }

    move() {
        let xShift = Math.cos(Math.radians(this.rotation)) / (6 - this.speed);
        let yShift = -Math.sin(Math.radians(this.rotation)) / (6 - this.speed);

        this.positionX += xShift;
        this.positionY += yShift;

        if (this.positionX + this.width / 2 > canvas.width)
            gameOver();

        if (this.positionX - this.width / 2 < 0)
            gameOver();

        if (this.positionY < 0)
            gameOver();

        if (this.positionY + this.height / 2 > canvas.height - GROUND_HEIGHT)
            gameOver();
    }

    rotate(direction) {
        let result = (direction == CLOCKWISE ?
                                this.rotation - this.manoeuvrability
                                : this.rotation + this.manoeuvrability);
        
        if (result > FULL_ANGLE)
            result -= FULL_ANGLE;

        if (result < 0)
            result += FULL_ANGLE;

        this.rotation = result;

        if (this.imageChangeinProgress)
            return;

        this.imageChangeinProgress = true;

        if (this.rotation <= 90 || this.rotation >= 270) {

            if (direction == CLOCKWISE)
                setTimeout(() => {
                    this.image = (this.image == this.playerUpRight ?
                                        this.playerDefaultRight
                                        : this.playerDownRight);
                    this.imageChangeinProgress = false;
                }, 100);
                

            if (direction == COUNTER_CLOCKWISE)
                setTimeout(() => {
                    this.image = (this.image == this.playerDownRight ?
                                        this.playerDefaultRight
                                        : this.playerUpRight);
                    this.imageChangeinProgress = false;
                }, 100);
        }

        
    }

    changeDirection(direction) {
        this.direction = direction;

        switch (direction) {
            case LEFT:
                if (this.rotation == 180 || this.rotation == 0)
                    return;

                if (this.rotation > 0
                    && this.rotation < 180)
                    this.rotate(COUNTER_CLOCKWISE);

                if (this.rotation <= 359
                    && this.rotation > 180)
                    this.rotate(CLOCKWISE);

                return;
            case UP:
                 if (this.rotation == 90 || this.rotation == 270)
                    return;

                if (this.rotation < 90
                    || this.rotation > 270)
                    this.rotate(COUNTER_CLOCKWISE);

                if (this.rotation > 90
                    && this.rotation < 270)
                    this.rotate(CLOCKWISE);

                return;
            case RIGHT:
                if (this.rotation == 0 || this.rotation == 180)
                    return;

                if (this.rotation < 180)
                    this.rotate(CLOCKWISE);

                if (this.rotation > 180)
                    this.rotate(COUNTER_CLOCKWISE);

                return;
            case DOWN:
                if (this.rotation == 270 || this.rotation == 90)
                    return;

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
    }

    render() {
        if (!isPlaying)
            return;

        ctx.save();
        ctx.translate(this.positionX, this.positionY);
        ctx.rotate(Math.radians(-this.rotation));
        ctx.translate(-this.positionX, -this.positionY);


        ctx.drawImage(this.image, this.positionX - this.width / 2, this.positionY - this.height / 2,
                        this.width, this.height);

        ctx.restore();

        this.missiles.forEach(missile => {
            if (missile.isDestroyed == true)
                this.missiles = arrayRemove(this.missiles, missile);

            missile.render();
        })
    }

    fireMissile() {
        if (this.isReloading)
            return;

        this.missiles.push(new Missile(this.positionX,
                                        this.positionY,
                                        this.rotation));
        this.missiles.at(-1).start();

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
        if (this.positionX - this.width / 2 < object.positionX + object.width / 2
            && this.positionX + this.width / 2 > object.positionX - object.width / 2
            && this.positionY - this.height / 2 < object.positionY + object.height / 2
            && this.positionY + this.height / 2 > object.positionY - object.height / 2)
            return true;

        return false;
    }
}