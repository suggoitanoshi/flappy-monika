interface Listener{
  startClick(): void;
  endClick(): void;
}

class EventListener{
  private monika;
  private listeners: Array<Listener>;
  constructor(monika: Monika){
    this.monika = monika;
    this.listeners = [];
    window.addEventListener('mousedown', this.start, false);
    window.addEventListener('mouseup', this.end, false);
    window.addEventListener('touchstart', this.start, false);
    window.addEventListener('touchend', this.end, false);
  }
  private start = (e: Event) => {
    if(e.target == this.monika.getCanvas()){
      this.listeners.forEach((l)=>{
        l.startClick();
      });
    }
  }
  private end = (e) => {
    if(e.target == this.monika.getCanvas()){
      this.listeners.forEach((l)=>{
        l.endClick();
      });
    }
  }
  public addListener(listener: Listener){
    this.listeners.push(listener);
  }
}