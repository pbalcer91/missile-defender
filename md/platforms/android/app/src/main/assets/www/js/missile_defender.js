let backgroundRefreshRate = 20;

let isPlaying = false;

const VERSION = "0.2.0";

const GROUND_HEIGHT = 10;

const BACKGROUND_SKY = 0;
const BACKGROUND_GROUND = 1;

let game;
let menu;
let messageDialog;
let infoPanel;
let speedSlider;
let fireButton;
let player;
let enemies = [];
let buildings = [];

let numberOfEnemies = 3;

let logoWidth;
let logoHeight;

let deviceZPosition;
let deviceXPosition;
let isDevicePositionSet = false;


let skyBackground = new Image();
skyBackground.src = "img/background.jpg";

let groundBackground = new Image();
groundBackground.src = "img/ground.jpg";

let logoImage = new Image();
logoImage.src = "img/logo2.png";

let cloud_1 = new Image();
cloud_1.src = "img/cloud_1.png";

let cloud_2 = new Image();
cloud_2.src = "img/cloud_2.png";

function clearGameBoardObjects() {
    enemies = [];
    buildings = [];

    infoPanel = null;
    speedSlider = null;
    fireButton = null;

    player = null;
}

function gameOver() {
    window.navigator.vibrate(1000);
    isPlaying = false;

    enemies.forEach(enemy => {
        enemy.stop();
    });

    buildings.forEach(building => {
        building.stop();
    });

    player.stop();
    
    clearGameBoardObjects();

    messageDialog = new MessageDialog(game.score);
}

function showMenu() {
    isPlaying = false;
    messageDialog = null;

    clearGameBoardObjects();

    menu = new Menu();
}

function startGame(game) {
    if (game == null)
        return;

    player = new Plane(100, canvas.height / 2);
    player.start();

    game.score = 0;

    menu = null;
    messageDialog = null;
        
    fireButton = new FireButton();
    speedSlider = new SpeedSlider();
    infoPanel = new InfoPanel(5);

    isPlaying = true;

    isDevicePositionSet = false;

    game.createBuilding(1000);
    game.createEnemy(5000);
}

function playGame() {
    logoWidth = canvas.width / 4;
    logoHeight = canvas.width / 4 * 0.6;

    gameObjects[BACKGROUND_SKY] = new StaticImage(skyBackground, 0, 0, canvas.width, canvas.height);
    gameObjects[BACKGROUND_GROUND] = new ScrollingBackgroundImage(groundBackground, 0, canvas.height - GROUND_HEIGHT,
                                        GROUND_HEIGHT, backgroundRefreshRate);

    gameObjects[2] = new Cloud(cloud_2, -100, 50, 300, 150, 150);       
    gameObjects[3] = new Cloud(cloud_1, 0, 0, 300, 150, 50);
    gameObjects[4] = new Cloud(cloud_1, 700, 0, 300, 150, 125);
    gameObjects[5] = new Cloud(cloud_2, 800, 50, 300, 150, 125);
    gameObjects[6] = new Cloud(cloud_2, 400, 150, 300, 150, 75);
    gameObjects[7] = new Cloud(cloud_1, -200, 200, 300, 150, 125);

    game = new MissileDefenderCanvasGame(numberOfEnemies);

    game.start();

    showMenu();

    window.addEventListener("touchstart", (event) => {
        let clientX = event.touches[0].clientX;
        let clientY = event.touches[0].clientY;

        if (!isPlaying)
            return;

        if (fireButton.pointIsInsideBoundingCircle(clientX, clientY)) {
            player.fireMissile();
            fireButton.isClicked = true;
            return;
        }

        if (speedSlider.pointIsInsideBoundingCircle(clientX, clientY)) {
            speedSlider.isClicked = true;
            return;
        }

        if (infoPanel.pointIsInsideBoundingCircle(clientX, clientY)) {
            isDevicePositionSet = false;
            infoPanel.controlResetButtonIsClicked = true;
        }
    })

    window.addEventListener("touchmove", (event) => {
        let clientX = event.touches[0].clientX;
        let clientY = event.touches[0].clientY;

        if (!isPlaying)
            return;

        if (fireButton.isClicked
            && !fireButton.pointIsInsideBoundingCircle(clientX, clientY)) {
                fireButton.isClicked = false;
                return;
            } 

        if (speedSlider.isClicked) {
            speedSlider.changeValue(clientY);
            player.changeSpeed(speedSlider.value);
            return;
        }

        if (infoPanel.controlResetButtonIsClicked
            && !infoPanel.pointIsInsideBoundingCircle(clientX, clientY))
            infoPanel.controlResetButtonIsClicked = false;
    })

    window.addEventListener("touchend", () => {
        if (!isPlaying)
            return;

        fireButton.isClicked = false;
        speedSlider.isClicked = false;
        infoPanel.controlResetButtonIsClicked = false;
    })

    window.addEventListener("deviceorientation", (event) => {
        if (!isPlaying)
            return;

        if (!isDevicePositionSet) {
            deviceXPosition = event.gamma;
            deviceZPosition = event.alpha;
            isDevicePositionSet = true;
        }

        if (Math.abs(event.gamma - deviceXPosition) > Math.abs(event.alpha - deviceZPosition)) {
            let direction = (event.gamma - deviceXPosition > 7 ?
                                    UP 
                                    : event.gamma - deviceXPosition < -7 ?
                                        DOWN
                                        : player.direction);
            
            player.changeDirection(direction);
            return;
        }

        let direction = (event.alpha - deviceZPosition > 7 ?
                                RIGHT
                                : event.alpha - deviceZPosition < -7 ?
                                    LEFT
                                    : player.direction);
        
        player.changeDirection(direction);
    });
}