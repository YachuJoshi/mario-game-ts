import { initCanvas } from "./canvas";
import { Mario } from "./mario";
import "./style.css";

const { canvas, ctx } = initCanvas();
const mario = new Mario({
  x: 100,
  y: 100,
});

function animate() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  mario.update(ctx);

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyA":
      mario.dx = -mario.speed;
      break;
    case "KeyD":
      mario.dx = mario.speed;
      console.log("Right");
      break;
    case "Space":
      mario.dy -= 20;
      break;
  }
});

window.addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "KeyA":
      mario.dx = 0;
      break;
    case "KeyD":
      mario.dx = 0;
      break;
  }
});
