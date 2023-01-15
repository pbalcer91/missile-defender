let enemies = []
let enemiesMissiles = []
let backgroundRefreshRate = 20;

let buildings = [];

let player;

let isPlaying = false;

let score = 0;

const GROUND_HEIGHT = 10;

const BACKGROUND_SKY = 0;
const BACKGROUND_GROUND = 1;

const POINTS = 8;
const HIT_POINTS = 9;
const PLAYER = 10;
const MESSAGE = 11;

let skyBackground = new Image();
skyBackground.src = "img/background.jpg";

let groundBackground = new Image();
groundBackground.src = "img/ground.jpg";

let cloud_1 = new Image();
cloud_1.src = "img/cloud_1.png";

let cloud_2 = new Image();
cloud_2.src = "img/cloud_2.png";

let plane = new Image();
plane.src = "img/plane.png";

let missile = new Image();
missile.src = "img/missile.png";

function stopAllObjects() {
    player.stop();
    
    gameObjects.forEach(object => {
        object.stop();
    });

    buildings.forEach(building => {
        building.stop();
    })

    enemies.forEach(enemy => {
        enemy.stop();
    })
}

function gameOver() {
    isPlaying = false;
    stopAllObjects();

    gameObjects[POINTS] = null;
    gameObjects[HIT_POINTS] = null;

    gameObjects[MESSAGE] = new StaticText("LOSE!", 100, 270, "Times Roman", 100, "red");
    gameObjects[MESSAGE].start();
}

function playGame() {
    player = new Plane();

    gameObjects[BACKGROUND_SKY] = new StaticImage(skyBackground, 0, 0, canvas.width, canvas.height);
    gameObjects[BACKGROUND_GROUND] = new ScrollingBackgroundImage(groundBackground, 0, canvas.height - GROUND_HEIGHT,
                                        GROUND_HEIGHT, backgroundRefreshRate);
    
    //TODO: chmury w petli for (od background_ground do playera)  
    gameObjects[2] = new Cloud(cloud_2, -100, 300, 300, 150, 150);       
    gameObjects[3] = new Cloud(cloud_1, 0, 0, 300, 150, 50);
    gameObjects[4] = new Cloud(cloud_1, 700, 0, 300, 150, 125);
    gameObjects[5] = new Cloud(cloud_2, 800, 50, 300, 150, 125);
    gameObjects[6] = new Cloud(cloud_2, 400, 150, 300, 150, 75);
    gameObjects[7] = new Cloud(cloud_1, -200, 200, 300, 150, 125);

    gameObjects[POINTS] = new StaticText("Points: " + score, 10, 25, "Arial", 24, "#000000b4");
    gameObjects[HIT_POINTS] = new StaticText("HP: " + player.hitPoints, 10, 60, "Arial", 24, "#000000b4");

    gameObjects[PLAYER] = player;

    //add more clouds off screen

    let game = new MissileDefenderCanvasGame();

    game.start();
    isPlaying = true;

    game.createBuilding(1000);
    game.createEnemy(5000);

    document.addEventListener("mousemove", function (e) {
        let canvasBoundingRectangle = document.getElementById("gameCanvas").getBoundingClientRect();
        let mouseX = e.clientX - canvasBoundingRectangle.left;
        let mouseY = e.clientY - canvasBoundingRectangle.top;

        if (mouseX > canvas.width || mouseY > canvas.height)
            return;

        playerPosition = [mouseX, mouseY]
    });

    document.addEventListener("keydown", function (e) {
        if (!isPlaying)
            return;

        if (e.keyCode === 32) { // space
            player.fireMissile()
        }
    });

    document.addEventListener("keydown", function (e) {
        if (!isPlaying)
            return;

        if (e.keyCode === 37) { // left
            player.changeDirection(LEFT)
        }
    });

    document.addEventListener("keydown", function (e) {
        if (!isPlaying)
            return;

        if (e.keyCode === 38) { // up
            player.changeDirection(UP)
        }
    });

    document.addEventListener("keydown", function (e) {
        if (!isPlaying)
            return;

        if (e.keyCode === 39) { // right
            player.changeDirection(RIGHT)
        }
    });

    document.addEventListener("keydown", function (e) {
        if (!isPlaying)
            return;

        if (e.keyCode === 40) { // down
            player.changeDirection(DOWN)
        }
    });
}