interface PlatformProps {
  x: number;
  y: number;
}

export class Platform {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(props: PlatformProps) {
    this.x = props.x;
    this.y = props.y;
    this.width = 200;
    this.height = 15;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
