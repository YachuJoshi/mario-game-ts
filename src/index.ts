import { initCanvas } from "./canvas";
import { Mario } from "./mario";
import { Platform } from "./platform";
import { MAP_WIDTH, PLATFORM_WIDTH } from "./base";
import { Generics, getBackgroundInstance, getHillInstance } from "./generics";
import "./style.css";

const { canvas, ctx } = initCanvas();
const keys: {
  [key: string]: boolean;
} = {};

let mario: Mario;
let platforms: Platform[];
let globalDistance: number;
let background: Generics;
let hill: Generics;

function getPlatforms() {
  const platforms: Platform[] = [
    new Platform({
      x: -1,
      y: 608,
    }),
  ];
  for (let i = 1, j = 0; i < MAP_WIDTH / PLATFORM_WIDTH; i++, j++) {
    const prevX = platforms[j].x;
    const GAP = Math.random() * 100 + 120;
    platforms.push(
      new Platform({
        x: prevX + PLATFORM_WIDTH + GAP,
        y: 608,
      })
    );
  }
  return platforms;
}

function init() {
  mario = new Mario({
    x: 100,
    y: 100,
  });
  platforms = getPlatforms();
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

  if (globalDistance >= 1450) {
    console.log("You Win");
  }

  requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyA":
      keys[code] = true;
      break;
    case "KeyD":
      keys[code] = true;
      break;
    case "Space":
      mario.dy -= 25;
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
