class Obstacle extends Collidable implements Renderable{
  private monika: Monika;
  isActive: boolean;
  color: String;
  constructor(monika: Monika, y: number, height: number){
    super();
    this.size = [50, height];
    this.monika = monika;
    this.position = [this.monika.getSize()[0]+this.size[0], y];
    this.mask = 0b001;
    this.isActive = true;
    this.color = 'blue';
  }
  public onCollide(other: Collidable): void{
  }
  public render(delta, ctx){
    this.position[0] -= this.monika.getSpeed()*delta;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
  }
  public reinstance = (y: number, h: number): Obstacle =>{
    this.position = [this.monika.getSize()[0]+this.size[0],y];
    this.size[1] = h;
    this.isActive = true;
    return this;
  }
}
class ObstaclePoint extends Obstacle{
  constructor(monika: Monika, y: number, height: number){
    super(monika, y, height);
    this.mask = 0b10;
    this.color = 'purple';
  }
  public onCollide(other: Collidable): void{
    this.isActive = false;
  }
}

class ObstaclePool implements Renderable{
  private pool: Obstacle[];
  private monika: Monika;
  private generateTimer: number;
  constructor(monika: Monika){
    this.pool = [];
    this.monika = monika;
    this.generateTimer = 0;
  }
  public generateNewPipes = () => {
    let rndH = Util.getRandomRange(50,this.monika.getSize()[1]*3/4-80);
    let botH = Util.getRandomRange((this.monika.getSize()[1]-rndH)/3, this.monika.getSize()[1]-rndH-(50*3/2));
    let pointH = this.monika.getSize()[1]-rndH-botH;
    let top = false;
    let bottom = false;
    let point = false;
    for(let p of this.pool){
      if(p.isActive){ continue; }
      if(p.mask == 0b01){
        if(!top){
          top = true;
          p.reinstance(0, rndH);
          continue;
        }
        if(!bottom){
          bottom = true;
          p.reinstance(this.monika.getSize()[1]-botH, botH);
          continue;
        }
      }
      if(p.mask == 0b10){
        if(!point){
          point = true;
          p.reinstance(rndH, pointH);
          continue;
        }
      }
      if(top && bottom && point) break;
    };
    if(!top){
      this.pool.push(new Obstacle(this.monika, 0, rndH));
    }
    if(!bottom){
      this.pool.push(new Obstacle(this.monika, this.monika.getSize()[1]-botH, botH));
    }
    if(!point){
      this.pool.push(new ObstaclePoint(this.monika, rndH, pointH));
    }
  }
  public render(delta: number, ctx: CanvasRenderingContext2D){
    this.generateTimer += delta;
    if(this.generateTimer > 2){
      this.generateNewPipes();
      this.generateTimer = 0;
    }
    this.pool.forEach((p) => {
      if(p.isActive){
        p.render(delta, ctx);
        p.checkCollision(monika.getPlayer());
        p.position[0] -= this.monika.getSpeed();
        if(p.position[0] <= -p.size[0]){
          p.isActive = false;
        }
      }
    });
  }
}