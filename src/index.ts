import { initCanvas } from "./canvas";
import { Mario } from "./mario";
import { Platform } from "./platform";
import { getBackgroundInstance } from "./background";
import "./style.css";

const { canvas, ctx } = initCanvas();
const mario = new Mario({
  x: 100,
  y: 100,
});
let globalDistance = 0;
const keys: {
  [key: string]: boolean;
} = {};
const background = getBackgroundInstance();

const platforms = [
  new Platform({
    x: -1,
    y: 608,
  }),
  new Platform({
    x: 576,
    y: 608,
  }),
];

function animate() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.draw(ctx);
  platforms.forEach((platform) => platform.update(ctx));
  mario.update(ctx);

  if (keys["KeyA"] && keys["KeyD"]) {
    mario.dx = 0;
    platforms.forEach((platform) => {
      platform.dx = 0;
    });
  } else if (keys["KeyA"] && mario.x > 100) {
    mario.dx = -mario.speed;
  } else if (keys["KeyD"] && mario.x < 800) {
    mario.dx = mario.speed;
  } else {
    mario.dx = 0;
    if (keys["KeyA"] && globalDistance > 0) {
      globalDistance -= 5;
      platforms.forEach((platform) => {
        platform.dx = platform.speed;
      });
    } else if (keys["KeyD"]) {
      globalDistance += 5;
      platforms.forEach((platform) => {
        platform.dx = -platform.speed;
      });
    } else {
      platforms.forEach((platform) => {
        platform.dx = 0;
      });
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

  requestAnimationFrame(animate);
}

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
