import { createNewImage } from "./utils";

interface Position {
  x: number;
  y: number;
}
export class Generics {
  x: number;
  y: number;
  image: HTMLImageElement;
  width: number;
  height: number;
  dx: number;
  speed: number;

  constructor(
    imageSrc: string,
    position: Position = {
      x: -1,
      y: -1,
    }
  ) {
    this.x = position.x;
    this.y = position.y;
    this.image = createNewImage(imageSrc);
    this.width = this.image.width;
    this.height = this.image.height;
    this.dx = 0;
    this.speed = 6;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update(): void {
    this.x += this.dx;
  }
}
