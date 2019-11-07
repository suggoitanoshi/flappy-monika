class ParallaxBackground {
    constructor(monika) {
        this.size = monika.getSize();
        this.speed = monika.getSpeed() / 5;
        this.position = 0;
    }
    load(callback) {
        let i = new Image();
        i.src = '/assets/assets.background-space.png';
        i.onload = () => {
            createImageBitmap(i).then((s) => {
                this.bg = s;
                this.size[0] = this.size[0] / this.size[1] * s.width;
                callback();
            });
        };
    }
    render(delta, ctx) {
        this.position -= this.speed * delta;
        if (this.position + this.size[0] <= 0) {
            this.position = 0;
        }
        ctx.drawImage(this.bg, this.position, 0, this.size[0], this.size[1]);
        if (this.position <= this.size[0])
            ctx.drawImage(this.bg, this.position + this.size[0], 0, this.size[0], this.size[1]);
    }
}
//# sourceMappingURL=parallaxbg.js.map