import platform from "./image/platform.png";
import { createNewImage } from "./utils";
interface PlatformProps {
  x: number;
  y: number;
}

export class Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  dx: number;
  image: HTMLImageElement;

  constructor(props: PlatformProps) {
    this.image = createNewImage(platform);
    this.x = props.x;
    this.y = props.y;
    this.width = this.image.width;
    this.height = this.image.height;
    this.speed = 3;
    this.dx = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update(ctx: CanvasRenderingContext2D): void {
    this.draw(ctx);
    this.x += this.dx;
  }
}
