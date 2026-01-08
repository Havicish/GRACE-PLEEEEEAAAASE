import * as THREE from "../../../node_modules/three/build/three.module.js";

export class CubeTest {
  constructor() {
    this.Geometry = new THREE.BoxGeometry(1, 1, 1);
    this.Material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      roughness: 0.4,
      metalness: 0.1
    });
    this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
    this.Mesh.position.set(0, 0, -5);
  }

  Update(DT) {
    this.Mesh.rotation.x += DT * Math.PI / 2;
    this.Mesh.rotation.y += DT * Math.PI / 2;
  }

  Render() {
    
  }
}