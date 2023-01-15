const DIRECTION_OK = 0;
const DIRECTION_TOO_HIGH = 1;
const DIRECTION_TOO_LOW = 2;

const START_ON_LEFT = 0;
const START_ON_RIGHT = 1;
 
class Enemy extends Plane {
    constructor() {
        super();

        this.randomizePosition();
        
        this.manoeuvrability = 0.3;

        this.hitPoints = 1;

        this.xShift = 0;
        this.yShift = 0;

        this.speed = 3
        this.range = 300;

        this.direction = -1;
    }
    
    randomizePosition() {
        let SIDES = [START_ON_LEFT, START_ON_RIGHT];

        switch (SIDES[Math.floor(Math.random() * SIDES.length)]) {
            case START_ON_LEFT:
                this.rotation = 0;
                this.positionX = 0 - this.width / 2;
                this.positionY = Math.random() * (canvas.height / 2 - 100) + 100;
                return;
            case START_ON_RIGHT:
                this.rotation = 180;
                this.positionX = canvas.width + this.width / 2;
                this.positionY = Math.random() * (canvas.height / 2 - 100) + 100;
                return;
        }

    }

    move() {
        this.xShift = Math.cos(Math.radians(this.rotation));
        this.yShift = -Math.sin(Math.radians(this.rotation));

        this.positionX += this.xShift / (6 - this.speed);
        this.positionY += this.yShift / (6 - this.speed);
    }

    rotate() {
        let result = this.rotation;

        enemies.forEach(enemy => {
            if (this != enemy && this.isOnCollisionWay(enemy)) {
                this.rotation -= this.manoeuvrability;
                return;
            }
        });

        this.direction = (this.isAboveShootingLine(player, 2)?
                            DIRECTION_TOO_LOW
                            : this.isBelowShootingLine(player, 2) ?
                                DIRECTION_TOO_HIGH
                                : DIRECTION_OK);

        if (this.yShift > 0.8 && player.positionX > this.positionX
            || this.yShift < -0.8 && player.positionX < this.positionX) {
                
            this.rotation += this.manoeuvrability;
            return;
        }

        if (this.yShift > 0.8 && player.positionX < this.positionX
            || this.yShift < -0.8 && player.positionX > this.positionX) {
            this.rotation -= this.manoeuvrability;
            return;
        }

        // direction = right, player is on right
        if (this.xShift > 0 && player.positionX > this.positionX) {
            switch (this.direction) {
                case DIRECTION_OK:
                    return;
                case DIRECTION_TOO_HIGH:
                    result -= this.manoeuvrability;
                    break;
                case DIRECTION_TOO_LOW:
                    result += this.manoeuvrability;
                    break;
            }
        }

        // direction = left, player is on left
        if (this.xShift < 0 && player.positionX < this.positionX) {
            switch (this.direction) {
                case DIRECTION_OK:
                    return;
                case DIRECTION_TOO_HIGH:
                    result += this.manoeuvrability;
                    break;
                case DIRECTION_TOO_LOW:
                    result -= this.manoeuvrability;
                    break;
            }
        }

        // direction = left, player is on right
        if (this.xShift < 0 && player.positionX > this.positionX) {
            result = (this.yShift > 0 ?
                            this.rotation + this.manoeuvrability
                            : this.rotation - this.manoeuvrability)
        }

        // direction = right, player is on left
        if (this.xShift > 0 && player.positionX < this.positionX) {
            result = (this.yShift > 0 ?
                            this.rotation - this.manoeuvrability
                            : this.rotation + this.manoeuvrability)
        }

        if (result > FULL_ANGLE)
            result -= FULL_ANGLE;

        if (result < 0)
            result += FULL_ANGLE;

        this.rotation = result;
    }

    isInRange(object, range) {
        let distance = Math.sqrt(Math.pow(object.positionX - this.positionX, 2)
                                + Math.pow(object.positionY - this.positionY, 2));

        if (distance <= range)
            return true;

        return false;
    }

    isOnShootingLine(object, margin) {
        return (!this.isBelowShootingLine(object, margin)
                && !this.isAboveShootingLine(object, margin))
    }

    isBelowShootingLine(object, margin) {
        let a = Math.tan(Math.radians(this.rotation));
        let b = -this.positionY - a * this.positionX;

        return (-object.positionY < a * object.positionX + b - margin);
    }

    isAboveShootingLine(object, margin) {
        let a = Math.tan(Math.radians(this.rotation));
        let b = -this.positionY - a * this.positionX;

        return (-object.positionY > a * object.positionX + b + margin);
    }

    otherEnemyOnShootingLine() {
        enemies.forEach(enemy => {
            if (this != enemy
                && this.isInRange(enemy, this.range)
                && this.isOnShootingLine(enemy, 8))
                    return true;
        })

        return false;
    }

    isOnCollisionWay(object) {
        if (this.isOnShootingLine(object, 5)
            && this.isInRange(object, this.range / 2)) {
                console.log("COLISSION")
            return true;
            }

        return false;
    }

    updateState() {
        if (this.direction == DIRECTION_OK
            && !this.otherEnemyOnShootingLine()
            && this.isInRange(player, this.range)) {
            this.fireMissile();
        }

        this.rotate();
        this.move();
    }

    render() {
        ctx.save();
        ctx.translate(this.positionX, this.positionY);
        ctx.rotate(Math.radians(-this.rotation));
        ctx.translate(-this.positionX, -this.positionY);

        ctx.fillStyle = "red";
        ctx.fillRect(this.positionX - this.width / 2, this.positionY - this.height / 2,
                        this.width, this.height);

        ctx.restore();

        this.missiles.forEach(missile => {
            if (missile.isDestroyed == true)
                this.missiles = arrayRemove(this.missiles, missile);

            missile.render();
        })
    }
}