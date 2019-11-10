class Monika {
    /**
     * Game Constructor
     * Constructs the game with screen width and height
     */
    constructor() {
        this.lastRender = 0;
        this.renderObjects = [];
        this.debug = false;
        this.objectsToLoad = [];
        let ratio = window.innerWidth / window.innerHeight;
        this.height = 700;
        this.width = this.height * ratio;
        this.scrollSpeed = 100;
        this.point = 0;
        this.cvs = document.createElement('canvas');
        this.cvs.id = 'MONIKA';
        this.cvs.width = this.width;
        this.cvs.height = this.height;
        this.cvs.style.width = '100vw';
        this.cvs.style.height = '100vh';
        document.body.prepend(this.cvs);
        this.ctx = this.cvs.getContext('2d');
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'medium';
        this.overlay = document.querySelector('.overlay');
        this.scoreEl = document.querySelector('#score');
        this.restart = document.querySelector('#restart');
        this.loadParent = document.querySelector('.loader');
        this.loadBar = this.loadParent.querySelector('.bar');
        this.loadText = this.loadParent.querySelector('#load-percent');
        this.restart.addEventListener('click', () => this.ResetGame());
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    drawBg(delta, ctx) {
        this.renderBG.render(delta, ctx);
    }
    getSize() {
        return [this.width, this.height];
    }
    getRatio() {
        let rect = this.cvs.getBoundingClientRect();
        return [this.width / rect.width, this.height / rect.height];
    }
    getCanvas() {
        return this.cvs;
    }
    getSpeed() {
        return this.scrollSpeed;
    }
    setPlayer(justmonika) {
        this.justmonika = justmonika;
    }
    getPlayer() {
        return justmonika;
    }
    setObstaclePool(obstaclepool) {
        this.obstaclepool = obstaclepool;
    }
    ;
    addPoint() {
        this.point += 1;
    }
    getPoint() {
        return this.point;
    }
    isDebug() {
        return this.debug;
    }
    /**
     * Initialize the game
     */
    InitGame() {
        this.clear();
        this.drawBg(0, this.ctx);
    }
    ResetGame() {
        this.point = 0;
        this.justmonika.reset();
        this.obstaclepool.reset();
        this.overlay.classList.add('none');
        this.scrollSpeed = 100;
        this.start();
    }
    addRenderObject(renderObject) {
        this.renderObjects.push(renderObject);
        this.objectsToLoad.push(renderObject);
    }
    setBackground(bg) {
        this.renderBG = bg;
        this.objectsToLoad.push(bg);
    }
    /**
     * Function to render globally
     */
    render(now) {
        if (this.isGameOver)
            return;
        else {
            let delta = .001;
            if (this.lastRender != 0) {
                delta = (now - this.lastRender) / 1000;
            }
            this.scrollSpeed += .1 * delta;
            this.clear();
            this.drawBg(delta, this.ctx);
            this.renderObjects.forEach(r => r.render(delta, this.ctx));
            this.renderPoints();
            this.lastRender = now;
            this.renderID = window.requestAnimationFrame((d) => this.render(d));
        }
    }
    renderPoints() {
        this.ctx.font = '30px Helvetica';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(this.point.toString(), this.width / 2, 50);
    }
    start() {
        this.isGameOver = false;
        this.lastRender = 0;
        this.renderID = window.requestAnimationFrame((d) => this.render(d));
    }
    GameOver() {
        this.isGameOver = true;
        this.scoreEl.innerText = this.point.toString();
        this.overlay.classList.remove('none');
    }
    load(callback) {
        this.objectsToLoad.forEach((o) => {
            o.load(() => {
                o.loaded = true;
            });
        });
        this.loadCheck().then(() => callback());
    }
    loadCheck() {
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                let allLoaded = true;
                this.loadPercent = 0;
                this.objectsToLoad.forEach((o) => {
                    if (!o.loaded)
                        allLoaded = false;
                    else
                        this.loadPercent++;
                });
                this.loadPercent /= this.objectsToLoad.length;
                this.loadPercent *= 100;
                this.loadBar.style.width = this.loadPercent + '%';
                this.loadText.innerText = this.loadPercent + '%';
                if (allLoaded) {
                    clearInterval(interval);
                    this.loadParent.classList.add('none');
                    resolve();
                }
            }, 1 / 100);
        });
    }
}
