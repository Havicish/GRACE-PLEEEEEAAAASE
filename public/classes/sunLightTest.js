import * as THREE from "../../../node_modules/three/build/three.module.js";

export class SunLight {
  constructor(Color, Intensity) {
    this.Light = new THREE.DirectionalLight(Color, Intensity);
    this.Light.position.set(5, 8, 5);

    let Cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    Cube.position.set(0, 0, 0);
    this.Light.add(Cube);
    this.Light.target.position.set(0, 0, 0);
    this.Light.castShadow = true;
    
    // Increase resolution significantly
    this.Light.shadow.mapSize.width = 4096;
    this.Light.shadow.mapSize.height = 4096;
    
    // Optimize shadow camera bounds
    this.Light.shadow.camera.near = 0.1;
    this.Light.shadow.camera.far = 50;
    this.Light.shadow.camera.left = -20;
    this.Light.shadow.camera.right = 20;
    this.Light.shadow.camera.top = 20;
    this.Light.shadow.camera.bottom = -20;
    
    // Blur shadow edges
    this.Light.shadow.radius = 24;
    
    // Enable shadow map filtering for softer shadows
    this.Light.shadow.bias = -0.0001;
  }

  Update(DT) {

  }

  Render() {
    
  }
}