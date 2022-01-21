import { CANVAS_HEIGHT } from "./base";
import { createNewImage } from "./utils";
import spriteStandRight from "./image/spriteStandRight.png";
import spriteStandLeft from "./image/spriteStandLeft.png";
import spriteRunRight from "./image/spriteRunRight.png";
import spriteRunLeft from "./image/spriteRunLeft.png";

interface MarioProps {
  x: number;
  y: number;
}

interface Sprite {
  [key: string]: {
    [key: string]: number | HTMLImageElement;
  };
}

const gravity = 1.5;

export class Mario {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  frames: number;
  speed: number;
  sprites: Sprite;
  currentSprite: HTMLImageElement;
  currentCropWidth: number;

  constructor(props: MarioProps) {
    this.x = props.x;
    this.y = props.y;
    this.height = 150;
    this.width = 66;
    this.dx = 0;
    this.dy = 1;
    this.speed = 8;
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createNewImage(spriteStandRight),
        left: createNewImage(spriteStandLeft),
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: createNewImage(spriteRunRight),
        left: createNewImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875,
      },
    };
    this.currentSprite = <HTMLImageElement>this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(ctx: CanvasRenderingContext2D): void {
    this.frames++;
    if (this.frames > 28) {
      this.frames = 0;
    }

    this.draw(ctx);
    this.x += this.dx;
    this.y += this.dy;

    if (this.y + this.height + this.dy < CANVAS_HEIGHT) {
      this.dy += gravity;
    }
  }

  setSprite(
    currSprite: HTMLImageElement,
    currCropWidth: number,
    width: number
  ): void {
    this.frames = 1;
    this.currentSprite = currSprite;
    this.currentCropWidth = currCropWidth;
    this.width = width;
  }
}
