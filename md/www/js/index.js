let canvas = null;
let ctx = null;

let gameObjects = [];

window.addEventListener("load", onAllAssetsLoaded); 
document.addEventListener("deviceready", onAllAssetsLoaded);

let game_is_loaded = false;
document.write("<div id='loadingMessage'>Loading...</div>");

function onAllAssetsLoaded() {
    if (game_is_loaded)
        return;

    game_is_loaded = true;

    document.getElementById('loadingMessage').style.visibility = "hidden";

    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    playGame();
}

Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
}

arrayRemove = function(array, value) {
    return array.filter(function(element) {
        return element != value;
    })
}