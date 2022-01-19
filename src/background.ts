import background from "./image/background.png";
import { createNewImage } from "./utils";

class Background {
  x: number;
  y: number;
  image: HTMLImageElement;
  width: number;
  height: number;

  constructor() {
    this.x = -1;
    this.y = -1;
    this.image = createNewImage(background);
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

export function getBackgroundInstance() {
  return new Background();
}
