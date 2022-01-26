import { Mario } from "./mario";
import { initCanvas } from "./canvas";
import { CANVAS_HEIGHT } from "./base";
import { Platform } from "./platform";
import { Generics } from "./generics";
import { Goomba } from "./goomba";
import {
  generateNewPlatforms,
  getBackgroundInstance,
  getHillInstance,
  regeneratePlatforms,
} from "./utils";

class World {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mario: Mario;
  goomba: Goomba;
  platforms: Platform[];
  scrollOffset: number;
  background: Generics;
  hill: Generics;
  lastKey: string;
  keys: {
    [key: string]: boolean;
  };

  constructor() {
    this.init();
    this.setupEventListener();
  }

  init(): void {
    const { canvas, ctx } = initCanvas();
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = {
      KeyA: false,
      KeyD: false,
    };

    const state = JSON.parse(localStorage.getItem("state") || "{}");
    this.mario = new Mario({
      x: state?.mario?.x || 100,
      y: 100,
    });
    this.goomba = new Goomba({
      x: state?.goomba?.x || 900,
      y: 522,
    });
    this.platforms = state?.platforms
      ? regeneratePlatforms(state.platforms)
      : generateNewPlatforms();
    this.background = getBackgroundInstance();
    this.hill = getHillInstance({
      x: state?.hill?.x || -1,
      y: state?.hill?.y || 28,
    });
    this.scrollOffset = state.scrollOffset || (() => 0)();
  }

  renderLoop(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.background.draw(ctx);
    this.hill.draw(ctx);
    this.platforms.forEach((platform) => platform.draw(ctx));
    this.goomba.draw(ctx);
    this.mario.draw(ctx);
  }

  gameLoop(): void {
    this.mario.update();
    this.hill.update();
    this.platforms.forEach((platform) => platform.update());

    this.animateCharaters();
    this.marioPlatformCollision();

    const isRunning = this.keys["KeyA"] || this.keys["KeyD"];
    this.setMarioSprite(isRunning);

    // Win Condition
    if (this.scrollOffset >= 1450) {
      console.log("You Win");
    }

    // Lose Condition
    if (this.mario.y > CANVAS_HEIGHT) {
      this.init();
    }

    console.log(this.scrollOffset);
  }

  start = (): void => {
    this.renderLoop(this.ctx);
    this.gameLoop();

    requestAnimationFrame(this.start);
  };

  setupEventListener(): void {
    addEventListener("keydown", ({ code }) => {
      switch (code) {
        case "KeyA":
          this.keys[code] = true;
          this.lastKey = "left";
          break;
        case "KeyD":
          this.keys[code] = true;
          this.lastKey = "right";
          break;
        case "Space":
          this.mario.dy -= 25;
          break;
      }
    });

    addEventListener("keyup", ({ code }) => {
      switch (code) {
        case "KeyA":
          this.keys[code] = false;
          break;
        case "KeyD":
          this.keys[code] = false;
          break;
      }
    });
  }

  animateCharaters(): void {
    if (this.keys["KeyA"] && this.keys["KeyD"]) {
      this.mario.dx = 0;
      this.platforms.forEach((platform) => {
        platform.dx = 0;
      });
      this.hill.dx = 0;
    } else if (this.keys["KeyA"] && this.mario.x > 100) {
      this.mario.dx = -this.mario.speed;
    } else if (this.keys["KeyD"] && this.mario.x < 400) {
      this.mario.dx = this.mario.speed;
    } else {
      this.mario.dx = 0;
      if (this.keys["KeyA"] && this.scrollOffset > 0) {
        this.scrollOffset--;
        this.platforms.forEach((platform) => {
          platform.dx = platform.speed;
        });
        this.hill.dx = this.hill.speed;
      } else if (this.keys["KeyD"]) {
        this.scrollOffset++;
        this.platforms.forEach((platform) => {
          platform.dx = -platform.speed;
        });
        this.hill.dx = -this.hill.speed;
      } else {
        this.platforms.forEach((platform) => {
          platform.dx = 0;
        });
        this.hill.dx = 0;
      }
    }
  }

  marioPlatformCollision(): void {
    this.platforms.forEach((platform) => {
      if (
        this.mario.y + this.mario.height < platform.y &&
        this.mario.y + this.mario.height + this.mario.dy >= platform.y &&
        this.mario.x + this.mario.width > platform.x &&
        this.mario.x < platform.x + platform.width
      ) {
        this.mario.dy = 0;
      }
    });
  }

  setMarioSprite(isRunning: boolean): void {
    if (
      this.keys["KeyD"] &&
      this.lastKey === "right" &&
      this.mario.currentSprite !== this.mario.sprites.run.right
    ) {
      this.mario.setSprite(
        <HTMLImageElement>this.mario.sprites.run.right,
        isRunning
      );
      return;
    } else if (
      this.keys["KeyA"] &&
      this.lastKey === "left" &&
      this.mario.currentSprite !== this.mario.sprites.run.left
    ) {
      this.mario.setSprite(
        <HTMLImageElement>this.mario.sprites.run.left,
        isRunning
      );
      return;
    } else if (
      !this.keys["KeyA"] &&
      this.lastKey === "left" &&
      this.mario.currentSprite !== this.mario.sprites.stand.left
    ) {
      this.mario.setSprite(
        <HTMLImageElement>this.mario.sprites.stand.left,
        isRunning
      );
      return;
    } else if (
      !this.keys["KeyD"] &&
      this.lastKey === "right" &&
      this.mario.currentSprite !== this.mario.sprites.stand.right
    ) {
      this.mario.setSprite(
        <HTMLImageElement>this.mario.sprites.stand.right,
        isRunning
      );
      return;
    }
  }

  save = (): void => {
    const state = {
      mario: this.mario,
      goomba: this.goomba,
      platforms: this.platforms,
      scrollOffset: this.scrollOffset,
      background: this.background,
      hill: this.hill,
      lastKey: this.lastKey,
    };
    localStorage.setItem("state", JSON.stringify(state));
  };

  reset = (): void => {
    localStorage.clear();
    location.reload();
  };
}

export const world = new World();
