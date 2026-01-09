import * as THREE from "../../../node_modules/three/build/three.module.js";
import { Canvas } from "../canvasManager.js";
import { MainConsole } from "../consoleManager.js";
import { Mouse } from "../userInputManager.js";
import { IsKeyDown } from "../userInputManager.js";

export class FreeCamera {
  constructor(Camera, Speed = 5) {
    this.Position = new THREE.Vector3(0, 0, 0);
    this.Speed = Speed;
    this.Camera = Camera;
    this.Rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    this.Enabled = true;
    this.Light = new THREE.PointLight(0xffffff, 0.5);
    this.Light.position.set(0, 2, 0);
    this.Camera.add(this.Light);
    this.Time = 0;
    this.PerlinNoise = this.createPerlinNoise();
    this.Light.distance = 75;
    this.Light.castShadow = true;
    this.Light.color = new THREE.Color(0xffeeaa);

    document.addEventListener("mousedown", (Event) => {
      if (!this.Enabled) return;
      Canvas.requestPointerLock();
    });
  }

  Update(DT) {
    this.Time += DT;
    this.Light.intensity = this.PerlinNoise(this.Time * 5) * 0.75 + 1;

    let Direction = new THREE.Vector3(0, 0, 0);

    if (IsKeyDown("W")) {
      Direction.z -= 1;
    }
    if (IsKeyDown("S")) {
      Direction.z += 1;
    }
    if (IsKeyDown("A")) {
      Direction.x -= 1;
    }
    if (IsKeyDown("D")) {
      Direction.x += 1;
    }
    if (IsKeyDown("E")) {
      Direction.y += 1;
    }
    if (IsKeyDown("Q")) {
      Direction.y -= 1;
    }

    if (Direction.length() > 0) {
      Direction.normalize();
      const quat = new THREE.Quaternion();
      quat.setFromEuler(this.Rotation);
      Direction.applyQuaternion(quat);
      Direction.multiplyScalar(this.Speed * DT);
    }

    if (Direction.length() > 0)
      this.Position.add(Direction);
    this.Light.position.copy(this.Position.add(new THREE.Vector3(0, 1, 0)));
    this.Position.sub(new THREE.Vector3(0, 1, 0));
    this.Camera.position.copy(this.Position);

    let MouseSensitivity = 0.002;
    this.Rotation.y -= Mouse.DeltaX * MouseSensitivity;
    this.Rotation.x -= Mouse.DeltaY * MouseSensitivity;
    this.Rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.Rotation.x));

    this.Camera.rotation.copy(this.Rotation);
  }

  createPerlinNoise() {
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = Math.floor(Math.random() * 256);
    }
    for (let i = 0; i < 256; i++) {
      p[256 + i] = p[i];
    }

    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t, a, b) => a + t * (b - a);
    const grad = (hash, x) => {
      const h = hash & 15;
      const u = h < 8 ? x : -x;
      return u;
    };

    return (x) => {
      x = x % 256;
      if (x < 0) x += 256;
      
      const xi = Math.floor(x) & 255;
      const xf = x - Math.floor(x);
      
      const u = fade(xf);
      
      const aa = p[p[xi]];
      const ab = p[p[xi + 1]];
      
      const g1 = grad(aa, xf);
      const g2 = grad(ab, xf - 1);
      
      const x1 = lerp(u, g1, g2);
      
      return Math.max(0, Math.min(1, (x1 + 1) / 2));
    };
  }
}