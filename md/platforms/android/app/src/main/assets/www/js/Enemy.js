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

        this.reloadTime = 3;
        this.seriesCount = 2;

        this.destroyed = false;

        this.targetLockRadius = 4;

        this.direction = -1;

        this.defaultLeft = enemyDefaultLeft;
        this.defaltRight = enemyDefaultRight;
        this.upLeft = enemyUpLeft;
        this.upRight = enemyUpRight
        this.downLeft = enemyDownLeft
        this.downRight = enemyDownRight

        this.image = (this.positionX < 0 ?
                        this.defaltRight
                        : this.defaultLeft);
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

    changeDirectionByPlayer() {
        if ((this.yShift == 1 || this.yShift == -1)
            && this.isOnShootingLine(player)) {
                this.rotate(NO_ROTATION);
                return false;
        }

        if (this.yShift == 1 && player.positionX > this.positionX
            || this.yShift == -1 && player.positionX < this.positionX) {    
            this.rotate(COUNTER_CLOCKWISE);
            return true;
        }

        if (this.yShift == 1 && player.positionX < this.positionX
            || this.yShift == -1 && player.positionX > this.positionX) {
            this.rotate(CLOCKWISE);
            return true;
        }

        this.direction = (this.isAboveShootingLine(player)?
                            DIRECTION_TOO_LOW
                            : this.isBelowShootingLine(player) ?
                                DIRECTION_TOO_HIGH
                                : DIRECTION_OK);

        // direction = right, player is on right
        if (this.xShift > 0 && player.positionX > this.positionX) {
            switch (this.direction) {
                case DIRECTION_OK:
                    this.rotate(NO_ROTATION);
                    return false;
                case DIRECTION_TOO_HIGH:
                    this.rotate(CLOCKWISE);
                    return true;
                case DIRECTION_TOO_LOW:
                    this.rotate(COUNTER_CLOCKWISE);
                    return true;
            }
        }

        // direction = left, player is on left
        if (this.xShift < 0 && player.positionX < this.positionX) {
            switch (this.direction) {
                case DIRECTION_OK:
                    this.rotate(NO_ROTATION);
                    return false;
                case DIRECTION_TOO_HIGH:
                    this.rotate(COUNTER_CLOCKWISE);
                    return true;
                case DIRECTION_TOO_LOW:
                    this.rotate(CLOCKWISE);
                    return true;
            }
        }

        // direction = left, player is on right
        if (this.xShift < 0 && player.positionX >= this.positionX) {

            if (this.positionY > canvas.height / 2) {
                this.rotate(CLOCKWISE);
                return true;
            }

            this.rotate(COUNTER_CLOCKWISE);
            return true;
        }

        // direction = right, player is on left
        if (this.xShift > 0 && player.positionX <= this.positionX) {
            
            if (this.positionY > canvas.height / 2) {
                this.rotate(COUNTER_CLOCKWISE);
                return true;
            }

            this.rotate(CLOCKWISE);
            return true;
        }

        switch(this.direction) {
            case DIRECTION_OK:
                this.rotate(NO_ROTATION)
                return false;
            case DIRECTION_TOO_LOW:
                this.rotate(this.rotation <= 90 || this.rotation >= 270 ?
                                COUNTER_CLOCKWISE
                                : CLOCKWISE)
                return true;
            case DIRECTION_TOO_HIGH:
                this.rotate(this.rotation <= 90 || this.rotation >= 270 ?
                                CLOCKWISE
                                : COUNTER_CLOCKWISE)
                return true;
        }
    }

    changeDirectionByOtherEnemies() {
        enemies.forEach(enemy => {
            if (this != enemy && this.isOnCollisionWay(enemy)) {
                this.rotation -= this.manoeuvrability;
                return;
            }
        });
    }

    changeDirectionByBuildings() {

    }

    isInRange(object, range) {
        let distance = Math.sqrt(Math.pow(object.positionX - this.positionX, 2)
                                + Math.pow(object.positionY - this.positionY, 2));

        if (distance <= range)
            return true;

        return false;
    }

    isOnShootingLine(object) {
        return (!this.isBelowShootingLine(object)
                && !this.isAboveShootingLine(object))
    }

    isBelowShootingLine(object) {
        let a = Math.tan(Math.radians(this.rotation));
        let b = -this.positionY - a * this.positionX;

        return (-object.positionY < a * object.positionX + b - this.targetLockRadius);
    }

    isAboveShootingLine(object) {
        let a = Math.tan(Math.radians(this.rotation));
        let b = -this.positionY - a * this.positionX;

        return (-object.positionY > a * object.positionX + b + this.targetLockRadius);
    }

    otherEnemyOnShootingLine() {
        enemies.forEach(enemy => {
            if (this != enemy
                && this.isInRange(enemy, this.range)
                && this.isOnShootingLine(enemy))
                    return true;
        })

        return false;
    }

    isOnCollisionWay(object) {
        if (this.isOnShootingLine(object)
            && this.isInRange(object, this.range / 2))
            return true;

        return false;
    }

    updateState() {
        if (!isPlaying)
            return;

        if (this.direction == DIRECTION_OK
            && !this.otherEnemyOnShootingLine()
            && this.isInRange(player, this.range)) {
            this.fireMissile();
        }

        this.changeDirectionByPlayer();
        this.move();
    }
}