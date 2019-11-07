class ObstacleBase extends Collidable {
    constructor(monika, y, size) {
        super();
        this.size = size;
        this.monika = monika;
        this.position = [this.monika.getSize()[0] + this.size[0], y];
        this.mask = 0b001;
        this.isActive = true;
        this.debugColor = 'blue';
    }
    onCollide(other) {
    }
    render(delta, ctx) {
        this.position[0] -= this.monika.getSpeed() * delta;
        if (this.monika.isDebug) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = this.debugColor;
            ctx.rect(this.position[0], this.position[1], this.size[0], this.size[1]);
            ctx.stroke();
        }
    }
    reinstance(y, h) {
        this.position = [this.monika.getSize()[0], y];
        this.isActive = true;
        return this;
    }
}
class Obstacle extends ObstacleBase {
    constructor(monika, y, size) {
        super(monika, y, size);
        this.reinstance = (y, h) => {
            super.reinstance(y, h);
            this.size[1] = h;
            this.position[0] += 3 / 2 * this.size[0];
            return this;
        };
        this.position[0] += 3 / 8 * this.size[0];
        this.size[0] /= 4;
        this.type = 0b01;
        this.debugColor = 'blue';
    }
    render(delta, ctx) {
        super.render(delta, ctx);
    }
}
class ObstaclePoint extends ObstacleBase {
    constructor(monika, y, size, hitMonika) {
        super(monika, y, size);
        this.reinstance = (y) => {
            super.reinstance(y, this.size[1]);
            this.mask = 0b10;
            return this;
        };
        this.type = 0b10;
        this.mask = 0b10;
        this.debugColor = 'purple';
        this.hitMonika = hitMonika;
    }
    onCollide(other) {
        this.mask = 0b00;
    }
    render(delta, ctx) {
        super.render(delta, ctx);
        ctx.drawImage(this.hitMonika, this.position[0], this.position[1], this.size[0], this.size[1]);
    }
}
class ObstaclePool {
    constructor(monika) {
        this.generatorDistance = 2.5;
        this.generateDistance = 300;
        this.margin = 10;
        this.generateNewPipes = () => {
            let pointY, min, max;
            if (typeof this.lastGenerateY !== 'undefined') {
                min = Math.max(0, this.lastGenerateY - this.generateDistance);
                max = Math.min(this.monika.getSize()[1] - this.hitMonikaSize[1], this.lastGenerateY + this.generateDistance);
            }
            else {
                min = 0;
                max = this.monika.getSize()[1] - this.hitMonikaSize[1];
            }
            pointY = Util.getRandomRange(min, max);
            this.lastGenerateY = pointY;
            let top = false;
            let bottom = false;
            let point = false;
            for (let p of this.pool) {
                if (p.isActive) {
                    continue;
                }
                if (p.type == 0b01) {
                    if (!top) {
                        top = true;
                        p.reinstance(0, pointY - this.margin);
                        continue;
                    }
                    if (!bottom) {
                        bottom = true;
                        p.reinstance(pointY + this.hitMonikaSize[1] + this.margin, this.monika.getSize()[1]);
                        continue;
                    }
                }
                if (p.type == 0b10) {
                    if (!point) {
                        point = true;
                        p.reinstance(pointY);
                        continue;
                    }
                }
                if (top && bottom && point)
                    break;
            }
            ;
            if (!top) {
                this.pool.push(new Obstacle(this.monika, 0, [this.hitMonikaSize[0], pointY - this.margin]));
            }
            if (!bottom) {
                this.pool.push(new Obstacle(this.monika, pointY + this.hitMonikaSize[1] + this.margin, [this.hitMonikaSize[0], this.monika.getSize()[1]]));
            }
            if (!point) {
                this.pool.push(new ObstaclePoint(this.monika, pointY, this.hitMonikaSize, this.hitMonika));
            }
        };
        this.pool = [];
        this.monika = monika;
        this.generateTimer = 0;
    }
    start() {
        this.generateNewPipes();
    }
    render(delta, ctx) {
        this.generateTimer += delta;
        if (this.generateTimer > this.generatorDistance) {
            this.generateNewPipes();
            this.generateTimer = 0;
        }
        this.pool.forEach((p) => {
            if (p.isActive) {
                p.render(delta, ctx);
                p.checkCollision(monika.getPlayer());
                p.position[0] -= this.monika.getSpeed() * delta;
                if (p.position[0] <= -p.size[0]) {
                    p.isActive = false;
                }
            }
        });
    }
    load(callback) {
        let i = new Image();
        i.src = '/assets/assets.portal.png';
        i.onload = () => {
            createImageBitmap(i).then((s) => {
                this.hitMonika = s;
                let h = this.monika.getSize()[1] / 5;
                this.hitMonikaSize = [s.width / s.height * h, h];
                callback();
            });
        };
    }
    reset() {
        this.pool.forEach((p) => {
            p.isActive = false;
        });
    }
}
//# sourceMappingURL=pipe.js.map