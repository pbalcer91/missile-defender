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

            if (buildings.length == 0) {
                buildings.push(new Building(backgroundRefreshRate));
                buildings.at(-1).start();
            }

            if (buildings.length > 0
                && buildings.at(-1).positionX < canvas.width - buildings.at(-1).width * 1.5
                && Math.random() < 0.4) {
                buildings.push(new Building(backgroundRefreshRate));
                buildings.at(-1).start();
            }

            this.createBuilding(timeout);
        }, timeout)
    }

    render() {
        super.render();

        buildings.forEach(building => {
            building.render();
        });

        enemies.forEach(enemy => {
            enemy.render();
        });

        bonuses.forEach(bonus => {
            bonus.render();
        });

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

        bonuses.forEach(bonus => {
            if (player != null && player.collisionWithObject(bonus)) {
                bonuses = arrayRemove(bonuses, bonus);
                if (player.hitPoints < 5) {
                    healingSound.play();
                    player.hitPoints++;
                    infoPanel.recoverHealth();
                }
                else {
                    this.score++;
                    infoPanel.addScore(1);
                }
            }
        })

        enemies.forEach(enemy => {
            enemies.forEach(otherEnemy => {
                if (enemy.collisionWithObject(otherEnemy)
                    && enemy != otherEnemy) {
                    explosionSound.play();
                    enemy.stop();
                    otherEnemy.stop();
                    enemies = arrayRemove(enemies, enemy);
                    enemies = arrayRemove(enemies, otherEnemy);

                    this.score += 2;
                    infoPanel.addScore(2);
                }
            })

            if (player != null && player.collisionWithObject(enemy)) {
                explosionSound.play();
                enemy.stop();
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
                if (enemy.collisionWithObject(building)) {
                    explosionSound.play();
                    enemy.stop();
                    enemies = arrayRemove(enemies, enemy);
                }
            })

            if (player != null) {
                player.missiles.forEach(missile => {
                    if (enemy.collisionWithObject(missile)) {
                        enemy.isDestroyed = true;

                        if (!enemy.isDestroyed) {
                            bonuses.push(new Bonus(enemy.positionX, enemy.positionY));
                            bonuses.at(-1).start();
                            this.score++;
                            infoPanel.addScore(1);
                        }

                        explosionSound.play();
                        
                        enemy.stop();
                        enemies = arrayRemove(enemies, enemy);
                        missile.stop();
                        player.missiles = arrayRemove(player.missiles, missile);
                    }
                })
            }

            enemy.missiles.forEach(missile => {
                if (player != null && player.collisionWithObject(missile)) {
                    hitSound.play();
                    missile.stop();
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