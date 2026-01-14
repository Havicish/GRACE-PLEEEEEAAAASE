import * as THREE from "../../../node_modules/three/build/three.module.js";
import * as CANNON from "../../../node_modules/cannon-es/dist/cannon-es.js";
import { AddPhysicsBody, RemovePhysicsBody } from "../physicsManager.js";
import { MainConsole } from "../consoleManager.js";
import { PlayerController } from "../scenes/gameScene.js";

let GlobalTexture = new THREE.TextureLoader().load("../images/brick.png");
GlobalTexture.wrapS = THREE.RepeatWrapping;
GlobalTexture.wrapT = THREE.RepeatWrapping;
let GlobalNormalTexture = new THREE.TextureLoader().load("../images/brickNormalMap.png");
GlobalNormalTexture.wrapS = THREE.RepeatWrapping;
GlobalNormalTexture.wrapT = THREE.RepeatWrapping;

// Create material templates once
const CreateMaterial = (color, repeatX, repeatY) => {
  let mat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 1,
    metalness: 0,
    map: GlobalTexture.clone(),
    normalMap: GlobalNormalTexture.clone()
  });
  mat.map.repeat.set(repeatX, repeatY);
  mat.normalMap.repeat.set(repeatX, repeatY);
  return mat;
};

export class Cube {
  constructor(Color = 0x00ff00, Size = new THREE.Vector3(1, 1, 1)) {
    this.Plr = PlayerController;
    this.Geometry = new THREE.BoxGeometry(Size.x, Size.y, Size.z);
    this.Size = Size;

    this.PhysicsBody = this.CreatePhysicsBody(Size);
    this.PhysicsBody.collisionFilterGroup = 2;
    this.PhysicsBody.collisionFilterMask = 1 | 3;
    AddPhysicsBody(this.PhysicsBody);
    
    // Create materials
    const topBottomMaterial = CreateMaterial(Color, Size.x, Size.z);
    const frontBackMaterial = CreateMaterial(Color, Size.x, Size.y);
    const leftRightMaterial = CreateMaterial(Color, Size.z, Size.y);
    this.topBottomMaterial = topBottomMaterial;
    this.frontBackMaterial = frontBackMaterial;
    this.leftRightMaterial = leftRightMaterial;

    this.Material = [
      leftRightMaterial,
      leftRightMaterial,
      topBottomMaterial,
      topBottomMaterial,
      frontBackMaterial,
      frontBackMaterial
    ];
    this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
    this.Mesh.position.set(0, 0, -5);
    //this.Mesh.castShadow = true;
    this.Mesh.receiveShadow = true;
    this.ShouldSpin = false;
    this.ThingsToAddTo3DScene = [this.Mesh];
    this.TimeUntilNextUpdate = 0;
    this.IsVisible = true;
    this.PhysicsEnabled = true;
  }

  CreatePhysicsBody(Size) {
    const Body = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
    });

    const BoxShape = new CANNON.Box(new CANNON.Vec3(Size.x / 2, Size.y / 2, Size.z / 2));
    Body.addShape(BoxShape);
    
    return Body;
  }

  Update(DT) {
    if (this.TimeUntilNextUpdate > 0) {
      this.TimeUntilNextUpdate -= DT;
      return;
    }

    this.TimeUntilNextUpdate = Math.random() * 0.25 + 0.25;
    let PlrPos = this.Plr.PhysicsBody.position;
    let Dist = this.Mesh.position.distanceTo(new THREE.Vector3(PlrPos.x, PlrPos.y, PlrPos.z));
    this.TimeUntilNextUpdate *= Math.min(Math.max(Dist / 25, 0.25), 3);

    let ShouldBeVisible = Dist <= 4000 + Math.max(this.Size.x, this.Size.y, this.Size.z);
    this.Mesh.castShadow = Dist <= 15;
    this.Mesh.receiveShadow = Dist <= 15;
    //ShouldBeVisible = true;
    // let ShouldNormalsBeVisible = Dist <= 15;
    // if (this.topBottomMaterial) {
    //   this.topBottomMaterial.normalMap = ShouldNormalsBeVisible ? GlobalNormalTexture : null;
    //   if (ShouldNormalsBeVisible) this.topBottomMaterial.normalMap.repeat.set(this.Size.x, this.Size.z);
    //   this.frontBackMaterial.normalMap = ShouldNormalsBeVisible ? GlobalNormalTexture : null;
    //   if (ShouldNormalsBeVisible) this.frontBackMaterial.normalMap.repeat.set(this.Size.x, this.Size.y);
    //   this.leftRightMaterial.normalMap = ShouldNormalsBeVisible ? GlobalNormalTexture : null;
    //   if (ShouldNormalsBeVisible) this.leftRightMaterial.normalMap.repeat.set(this.Size.z, this.Size.y);
    // }
    let ShouldMatsBeVisible = Dist <= 50;
    if (this.topBottomMaterial && ShouldMatsBeVisible) {
      this.topBottomMaterial.map = GlobalTexture;
      this.frontBackMaterial.map = GlobalTexture;
      this.leftRightMaterial.map = GlobalTexture;
    } else if (this.topBottomMaterial) {
      this.topBottomMaterial.map = null;
      this.frontBackMaterial.map = null;
      this.leftRightMaterial.map = null;
    }
    
    if (ShouldBeVisible !== this.IsVisible) {
      this.IsVisible = ShouldBeVisible;
      this.Mesh.visible = ShouldBeVisible;
      
      // Disable physics for invisible cubes
      if (!ShouldBeVisible && this.PhysicsEnabled) {
        this.PhysicsBody.collisionResponse = false;
        this.PhysicsEnabled = false;
      } else if (ShouldBeVisible && !this.PhysicsEnabled) {
        this.PhysicsBody.collisionResponse = true;
        this.PhysicsEnabled = true;
      }
    }
  }

  SetTransparency(Alpha) {
    for (let Mat of this.Material) {
      Mat.transparent = true;
      Mat.opacity = Alpha;
    }
  }

  SetPosition(Position) {
    this.Mesh.position.copy(Position);
    this.PhysicsBody.position.set(Position.x, Position.y, Position.z);
  }

  GetPosition() {
    return this.Mesh.position.clone();
  }
}