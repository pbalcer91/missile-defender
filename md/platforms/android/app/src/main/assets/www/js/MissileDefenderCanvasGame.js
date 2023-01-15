class MissileDefenderCanvasGame extends CanvasGame {
    constructor() {
        super();

        this.enemiesToSpawn = 3;
    }

    createEnemy(timeout) {          
        setTimeout(() => {
            if (!isPlaying || this.enemiesToSpawn <= 0)
                return;

            enemies.push(new Enemy());
            enemies.at(-1).start();
            this.enemiesToSpawn--;

            this.createEnemy(timeout);
        }, timeout);
    }

    createBuilding(timeout) {
        setTimeout(() => {
            if (!isPlaying)
                return;

            buildings.push(new Building(backgroundRefreshRate));
            buildings.at(-1).start();

            let intervalArray = [5000, 7000, 3000, 10000, 12000]

            let interval = intervalArray[Math.floor(Math.random() * intervalArray.length)];

            this.createBuilding(interval);
        }, timeout)
    }

    render() {
        super.render();

        buildings.forEach(building => {
            building.render();
        })
        enemies.forEach(enemy => {
            enemy.render();
        })
    }

    collisionDetection() {
        buildings.forEach(building => {
            if (player.collisionWithObject(building)) {
                gameOver();
                return;
            }
        })

        enemies.forEach(enemy => {
            enemies.forEach(otherEnemy => {
                if (enemy.collisionWithObject(otherEnemy)
                    && enemy != otherEnemy) {
                    enemies = arrayRemove(enemies, enemy);
                    enemies = arrayRemove(enemies, otherEnemy);

                    score += 2;
                    gameObjects[POINTS].changeText("Points: " + score);
                }
            })

            if (player.collisionWithObject(enemy)) {
                enemies = arrayRemove(enemies, enemy);

                score++;
                gameObjects[POINTS].changeText("Points: " + score);

                player.hitPoints--;
                if (player.hitPoints <= 0) {
                    gameOver();
                    return;
                }

                gameObjects[HIT_POINTS].changeText("HP: " + player.hitPoints);
            }
            buildings.forEach(building => {
                if (enemy.collisionWithObject(building))
                        enemies = arrayRemove(enemies, enemy);
            })

            player.missiles.forEach(missile => {
                if (enemy.collisionWithObject(missile)) {
                    enemies = arrayRemove(enemies, enemy);
                    player.missiles = arrayRemove(player.missiles, missile);
                    score++;
                    gameObjects[POINTS].changeText("Points: " + score);
                }
            })

            enemy.missiles.forEach(missile => {
                if (player.collisionWithObject(missile)) {
                    enemy.missiles = arrayRemove(enemy.missiles, missile);

                    player.hitPoints--;
                    if (player.hitPoints <= 0)
                        gameOver();

                    gameObjects[HIT_POINTS].changeText("HP: " + player.hitPoints);
                }
            })
        })
    }
}