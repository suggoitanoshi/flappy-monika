class Util{
  public static getRandomRange(min: number, max: number): number{
    return Math.random() * (max-min+1)+min;
  }
}

interface Asset{
  load(callback: Function): void;
}