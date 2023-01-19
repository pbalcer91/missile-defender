let backgroundRefreshRate = 20;

let isPlaying = false;

const VERSION = "1.0.1";

const GROUND_HEIGHT = 10;

const BACKGROUND_SKY = 0;
const BACKGROUND_GROUND = 1;
const BACKGROUND_CITY = 8;

let menuVisible = false;
let endGameDialogVisible = false;
let highScoreDialogVisible = false;

let game;
let menu;
let highScoreDialog;
let messageDialog;
let infoPanel;
let speedSlider;
let fireButton;
let player;
let enemies = [];
let buildings = [];
let bonuses = [];

let numberOfEnemies = 2;

let logoWidth;
let logoHeight;

let deviceZPosition;
let deviceXPosition;
let isDevicePositionSet = false;

let logoImage = new Image();
logoImage.src = "img/logo2.png";

let hitPointsImage1 = new Image();
hitPointsImage1.src = "img/life_sprite/life_power_up_1.png";

let hitPointsImage2 = new Image();
hitPointsImage2.src = "img/life_sprite/life_power_up_2.png";

let hitPointsImage3 = new Image();
hitPointsImage3.src = "img/life_sprite/life_power_up_3.png";

let hitPointsImage4 = new Image();
hitPointsImage4.src = "img/life_sprite/life_power_up_4.png";

let hitPointsSprite = [hitPointsImage1, hitPointsImage2, hitPointsImage3, hitPointsImage4]

let scoreImage1 = new Image();
scoreImage1.src = "img/score_sprite/Coin_1.png";

let scoreImage2 = new Image();
scoreImage2.src = "img/score_sprite/Coin_2.png";

let scoreImage3 = new Image();
scoreImage3.src = "img/score_sprite/Coin_3.png";

let scoreImage4 = new Image();
scoreImage4.src = "img/score_sprite/Coin_4.png";

let scoreSprite = [scoreImage1, scoreImage2, scoreImage3, scoreImage4]

let skyBackground = new Image();
skyBackground.src = "img/background.jpg";

let cityBackground = new Image();
cityBackground.src = "img/cityBackground.png";

let groundBackground = new Image();
groundBackground.src = "img/ground.jpg";

let buildingImage = new Image();
buildingImage.src = "img/building.png";

let cloud_1 = new Image();
cloud_1.src = "img/cloud_1.png";

let cloud_2 = new Image();
cloud_2.src = "img/cloud_2.png";

let bulletImage = new Image();
bulletImage.src = "img/bullet.png";

let planeSound = document.createElement('audio');
planeSound.volume = 0.3;
planeSound.src = 'audio/planeSound.mp3';

let shootingSound = document.createElement('audio');
shootingSound.volume = 0.4;
shootingSound.loop = false;
shootingSound.src = 'audio/shootingSound.mp3';

let hitSound = document.createElement('audio');
hitSound.volume = 0.6;
hitSound.loop = false;
hitSound.src = 'audio/hitSound.mp3';

let explosionSound = document.createElement('audio');
explosionSound.volume = 0.6;
explosionSound.loop = false;
explosionSound.src = 'audio/explosionSound.mp3';

let healingSound = document.createElement('audio');
healingSound.volume = 0.6;
healingSound.loop = false;
healingSound.src = 'audio/healingSound.mp3';

//--------------PLAYER SPRITES
playerDefaultRight = new Image();
playerDefaultRight.src = "img/player_sprite/Fokker_default_right.png";
playerUpRight = new Image();
playerUpRight.src = "img/player_sprite/Fokker_up_right.png";
playerDownRight = new Image();
playerDownRight.src = "img/player_sprite/Fokker_down_right.png";
playerDefaultLeft = new Image();
playerDefaultLeft.src = "img/player_sprite/Fokker_default_left.png";
playerUpLeft = new Image();
playerUpLeft.src = "img/player_sprite/Fokker_up_left.png";
playerDownLeft = new Image();
playerDownLeft.src = "img/player_sprite/Fokker_down_left.png";

//--------------ENEMY SPRITES
enemyDefaultRight = new Image();
enemyDefaultRight.src = "img/enemy_sprite/AEG_CIV_default_right.png";
enemyUpRight = new Image();
enemyUpRight.src = "img/enemy_sprite/AEG_CIV_up_right.png";
enemyDownRight = new Image();
enemyDownRight.src = "img/enemy_sprite/AEG_CIV_down_right.png";
enemyDefaultLeft = new Image();
enemyDefaultLeft.src = "img/enemy_sprite/AEG_CIV_default_left.png";
enemyUpLeft = new Image();
enemyUpLeft.src = "img/enemy_sprite/AEG_CIV_up_left.png";
enemyDownLeft = new Image();
enemyDownLeft.src = "img/enemy_sprite/AEG_CIV_down_left.png";

function clearGameBoardObjects() {
    enemies = [];
    buildings = [];
    bonuses = [];

    infoPanel = null;
    speedSlider = null;
    fireButton = null;

    player = null;
}

function gameOver() {
    menuVisible = false;
    highScoreDialogVisible = false;
    endGameDialogVisible = true;
    planeSound.pause();
    explosionSound.play();
    window.navigator.vibrate(1000);
    isPlaying = false;

    enemies.forEach(enemy => {
        enemy.stop();
    });

    buildings.forEach(building => {
        building.stop();
    });

    bonuses.forEach(bonus => {
        bonus.stop();
    });

    player.stop();
    
    clearGameBoardObjects();

    messageDialog = new MessageDialog(game.score);
}

function showHighScore() {
    menu = null;
    menuVisible = false;
    endGameDialogVisible = false;

    highScoreDialogVisible = true;
    highScoreDialog = new HighScoreDialog();
}

function showMenu() {
    menuVisible = true;
    endGameDialogVisible = false;
    highScoreDialogVisible = false;
    getHighScore();
    isPlaying = false;
    messageDialog = null;
    highScoreDialog = null;

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
    highScoreDialog = null;
    messageDialog = null;
        
    fireButton = new FireButton();
    speedSlider = new SpeedSlider();
    infoPanel = new InfoPanel(5);

    isPlaying = true;

    planeSound.play();

    isDevicePositionSet = false;

    game.createBuilding(2000);
    game.createEnemy(5000);
}

function playGame() {
    logoWidth = canvas.width / 4;
    logoHeight = canvas.width / 4 * 0.6;

    gameObjects[BACKGROUND_SKY] = new ScrollingBackgroundImage(skyBackground, 0, 0, canvas.width * 4, canvas.height, backgroundRefreshRate);
    gameObjects[BACKGROUND_GROUND] = new ScrollingBackgroundImage(groundBackground, 0, canvas.height - GROUND_HEIGHT,
                                        canvas.width, GROUND_HEIGHT, backgroundRefreshRate);

    gameObjects[2] = new Cloud(cloud_2, -100, 50, 300, 150, 300);       
    gameObjects[3] = new Cloud(cloud_1, 0, 0, 300, 150, 100);
    gameObjects[4] = new Cloud(cloud_1, 700, 0, 300, 150, 250);
    gameObjects[5] = new Cloud(cloud_2, 800, 50, 300, 150, 250);
    gameObjects[6] = new Cloud(cloud_2, 400, 150, 300, 150, 150);
    gameObjects[7] = new Cloud(cloud_1, -200, 200, 300, 150, 250);

    gameObjects[BACKGROUND_CITY] = new ScrollingBackgroundImage(cityBackground, 0, canvas.height / 3 + canvas.height / 3 + GROUND_HEIGHT,
                                    canvas.width, canvas.height / 3, backgroundRefreshRate);

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