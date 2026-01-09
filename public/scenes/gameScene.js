import { AddObject, ClearScene, AddOnSceneChangeListener } from "../sceneManager.js";
import { Cube } from "../classes/cube.js";
import { AddUpdater } from "../updaters.js";
import { Player } from "../classes/player.js";
import { AddMeshToPhysics } from "../physicsManager.js";
import * as THREE from "../../../node_modules/three/build/three.module.js";
import { RoomHall } from "../rooms/hall.js";
import { Camera3D } from "../render.js";

AddOnSceneChangeListener("Game", () => {
  ClearScene("Game");

  Camera3D.fov = 100;
  Camera3D.updateProjectionMatrix();

  // Create player (camera is attached to player)
  let PlayerController = new Player(new THREE.Vector3(0, 2, 0));
  AddObject("Game", PlayerController);

  new RoomHall("Game");

  // Create floor
  // let Floor = new Cube(0x808080, new THREE.Vector3(10, 0.1, 10));
  // Floor.Mesh.position.set(0, -1, 0);
  // AddObject("Game", Floor);
  // AddMeshToPhysics(Floor.Mesh);

  // Create decorative cube
  // let CubeObj = new Cube(0xffffff, new THREE.Vector3(1, 1, 1));
  // //CubeObj.ShouldSpin = true;
  // CubeObj.Mesh.position.set(0, 0, 0);
  // AddObject("Game", CubeObj);
  // AddMeshToPhysics(CubeObj.Mesh);
});

AddUpdater((DT) => {
  document.getElementById("FPSDisplay").innerText = `FPS: ${Math.round(1 / DT)}`;
});