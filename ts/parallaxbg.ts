class ParallaxBackground implements Renderable{
  private bg: ImageBitmap;
  private size: [number, number];
  private position: number;
  constructor(monika: Monika){
    this.size = monika.getSize();
    this.position = 0;
  }
  public load(callback: Function){
    let i = new Image();
    i.src = '/assets/assets.background-space.png';
    i.onload = () => {
      createImageBitmap(i).then((s)=>{
        this.bg = s;
        this.size[0] = this.size[0]/this.size[1]*s.width;
        callback();
      });
    }
  }
  public render(delta, ctx){
    this.position -= 50*delta;
    if(this.position + this.size[0] <= 0){
      this.position = 0
    }
    ctx.drawImage(this.bg, this.position, 0, this.size[0], this.size[1]);
    if(this.position <= this.size[0])
      ctx.drawImage(this.bg, this.position+this.size[0], 0, this.size[0], this.size[1]);
  }
}