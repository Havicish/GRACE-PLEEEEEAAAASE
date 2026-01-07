/** @type {HTMLCanvasElement} */
export let Canvas = document.getElementById("Canvas");
/** @type {WebGL2RenderingContext} */
export let Ctx = Canvas.getContext("webgl2");

window.addEventListener("resize", () => {
  Canvas.width = window.innerWidth;
  Canvas.height = window.innerHeight;
});

document.addEventListener("DOMContentLoaded", () => {
  Canvas.width = window.innerWidth;
  Canvas.height = window.innerHeight;
});

export function HideCanvas() {
  Canvas.style.display = "none";
}

export function ShowCanvas() {
  Canvas.style.display = "inline";
}