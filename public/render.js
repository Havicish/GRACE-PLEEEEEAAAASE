import * as THREE from "../node_modules/three/build/three.module.js";

import { Canvas, Ctx } from './canvasManager.js';

const Scene = new THREE.Scene();
export let  Camera3D = new THREE.PerspectiveCamera(75, Canvas.width / Canvas.height, 0.1, 1000);
const Renderer3D = new THREE.WebGLRenderer({ canvas: Canvas, alpha: true });
Renderer3D.setSize(Canvas.width, Canvas.height);

export function RenderAll(Objects) {
  Ctx.clearRect(0, 0, Canvas.width, Canvas.height);

  for (let Obj of Objects) {
    Scene.add(Obj.Mesh);
  }

  Renderer3D.render(Scene, Camera3D);

  for (let Obj of Objects) {
    Scene.remove(Obj.Mesh);
  }
}