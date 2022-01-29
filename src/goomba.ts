import { createNewImage } from "./utils";
import goomba from "./image/goomba.png";

interface GoombaProps {
  x: number;
  y: number;
}

export class Goomba {
  x: number;
  y: number;
  dx: number;
  speed: number;
  width: number;
  height: number;
  initalX: number;
  offset: number;
  image: HTMLImageElement;

  constructor(props: GoombaProps) {
    this.image = createNewImage(goomba);
    this.x = props.x;
    this.y = props.y;
    this.speed = 1;
    this.dx = this.speed;
    this.height = this.image.height;
    this.width = this.image.height;
    this.initalX = this.x;
    this.offset = 100;
  }

  draw(ctx: CanvasRenderingContext2D, worldOffset: number): void {
    let renderX = this.x - worldOffset;
    ctx.drawImage(this.image, renderX, this.y, this.width, this.height);
  }

  update(): void {
    if (this.x >= this.initalX + this.offset) this.dx = -this.speed;
    if (this.x <= this.initalX - this.offset) this.dx = this.speed;

    this.x += this.dx;
  }
}
