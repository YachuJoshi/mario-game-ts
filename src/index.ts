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
