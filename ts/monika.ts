class JustMonika extends Collidable implements Renderable, Listener{
  private gravity: number;
  upAccel: number;
  private monika: Monika;
  constructor(monika: Monika, x: number, y: number){
    super();
    this.position = [x,y];
    this.size = [30,30];
    this.mask = 0b11;
    this.gravity = 200;
    this.upAccel = 0;
    this.monika = monika;
  }
  public checkCollision(other: Collidable): boolean{
    return false 
  }
  public onCollide(other: Collidable): void{
    if(other.mask == 0b01) this.monika.GameOver();
    else if(other.mask == 0b10) this.monika.addPoint();
  }
  public render(delta, ctx): void{
    ctx.fillStyle = 'red';
    this.position[1] += (this.gravity-this.upAccel)*delta;
    if(this.position[1] <= 0){
      this.position[1] = 0;
    }
    if(this.position[1] >= this.monika.getSize()[1]){
      this.monika.GameOver();
    }
    if(this.upAccel >= 0) this.upAccel -= this.gravity/20;
    ctx.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
  }
  public startClick(){
    this.upAccel = this.gravity * 2;
  }
  public endClick(){}
}