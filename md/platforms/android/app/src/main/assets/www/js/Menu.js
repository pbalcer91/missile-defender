class Menu extends GameObject {
    constructor() {
        super();

        this.height = canvas.height / 2;
        this.width = canvas.width / 2;
        this.positionX = canvas.width / 2;
        this.positionY = canvas.height / 2 + canvas.height / 6;

        this.isVisible = true;

        this.logo = new StaticImage(logoImage,
                                    canvas.width / 2 - logoWidth / 2,
                                    this.positionY - this.height / 2 - logoHeight - 10,
                                    logoWidth,
                                    logoHeight);

        this.versionLabel = new StaticText("Version: " + VERSION, canvas.width - 20, 25, 12, "#000000b4", ALIGN_RIGHT);

        this.authorLabel = new StaticText("Created by Piotr Balcer", 20, 25, 12, "#000000b4");

        this.startButton = new Button(this.positionY - logoHeight / 2, "START");
        this.scoreButton = new Button(this.positionY, "SCORES");
        //this.quitButton = new Button(this.positionY + logoHeight / 2, "QUIT");

        window.addEventListener("touchstart", (event) => {
            let clientX = event.touches[0].clientX;
            let clientY = event.touches[0].clientY;

            if (isPlaying)
                return;

            if (this.startButton.pointIsInsideBoundingRectangle(clientX, clientY)) {
                this.startButton.isClicked = true;
                return;
            }
            if (this.scoreButton.pointIsInsideBoundingRectangle(clientX, clientY)) {
                this.scoreButton.isClicked = true;
                return;
            }
            // if (this.quitButton.pointIsInsideBoundingRectangle(clientX, clientY)) {
            //     this.quitButton.isClicked = true;
            //     return;
            // }
        });

        window.addEventListener("touchmove", (event) => {
            let clientX = event.touches[0].clientX;
            let clientY = event.touches[0].clientY;

            if (isPlaying)
                return;

            if (this.startButton.isClicked
                && !this.startButton.pointIsInsideBoundingRectangle(clientX, clientY)) {
                this.startButton.isClicked = false;
                return;
            }
            if (this.scoreButton.isClicked
                && !this.scoreButton.pointIsInsideBoundingRectangle(clientX, clientY)) {
                this.scoreButton.isClicked = false;
                return;
            }
            // if (this.quitButton.isClicked
            //     && !this.quitButton.pointIsInsideBoundingRectangle(clientX, clientY)) {
            //     this.quitButton.isClicked = false;
            //     return;
            // }
        });

        window.addEventListener("touchend", () => {
            if (isPlaying)
                return;

            if (this.startButton.isClicked) {
                this.startButton.isClicked = false;
                startGame(game, player);
                return;
            }
            if (this.scoreButton.isClicked) {
                this.scoreButton.isClicked = false;
                return;
            }
            // if (this.quitButton.isClicked) {
            //     this.quitButton.isClicked = false;
            //     return;
            // }
        });
    }

    render() {
        if (isPlaying)
            return;

        this.logo.render();
        this.versionLabel.render();
        this.authorLabel.render();
        this.startButton.render();
        this.scoreButton.render();
        //this.quitButton.render();
    }
}