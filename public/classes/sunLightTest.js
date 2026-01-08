import * as THREE from "../../../node_modules/three/build/three.module.js";

export class SunLight {
  constructor(Cube) {
    this.Light = new THREE.DirectionalLight(0xffffff, 0.75);
    this.Light.position.set(1, 1, 1);
    this.Light.target = Cube;
  }

  Update(DT) {

  }

  Render() {
    
  }
}