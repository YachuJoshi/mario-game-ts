import { initCanvas } from "./canvas";
import { Mario } from "./mario";
import { Platform } from "./platform";
import "./style.css";

const { canvas, ctx } = initCanvas();
const mario = new Mario({
  x: 100,
  y: 100,
});
let globalDistance = 0;
const keys = {
  isRightPressed: false,
  isLeftPressed: false,
};

const platforms = [
  new Platform({
    x: 200,
    y: 200,
  }),
  new Platform({
    x: 500,
    y: 300,
  }),
];

function animate() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  platforms.forEach((platform) => platform.update(ctx));
  mario.update(ctx);

  if (keys.isLeftPressed && mario.x > 100) {
    mario.dx = -mario.speed;
  } else if (keys.isRightPressed && mario.x < 500) {
    mario.dx = mario.speed;
  } else {
    mario.dx = 0;

    if (keys.isLeftPressed && globalDistance > 0) {
      globalDistance -= 5;
      platforms.forEach((platform) => {
        platform.dx = platform.speed;
      });
    } else if (keys.isRightPressed) {
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
      keys.isLeftPressed = true;
      break;
    case "KeyD":
      keys.isRightPressed = true;
      break;
    case "Space":
      mario.dy -= 20;
      break;
  }
});

window.addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "KeyA":
      keys.isLeftPressed = false;
      break;
    case "KeyD":
      keys.isRightPressed = false;
      break;
  }
});
