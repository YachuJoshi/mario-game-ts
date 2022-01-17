import { CANVAS_HEIGHT } from "./base";

interface MarioProps {
  x: number;
  y: number;
}

const gravity = 1.5;

export class Mario {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;

  constructor(props: MarioProps) {
    this.x = props.x;
    this.y = props.y;
    this.width = 30;
    this.height = 30;
    this.dx = 0;
    this.dy = 1;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx: CanvasRenderingContext2D): void {
    this.draw(ctx);

    this.x += this.dx;
    this.y += this.dy;

    if (this.y + this.height + this.dy >= CANVAS_HEIGHT) {
      this.dy = 0;
    } else {
      this.dy += gravity;
    }
  }
}
