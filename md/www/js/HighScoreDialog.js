class HighScoreDialog extends GameObject {
    constructor() {
        super();

        this.height = canvas.height * 0.6;
        this.width = canvas.width / 2;
        this.positionX = canvas.width / 2;
        this.positionY = canvas.height * 0.6;

        this.logo = new StaticImage(logoImage,
                            canvas.width / 2 - logoWidth / 2,
                            this.positionY - this.height / 2 - logoHeight * 0.8,
                            logoWidth,
                            logoHeight);

        this.label = new StaticText("YOUR HIGHSCORE", this.positionX, this.positionY - this.height * 0.25, 24, "#f5d105", ALIGN_CENTER);
        this.pointsLabel = new StaticText(highestScore, this.positionX, this.positionY - this.height / 8, 36, "#000000", ALIGN_CENTER);

        this.backButton = new Button(this.positionY + this.height / 2 - 100, "BACK",
                                "#f5d105", "#d5b100", "#7d1313", "#000000");

        window.addEventListener("touchstart", (event) => {
            let clientX = event.touches[0].clientX;
            let clientY = event.touches[0].clientY;

            if (isPlaying)
                return;

            if (this.backButton.pointIsInsideBoundingRectangle(clientX, clientY)
                && highScoreDialogVisible) {
                this.backButton.isClicked = true;
                return;
            }
        });

        window.addEventListener("touchmove", (event) => {
            let clientX = event.touches[0].clientX;
            let clientY = event.touches[0].clientY;

            if (isPlaying)
                return;

            if (this.backButton.isClicked
                && !this.backButton.pointIsInsideBoundingRectangle(clientX, clientY)) {
                this.backButton.isClicked = false;
                return;
            }
        });

        window.addEventListener("touchend", () => {
            if (isPlaying)
                return;

            if (this.backButton.isClicked) {
                this.backButton.isClicked = false;
                showMenu();
                return;
            }
        });
    }

    render() {
        ctx.strokeStyle = "#f5d105";
        ctx.fillStyle = "#a81919";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(this.positionX - this.width / 2, this.positionY - this.height / 2,
                            this.width, this.height, this.height / 4);
        ctx.stroke();
        ctx.fill();

        this.logo.render();
        this.label.render();
        this.pointsLabel.render();
        this.backButton.render();
    }

}