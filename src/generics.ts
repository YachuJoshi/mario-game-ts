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
  }

  draw(ctx: CanvasRenderingContext2D, offset: number = 0): void {
    const renderX = this.x - offset;
    ctx.drawImage(this.image, renderX, this.y, this.width, this.height);
  }
}
