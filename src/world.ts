import { Mario } from "./mario";
import { initCanvas } from "./canvas";
import { CANVAS_HEIGHT } from "./base";
import { Platform } from "./platform";
import { Generics } from "./generics";
import { Goomba } from "./goomba";
import {
  generateNewPlatforms,
  generateNewGoombas,
  regeneratePlatforms,
  regenerateGoombas,
  getBackgroundInstance,
  getHillInstance,
} from "./utils";

class World {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mario: Mario;
  goombas: Goomba[];
  platforms: Platform[];
  isMarioAlive: boolean;
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
    this.isMarioAlive = true;

    const state = JSON.parse(localStorage.getItem("state") || "{}");
    this.mario = new Mario({
      x: state?.mario?.x || 100,
      y: 100,
    });
    this.platforms = state?.platforms
      ? regeneratePlatforms(state.platforms)
      : generateNewPlatforms();
    this.goombas = state?.goombas
      ? regenerateGoombas(state.goombas)
      : generateNewGoombas(this.platforms);
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
    this.hill.draw(ctx, this.scrollOffset);
    this.platforms.forEach((platform) => platform.draw(ctx, this.scrollOffset));
    this.goombas.forEach((goomba) => goomba.draw(ctx, this.scrollOffset));
    this.mario.draw(ctx);
  }

  gameLoop(): void {
    this.mario.update();
    this.goombas.forEach((goomba) => goomba.update());

    this.animateCharaters();
    this.marioPlatformCollision();
    this.marioGoombaCollision();
    this.setMarioSprite();

    // Win Condition
    if (this.scrollOffset >= 8700) {
      console.log("You Win");
    }

    // Lose Condition
    if (this.mario.y > CANVAS_HEIGHT) {
      setTimeout(() => {
        this.init();
      }, 0);
    }
  }

  setMarioSprite() {
    if (
      this.keys["KeyD"] &&
      this.lastKey === "right" &&
      this.mario.currentSprite !== this.mario.sprites.run.right
    ) {
      return this.mario.setSprite(this.mario.sprites.run.right, 341, 127.875);
    }

    if (
      this.keys["KeyA"] &&
      this.lastKey === "left" &&
      this.mario.currentSprite !== this.mario.sprites.run.left
    ) {
      return this.mario.setSprite(this.mario.sprites.run.left, 341, 127.875);
    }

    if (
      !this.keys["KeyA"] &&
      this.lastKey === "left" &&
      this.mario.currentSprite !== this.mario.sprites.stand.left
    ) {
      return this.mario.setSprite(this.mario.sprites.stand.left, 177, 66);
    }

    if (
      !this.keys["KeyD"] &&
      this.lastKey === "right" &&
      this.mario.currentSprite !== this.mario.sprites.stand.right
    ) {
      return this.mario.setSprite(this.mario.sprites.stand.right, 177, 66);
    }
  }

  animateCharaters(): void {
    if (this.keys["KeyA"] && this.keys["KeyD"]) {
      this.mario.dx = 0;
      return;
    }

    if (this.keys["KeyA"] && this.mario.x > 100) {
      this.mario.dx = -this.mario.speed;
      return;
    }
    if (this.keys["KeyD"] && this.mario.x < 400) {
      this.mario.dx = this.mario.speed;
      return;
    }

    this.mario.dx = 0;
    if (this.keys["KeyA"] && this.scrollOffset > 0) {
      this.scrollOffset -= 6;
      return;
    }

    if (this.keys["KeyD"]) {
      this.scrollOffset += 6;
      return;
    }
  }

  marioPlatformCollision(): void {
    this.platforms.forEach((platform) => {
      if (
        this.mario.y + this.mario.height < platform.y &&
        this.mario.y + this.mario.height + this.mario.dy >= platform.y &&
        this.mario.x + this.mario.width > platform.x - this.scrollOffset &&
        this.mario.x < platform.x + platform.width - this.scrollOffset
      ) {
        this.mario.dy = 0;
      }
    });
  }

  marioGoombaCollision = (): void => {
    this.goombas.forEach((goomba) => {
      if (
        this.mario.y + this.mario.height > goomba.y &&
        this.mario.y + this.mario.height + this.mario.dy >= goomba.y &&
        this.mario.x + this.mario.width > goomba.x - this.scrollOffset &&
        this.mario.x < goomba.x + goomba.width - this.scrollOffset
      ) {
        this.handleMarioGoombaCollision(this.mario, goomba);
      }
    });
  };

  handleMarioGoombaCollision(mario: Mario, goomba: Goomba): void {
    // Ground Collision
    if (
      mario.x + mario.width > goomba.x - this.scrollOffset &&
      mario.x < goomba.x + goomba.width - this.scrollOffset &&
      mario.y > 450 &&
      mario.y < 460
    ) {
      this.isMarioAlive = false;
      setTimeout(() => {
        this.init();
      }, 0);
      return;
    }

    // Flight Collision
    if (
      mario.y + mario.height > goomba.y &&
      mario.x + mario.width > goomba.x - this.scrollOffset &&
      mario.x < goomba.x + goomba.width - this.scrollOffset &&
      !(mario.y > 450 && mario.y < 460)
    ) {
      this.goombas = this.goombas.filter((g) => g !== goomba);
    }
  }

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

  start = (): void => {
    this.renderLoop(this.ctx);
    this.gameLoop();

    requestAnimationFrame(this.start);
  };

  save = (): void => {
    const state = {
      mario: this.mario,
      goombas: this.goombas,
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
