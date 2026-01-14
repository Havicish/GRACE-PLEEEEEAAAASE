import { Cube } from "../classes/cube.js";
import { AddObject } from "../sceneManager.js"
import { AddMeshToPhysics } from "../physicsManager.js";
import * as THREE from "../../../node_modules/three/build/three.module.js";

export class RoomHall {
  constructor(Scene) {
    this.Floor = new Cube(0x888888, new THREE.Vector3(4, 0.1, 8));
    this.Floor.SetPosition(new THREE.Vector3(0, -1, 0));

    this.Start = new THREE.Vector3(0, 0, 4);
    this.End = new THREE.Vector3(0, 0, -4);

    this.Position = new THREE.Vector3(0, 0, 0);

    this.Walls = [];
    let Wall0 = new Cube(0xaaaaaa, new THREE.Vector3(0.1, 20, 7.89));
    Wall0.SetPosition(new THREE.Vector3(-2, 9, 0));
    this.Walls.push(Wall0);

    let Wall1 = new Cube(0xaaaaaa, new THREE.Vector3(0.1, 20, 7.89));
    Wall1.SetPosition(new THREE.Vector3(2, 9, 0));
    this.Walls.push(Wall1);

    let Wall20 = new Cube(0xaaaaaa, new THREE.Vector3(1.4, 20, 0.1));
    Wall20.SetPosition(new THREE.Vector3(-1.3, 9, -4));
    this.Walls.push(Wall20);
    let Wall21 = new Cube(0xaaaaaa, new THREE.Vector3(1.4, 20, 0.1));
    Wall21.SetPosition(new THREE.Vector3(1.3, 9, -4));
    this.Walls.push(Wall21);
    let Wall22 = new Cube(0xaaaaaa, new THREE.Vector3(4 - 1.4*2, 18.5, 0.1));
    Wall22.SetPosition(new THREE.Vector3(0, 10.5, -4));
    this.Walls.push(Wall22);

    // let Wall30 = new Cube(0xaaaaaa, new THREE.Vector3(1.4, 20, 0.1));
    // Wall30.SetPosition(new THREE.Vector3(-1.3, 9, 4));
    // this.Walls.push(Wall30);
    // let Wall31 = new Cube(0xaaaaaa, new THREE.Vector3(1.4, 20, 0.1));
    // Wall31.SetPosition(new THREE.Vector3(1.3, 9, 4));
    // this.Walls.push(Wall31);
    // let Wall32 = new Cube(0xaaaaaa, new THREE.Vector3(4 - 1.4*2, 18.5, 0.1));
    // Wall32.SetPosition(new THREE.Vector3(0, 10.5, 4));
    // this.Walls.push(Wall32);

    for (let i in this.Walls) {
      AddObject(Scene, this.Walls[i]);
    }

    AddObject(Scene, this.Floor);
  }

  SetPosition(Position) {
    let Offset = new THREE.Vector3().subVectors(Position, this.Position);

    for (let Wall of this.Walls) {
      Wall.SetPosition(new THREE.Vector3().addVectors(Wall.GetPosition(), Offset));
    }

    this.Floor.SetPosition(new THREE.Vector3().addVectors(this.Floor.GetPosition(), Offset));

    this.Position = Position;
  }
}