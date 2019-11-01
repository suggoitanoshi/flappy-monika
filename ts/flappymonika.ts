class Monika{
  private width: number;
  private height: number;
  private readonly ctx: CanvasRenderingContext2D;
  private cvs: HTMLCanvasElement;
  private lastRender: number = 0;
  private renderObjects: Renderable[] = [];
  private renderBG: Renderable;
  private renderID: number;
  private isGameOver: boolean;

  private point: number;

  private scrollSpeed: number;

  private justmonika: JustMonika;
  /**
   * Game Constructor
   * Constructs the game with screen width and height
   */
  constructor(){
    let ratio = window.innerWidth / window.innerHeight;
    this.height = 700;
    this.width = this.height*ratio;

    this.scrollSpeed = 2;
    this.point = 0;

    this.cvs = document.createElement('canvas');
    this.cvs.id = 'MONIKA';
    this.cvs.width = this.width;
    this.cvs.height = this.height;
    this.cvs.style.width = '100vw';
    this.cvs.style.height = '100vh';

    document.body.append(this.cvs);
    this.ctx = this.cvs.getContext('2d');
  }
  private clear(): void{
    this.ctx.clearRect(0,0,this.width,this.height);
  }
  private drawBg(delta, ctx): void{
    this.renderBG.render(delta, ctx);
  }
  public getSize(): [number, number]{
    return [this.width, this.height];
  }
  public getCanvas(): HTMLCanvasElement{
    return this.cvs;
  }
  public getSpeed(): number{
    return this.scrollSpeed;
  }

  public setPlayer(justmonika: JustMonika): void{
    this.justmonika = justmonika;
  }
  public getPlayer(): JustMonika{
    return justmonika;
  }

  public addPoint(): void{
    this.point += 1;
  }
  public getPoint(): number{
    return this.point;
  }
  /**
   * Initialize the game
   */
  public InitGame(): void{
    this.clear();
    this.drawBg(0,this.ctx);
  }
  public ResetGame(): void{
    this.point = 0;
  }
  public addRenderObject(renderObject: Renderable): void{
    this.renderObjects.push(renderObject);
  }
  public setBackground(bg: Renderable): void{
    this.renderBG = bg;
  }
  /**
   * Function to render globally
   */
  public render(now: number): void{
    if(this.isGameOver) return;
    let delta = .001;
    if(this.lastRender != 0){
      delta = (now-this.lastRender)/1000;
    }
    this.lastRender = now;
    this.clear();
    this.drawBg(delta, this.ctx);
    this.renderObjects.forEach(r => r.render(delta, this.ctx));
    this.renderPoints();
    this.renderID = window.requestAnimationFrame((d) => this.render(d));
  }
  private renderPoints(): void{
    this.ctx.font = '30px Helvetica';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(this.point.toString(), this.width/2, 50);
  }
  public start(): void{
    this.isGameOver = false;
    this.renderID = window.requestAnimationFrame((d) => this.render(d));
  }
  public GameOver(): void{
    alert('Game Over');
    this.isGameOver = true;
  }
}