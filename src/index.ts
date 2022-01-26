import { world } from "./world";
import "./style.css";

const saveBtn = <HTMLButtonElement>document.getElementById("btn-save");
const resetBtn = <HTMLButtonElement>document.getElementById("btn-reset");
saveBtn.addEventListener("click", world.save);
resetBtn.addEventListener("click", world.reset);

world.start();
