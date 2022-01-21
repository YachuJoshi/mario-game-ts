import { Mario } from "./mario";
import { initCanvas } from "./canvas";
import { CANVAS_HEIGHT } from "./base";
import { Platform } from "./platform";
import { Generics } from "./generics";
import {
  generatePlatform,
  getBackgroundInstance,
  getHillInstance,
} from "./utils";
import "./style.css";

const { canvas, ctx } = initCanvas();
const keys: {
  [key: string]: boolean;
} = {
  KeyA: false,
  KeyD: false,
};

let mario: Mario;
let platforms: Platform[];
let globalDistance: number;
let background: Generics;
let hill: Generics;
let lastKey: string;

function init() {
  mario = new Mario({
    x: 100,
    y: 100,
  });
  platforms = generatePlatform();
  background = getBackgroundInstance();
  hill = getHillInstance();
  globalDistance = 0;
}

function draw() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.draw(ctx);
  hill.update(ctx);
  platforms.forEach((platform) => platform.update(ctx));
  mario.update(ctx);
}

function animate() {
  draw();

  // Mario, Platform & Hill movement
  if (keys["KeyA"] && keys["KeyD"]) {
    mario.dx = 0;
    platforms.forEach((platform) => {
      platform.dx = 0;
    });
    hill.dx = 0;
  } else if (keys["KeyA"] && mario.x > 100) {
    mario.dx = -mario.speed;
  } else if (keys["KeyD"] && mario.x < 500) {
    mario.dx = mario.speed;
  } else {
    mario.dx = 0;
    if (keys["KeyA"] && globalDistance > 0) {
      globalDistance--;
      platforms.forEach((platform) => {
        platform.dx = platform.speed;
      });
      hill.dx = hill.speed;
    } else if (keys["KeyD"]) {
      globalDistance++;
      platforms.forEach((platform) => {
        platform.dx = -platform.speed;
      });
      hill.dx = -hill.speed;
    } else {
      platforms.forEach((platform) => {
        platform.dx = 0;
      });
      hill.dx = 0;
    }
  }

  // Mario & Platform Collision Detection
  platforms.forEach((platform) => {
    if (
      mario.y + mario.height < platform.y &&
      mario.y + mario.height + mario.dy >= platform.y &&
      mario.x + mario.width > platform.x &&
      mario.x < platform.x + platform.width
    ) {
      mario.dy = 0;
    }
  });

  // Sprite Correction
  if (
    keys["KeyD"] &&
    lastKey === "right" &&
    mario.currentSprite !== mario.sprites.run.right
  ) {
    mario.setSprite(
      <HTMLImageElement>mario.sprites.run.right,
      <number>mario.sprites.run.cropWidth,
      <number>mario.sprites.run.width
    );
  } else if (
    keys["KeyA"] &&
    lastKey === "left" &&
    mario.currentSprite !== mario.sprites.run.left
  ) {
    mario.setSprite(
      <HTMLImageElement>mario.sprites.run.left,
      <number>mario.sprites.run.cropWidth,
      <number>mario.sprites.run.width
    );
  } else if (
    !keys["KeyA"] &&
    lastKey === "left" &&
    mario.currentSprite !== mario.sprites.stand.left
  ) {
    mario.setSprite(
      <HTMLImageElement>mario.sprites.stand.left,
      <number>mario.sprites.stand.cropWidth,
      <number>mario.sprites.stand.width
    );
  } else if (
    !keys["KeyD"] &&
    lastKey === "right" &&
    mario.currentSprite !== mario.sprites.stand.right
  ) {
    mario.setSprite(
      <HTMLImageElement>mario.sprites.stand.right,
      <number>mario.sprites.stand.cropWidth,
      <number>mario.sprites.stand.width
    );
  }

  // Win Condition
  if (globalDistance >= 1450) {
    console.log("You Win");
  }

  // Lose Condition
  if (mario.y > CANVAS_HEIGHT) {
    init();
  }

  requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyA":
      keys[code] = true;
      lastKey = "left";
      break;
    case "KeyD":
      keys[code] = true;
      lastKey = "right";
      break;
    case "Space":
      mario.dy -= 20;
      break;
  }
});

window.addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "KeyA":
      keys[code] = false;
      break;
    case "KeyD":
      keys[code] = false;
      break;
  }
});
