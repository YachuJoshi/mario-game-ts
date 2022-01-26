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
    [key: string]: HTMLImageElement;
  };
}

const gravity = 1.5;
const spriteCropW = {
  stand: 177,
  run: 341,
};
const spriteWidth = {
  stand: 66,
  run: 127.875,
};

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
    this.width = spriteWidth["stand"];
    this.dx = 0;
    this.dy = 1;
    this.speed = 8;
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createNewImage(spriteStandRight),
        left: createNewImage(spriteStandLeft),
      },
      run: {
        right: createNewImage(spriteRunRight),
        left: createNewImage(spriteRunLeft),
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = spriteCropW["stand"];
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

  update(): void {
    this.frames++;
    if (this.frames > 28) {
      this.frames = 0;
    }

    this.x += this.dx;
    this.y += this.dy;

    if (this.y + this.height + this.dy < CANVAS_HEIGHT) {
      this.dy += gravity;
    }
  }

  setSprite(currSprite: HTMLImageElement, isRunning: boolean): void {
    const cropW = isRunning ? spriteCropW["run"] : spriteCropW["stand"];
    const width = isRunning ? spriteWidth["run"] : spriteWidth["stand"];

    this.frames = 1;
    this.currentSprite = currSprite;
    this.currentCropWidth = cropW;
    this.width = width;
  }
}
