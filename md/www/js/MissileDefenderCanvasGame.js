class MissileDefenderCanvasGame extends CanvasGame {
    constructor(enemies) {
        super();

        this.numberOfEnemies = enemies

        this.score = 0;
    }

    createEnemy(timeout) {          
        setTimeout(() => {
            if (!isPlaying)
                return;

            if (enemies.length >= this.numberOfEnemies) {
                this.createEnemy(timeout);
            }
            else {
                enemies.push(new Enemy());
                enemies.at(-1).start();

                this.createEnemy(timeout);
            }
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

        if (player != null)
            player.render();

        if (messageDialog != null)
            messageDialog.render();

        if (menu != null)
            menu.render();

        if (infoPanel != null)
            infoPanel.render();

        if (fireButton != null)
            fireButton.render();

        if (speedSlider != null)
            speedSlider.render();
    }

    collisionDetection() {
        if (!isPlaying)
            return;

        buildings.forEach(building => {
            if (player != null && player.collisionWithObject(building)) {
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

                    this.score += 2;
                    infoPanel.addScore(2);
                }
            })

            if (player != null && player.collisionWithObject(enemy)) {
                enemies = arrayRemove(enemies, enemy);

                this.score++;
                infoPanel.addScore(1)

                player.hitPoints--;
                if (player.hitPoints <= 0) {
                    gameOver();
                    return;
                }

                infoPanel.takeDamage();
            }

            buildings.forEach(building => {
                if (enemy.collisionWithObject(building))
                        enemies = arrayRemove(enemies, enemy);
            })

            if (player != null) {
                player.missiles.forEach(missile => {
                    if (enemy.collisionWithObject(missile)) {
                        enemies = arrayRemove(enemies, enemy);
                        player.missiles = arrayRemove(player.missiles, missile);
                        this.score++;
                        infoPanel.addScore(1);
                    }
                })
            }

            enemy.missiles.forEach(missile => {
                if (player != null && player.collisionWithObject(missile)) {
                    enemy.missiles = arrayRemove(enemy.missiles, missile);

                    player.hitPoints--;
                    if (player.hitPoints <= 0) {
                        gameOver();
                        return;
                    }

                    infoPanel.takeDamage();
                }
            })
        })
    }
}