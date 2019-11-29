interface Renderable{
  loaded: boolean;
  render(delta: number, ctx: CanvasRenderingContext2D): void;
  load(callback: Function): void;
}