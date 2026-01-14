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
    Renderer3D.shadowMap.enabled = true;
    Renderer3D.shadowMap.type = THREE.BasicShadowMap;
    let Fog = new THREE.Fog(0x000000, 0.002, 25);
    //Scene.fog = Fog;
    let AmbientLight = new THREE.AmbientLight(0xe88822, 0.6);
    Scene.add(AmbientLight);
  }, 10);
});

export function RenderAll(Objects) {
  if (!Scene || !Renderer3D || !Camera3D) return;
  
  Camera3D.updateMatrixWorld();
  Renderer3D.render(Scene, Camera3D);
}

export function UpdateCameraStuff(W, H) {
  Camera3D.aspect = W / H;
  Camera3D.updateProjectionMatrix();
  Renderer3D.setSize(W, H);
  MainConsole.Log(`${W}, ${H}`);
}