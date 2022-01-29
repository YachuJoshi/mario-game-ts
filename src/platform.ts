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
  image: HTMLImageElement;

  constructor(props: PlatformProps) {
    this.image = createNewImage(platform);
    this.x = props.x;
    this.y = props.y;
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw(ctx: CanvasRenderingContext2D, offset: number): void {
    let renderX: number = this.x - offset;
    ctx.drawImage(this.image, renderX, this.y, this.width, this.height);
  }
}
