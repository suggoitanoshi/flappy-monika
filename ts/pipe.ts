class ObstacleBase extends Collidable implements Renderable{
  private monika: Monika;
  isActive: boolean;
  debugColor: String;
  type: number;
  constructor(monika: Monika, y: number, size: [number, number]){
    super();
    this.size = size;
    this.monika = monika;
    this.position = [this.monika.getSize()[0]+this.size[0], y];
    this.mask = 0b001;
    this.isActive = true;
    this.debugColor = 'blue';
  }
  public onCollide(other: Collidable): void{
  }
  public render(delta, ctx){
    this.position[0] -= this.monika.getSpeed()*delta;
    if(this.monika.isDebug()){
      ctx.beginPath();
      ctx.lineWidth = '2';
      ctx.strokeStyle = this.debugColor;
      ctx.rect(this.position[0], this.position[1], this.size[0], this.size[1]);
      ctx.stroke();
    }
  }
  public reinstance(y: number, h: number): Obstacle{
    this.position = [this.monika.getSize()[0],y];
    this.isActive = true;
    return this;
  }
}
class Obstacle extends ObstacleBase{
  constructor(monika, y, size){
    super(monika, y, size);
    this.position[0] += 3/8*this.size[0];
    this.size[0] /= 4;
    this.type = 0b01;
    this.debugColor = 'blue';
  }
  public render(delta, ctx){
    super.render(delta, ctx);
  }
  public reinstance = (y: number, h: number): Obstacle =>{
    super.reinstance(y, h);
    this.size[1] = h;
    this.position[0] += 3/2*this.size[0];
    return this;
  }
}
class ObstaclePoint extends ObstacleBase{
  private hitMonika: ImageBitmap;
  constructor(monika: Monika, y: number, size: [number, number], hitMonika: ImageBitmap){
    super(monika, y, size);
    this.type = 0b10;
    this.mask = 0b10;
    this.debugColor = 'purple';
    this.hitMonika = hitMonika;
  }
  public reinstance = (y: number): Obstacle =>{
    super.reinstance(y, this.size[1]);
    this.mask = 0b10;
    return this;
  }
  public onCollide(other: Collidable): void{
    this.mask = 0b00;
  }
  public render(delta, ctx){
    super.render(delta, ctx);
    ctx.drawImage(this.hitMonika, this.position[0], this.position[1], this.size[0], this.size[1]);
  }
}

class ObstaclePool implements Renderable{
  private pool: Obstacle[];
  private monika: Monika;
  private generateTimer: number;
  private generatorDistance = 2;
  private hitMonika: ImageBitmap;
  private hitMonikaSize: [number, number];
  private lastGenerateY: number;
  private generateDistance: number = 200;
  private margin: number = 10;
  constructor(monika: Monika){
    this.pool = [];
    this.monika = monika;
    this.generateTimer = 0;
  }
  public generateNewPipes = () => {
    let pointY, min, max: number;
    if(typeof this.lastGenerateY !== 'undefined'){
      min = Math.max(0, this.lastGenerateY - this.generateDistance);
      max = Math.min(this.monika.getSize()[1]-this.hitMonikaSize
      [1], this.lastGenerateY +  this.generateDistance);
    }
    else{
      min = 0;
      max = this.monika.getSize()[1] - this.hitMonikaSize[1];
    }
    pointY = Util.getRandomRange(min, max);
    this.lastGenerateY = pointY;
    let top = false;
    let bottom = false;
    let point = false;
    for(let p of this.pool){
      if(p.isActive){ continue; }
      if(p.type == 0b01){
        if(!top){
          top = true;
          p.reinstance(0, pointY-this.margin);
          continue;
        }
        if(!bottom){
          bottom = true;
          p.reinstance(pointY+this.hitMonikaSize[1]+this.margin, this.monika.getSize()[1]);
          continue;
        }
      }
      if(p.type == 0b10){
        if(!point){
          point = true;
          (<ObstaclePoint>p).reinstance(pointY);
          continue;
        }
      }
      if(top && bottom && point) break;
    };
    if(!top){
      this.pool.push(new Obstacle(this.monika, 0, [this.hitMonikaSize[0],pointY-this.margin]));
    }
    if(!bottom){
      this.pool.push(new Obstacle(this.monika, pointY+this.hitMonikaSize[1]+this.margin, [this.hitMonikaSize[0],this.monika.getSize()[1]]));
    }
    if(!point){
      this.pool.push(new ObstaclePoint(this.monika, pointY, this.hitMonikaSize, this.hitMonika));
    }
  }
  public start(){
    this.generateNewPipes();
  }
  public render(delta: number, ctx: CanvasRenderingContext2D){
    this.generateTimer += delta;
    if(this.generateTimer > this.generatorDistance){
      this.generateNewPipes();
      this.generateTimer = 0;
    }
    this.pool.forEach((p) => {
      if(p.isActive){
        p.render(delta, ctx);
        p.checkCollision(monika.getPlayer());
        p.position[0] -= this.monika.getSpeed()*delta;
        if(p.position[0] <= -p.size[0]){
          p.isActive = false;
        }
      }
    });
  }
  public load(callback: Function): void{
    let i = new Image();
    i.src = '/assets/assets.portal.png';
    i.onload = () => {
      createImageBitmap(i).then((s)=>{
        this.hitMonika = s;
        let h = this.monika.getSize()[1]/5;
        this.hitMonikaSize = [s.width/s.height*h, h];
        callback();
      });
    }
  }
  public reset(){
    this.pool.forEach((p)=>{
      p.isActive = false;
    });
  }
}