class Cloud extends GameObject {

    constructor(image, x, y, width, height, updateStateMilliseconds) {
        super(updateStateMilliseconds);

        this.image = image;
        this.width = width; 
        this.height = height;
        this.x = x;
        this.y = y;
        this.velocity = 1;  
    }

    render() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    updateState() {
        this.x += this.velocity
        if(this.x > canvas.width)
            this.x = -this.width
    }

    setVelocity(velocity) {
        this.velocity = parseInt(velocity)
    }
}