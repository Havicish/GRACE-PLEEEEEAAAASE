import { MainConsole } from "./consoleManager.js";

import * as THREE from "../../node_modules/three/build/three.module.js";

import { Canvas, Ctx } from './canvasManager.js';

export let Camera3D;
export let Scene;
let Renderer3D;
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    Scene = new THREE.Scene();
    Camera3D = new THREE.PerspectiveCamera(75, Canvas.width / Canvas.height, 0.1, 1000);
    Renderer3D = new THREE.WebGLRenderer({ canvas: Canvas, alpha: true });
    Renderer3D.setSize(Canvas.width, Canvas.height);
  }, 10);
});

export function RenderAll(Objects) {
  if (!Scene || !Renderer3D || !Camera3D) return;

  let Ambient = new THREE.AmbientLight(0xffffff, 0.25);
  Scene.add(Ambient);

  Renderer3D.render(Scene, Camera3D);
}

export function UpdateCameraStuff(W, H) {
  Camera3D.aspect = W / H;
  Camera3D.updateProjectionMatrix();
  Renderer3D.setSize(W, H);
  MainConsole.Log(`${W}, ${H}`);
}