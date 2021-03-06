let monika = new Monika();
let justmonika = new JustMonika(monika, 20, monika.getSize()[1] / 2 - 10);
monika.addRenderObject(justmonika);
monika.setPlayer(justmonika);
let bg = new ParallaxBackground(monika);
monika.setBackground(bg);
let el = new EventListener(monika);
el.addListener(justmonika);
let op = new ObstaclePool(monika);
monika.addRenderObject(op);
monika.setObstaclePool(op);
justmonika.load(() => op.load(() => bg.load(() => {
    op.start();
    monika.InitGame();
    monika.start();
})));
//# sourceMappingURL=main.js.map