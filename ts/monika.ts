class JustMonika extends Collidable implements Renderable, Listener{
  private gravity: number;
  upAccel: number;
  private monika: Monika;
  private monikaRender: ImageBitmap;
  private angle: number;
  constructor(monika: Monika, x: number, y: number){
    super();
    this.position = [x,y];
    this.size = [30,30];
    this.mask = 0b11;
    this.gravity = 200;
    this.upAccel = 0;
    this.monika = monika;
    this.angle = 0;
  }
  public checkCollision(other: Collidable): boolean{
    return false 
  }
  public onCollide(other: Collidable): void{
    if(other.mask == 0b01) this.monika.GameOver();
    else if(other.mask == 0b10) this.monika.addPoint();
  }
  public render(delta, ctx): void{
    // ctx.save();
    // ctx.translate(this.position[0]+this.size[0]/2, this.position[1]+this.size[1]/2);
    // ctx.rotate(this.angle*Math.PI/180);
    // ctx.fillStyle = 'red';
    this.position[1] += (this.gravity-this.upAccel)*delta;
    if(this.position[1] <= 0){
      this.position[1] = 0;
    }
    if(this.position[1]+this.size[1] >= this.monika.getSize()[1]){
      this.monika.GameOver();
    }
    if(this.upAccel >= 0) this.upAccel -= this.gravity/20;
    this.angle += 1;
    // ctx.drawImage(this.monikaRender, -this.size[0]/2, -this.size[1]/2, this.size[0], this.size[1]);
    ctx.drawImage(this.monikaRender, this.position[0], this.position[1], this.size[0], this.size[1]);
    // ctx.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
    // ctx.restore();
  }
  public startClick(){
    this.upAccel = this.gravity * 2;
    this.angle = -25;
  }
  public endClick(){}
  public load(callback: Function){
    let i = new Image();
    i.src = '/assets/assets.flying.rocket.png';
    i.onload = () => {
      createImageBitmap(i).then((s)=>{
        this.monikaRender = s;
        let h = this.monika.getSize()[1]/15
        this.size = [s.width/s.height*h,h];
        callback();
      });
    }
  }
}