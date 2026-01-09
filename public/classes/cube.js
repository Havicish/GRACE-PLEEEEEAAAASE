import * as THREE from "../../../node_modules/three/build/three.module.js";
import * as CANNON from "../../../node_modules/cannon-es/dist/cannon-es.js";
import { AddPhysicsBody } from "../physicsManager.js";
import { MainConsole } from "../consoleManager.js";

export class Cube {
  constructor(Color = 0x00ff00, Size = new THREE.Vector3(1, 1, 1)) {
    this.Geometry = new THREE.BoxGeometry(Size.x, Size.y, Size.z);
    this.Texture = new THREE.TextureLoader().load("../images/brick.png");
    this.Texture.wrapS = THREE.RepeatWrapping;
    this.Texture.wrapT = THREE.RepeatWrapping;
    this.NormalTexture = new THREE.TextureLoader().load("../images/brickNormalMap.png");
    this.NormalTexture.wrapS = THREE.RepeatWrapping;
    this.NormalTexture.wrapT = THREE.RepeatWrapping;

    this.PhysicsBody = this.CreatePhysicsBody(Size);
    this.PhysicsBody.collisionFilterGroup = 2; // Static bodies group
    this.PhysicsBody.collisionFilterMask = 1 | 3;  // Can collide with group 1 (player)
    AddPhysicsBody(this.PhysicsBody);
    
    // Create materials array for each face
    const topBottomMaterial = new THREE.MeshStandardMaterial({
      color: Color,
      roughness: 1,
      metalness: 0,
      map: this.Texture.clone(),
      normalMap: this.NormalTexture.clone()
    });
    topBottomMaterial.map.repeat.set(Size.x, Size.z);
    topBottomMaterial.normalMap.repeat.set(Size.x, Size.z);

    const frontBackMaterial = new THREE.MeshStandardMaterial({
      color: Color,
      roughness: 1,
      metalness: 0,
      map: this.Texture.clone(),
      normalMap: this.NormalTexture.clone()
    });
    frontBackMaterial.map.repeat.set(Size.x, Size.y);
    frontBackMaterial.normalMap.repeat.set(Size.x, Size.y);

    const leftRightMaterial = new THREE.MeshStandardMaterial({
      color: Color,
      roughness: 1,
      metalness: 0,
      map: this.Texture.clone(),
      normalMap: this.NormalTexture.clone()
    });
    leftRightMaterial.map.repeat.set(Size.z, Size.y);
    leftRightMaterial.normalMap.repeat.set(Size.z, Size.y);

    this.Material = [
      leftRightMaterial,  // Right
      leftRightMaterial,  // Left
      topBottomMaterial,  // Top
      topBottomMaterial,  // Bottom
      frontBackMaterial,  // Front
      frontBackMaterial   // Back
    ];
    this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
    this.Mesh.position.set(0, 0, -5);
    this.Mesh.castShadow = true;
    this.Mesh.receiveShadow = true;
    this.ShouldSpin = false;
    this.ThingsToAddTo3DScene = [this.Mesh];
  }

  CreatePhysicsBody(Size) {
    const Body = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
    });

    const Radius = 0.35;
    const BoxShape = new CANNON.Box(new CANNON.Vec3(Size.x / 2, Size.y / 2, Size.z / 2));
    Body.addShape(BoxShape);
    
    return Body;
  }

  Update(DT) {
    if (this.ShouldSpin) {
      this.Mesh.rotation.x += DT * Math.PI / 2;
      this.Mesh.rotation.y += DT * Math.PI / 2;
    }
  }

  SetTransparency(Alpha) {
    for (let Mat of this.Material) {
      Mat.transparent = true;
      Mat.opacity = Alpha;
    }
  }

  SetPosition(Position) {
    MainConsole.Log(Position.x + ", " + Position.y + ", " + Position.z);
    this.Mesh.position.copy(Position);
    this.PhysicsBody.position.set(Position.x, Position.y, Position.z);
  }
}