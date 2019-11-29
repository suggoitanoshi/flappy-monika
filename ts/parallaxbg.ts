class ParallaxBackground implements Renderable, Asset{
  loaded: boolean = false;
  private bg: ImageBitmap;
  private size: [number, number];
  private position: number;
  private speed: number;
  private bgsrc: string;
  constructor(monika: Monika, bgsrc: string){
    this.size = monika.getSize();
    this.speed = monika.getSpeed()/5;
    this.position = 0;
    this.bgsrc = bgsrc;
  }
  public load(callback: Function){
    let i = new Image();
    i.src = this.bgsrc;
    i.onload = () => {
      createImageBitmap(i).then((s)=>{
        this.bg = s;
        this.size[0] = this.size[0]/this.size[1]*s.width;
        callback();
      });
    }
  }
  public render(delta, ctx){
    this.position -= this.speed*delta;
    if(this.position + this.size[0] <= 0){
      this.position = 0
    }
    ctx.drawImage(this.bg, this.position, 0, this.size[0], this.size[1]);
    if(this.position <= this.size[0])
      ctx.drawImage(this.bg, this.position+this.size[0], 0, this.size[0], this.size[1]);
  }
}