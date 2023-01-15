class CanvasGame {
    constructor() {
        this.playGameLoop();
    }

    start() {
        for (let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].start();
        }
    }

    playGameLoop() {
        this.collisionDetection();
        this.render();
        
        requestAnimationFrame(this.playGameLoop.bind(this));
    }
    
    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < gameObjects.length; i++) {
            if (gameObjects[i] == null)
                continue;
                
            if(gameObjects[i] === undefined)
                gameObjects[i] = new GameObject();
            
            if (gameObjects[i].isDisplayed())
                gameObjects[i].render();
        }
    }
    
    collisionDetection() {

    }
}