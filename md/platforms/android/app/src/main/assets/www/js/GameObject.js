class GameObject {
    constructor(updateStateMilliseconds = 10, delay = 0) {
        this.gameObjectInterval = null;
        this.gameObjectIsDisplayed = false;
        this.updateStateMilliseconds = updateStateMilliseconds;
        this.delay = delay;
    }

    start() {
        function startUpdateStateInterval() {
            this.gameObjectInterval = setInterval(this.updateState.bind(this), this.updateStateMilliseconds);
            this.gameObjectIsDisplayed = true;
        }

        if ((this.updateStateMilliseconds !== null) && (this.gameObjectInterval === null)) {
            setTimeout(startUpdateStateInterval.bind(this), this.delay);
            return;
        }

        if (this.updateStateMilliseconds === null)
            this.gameObjectIsDisplayed = true;
    }

    stop() {
        if (this.gameObjectInterval !== null) {
            clearInterval(this.gameObjectInterval);
            this.gameObjectInterval = null;
        }

        this.gameObjectIsDisplayed = true;
    }

    stopAndHide() {
        this.stop();
        this.gameObjectIsDisplayed = false;
    }

    isDisplayed() {
        return (this.gameObjectIsDisplayed);
    }

    updateState() {

    }

    render() {
        
    }
}