import * as THREE from "../../../node_modules/three/build/three.module.js";
import { RoomHall } from './hall.js';
import { GameState } from '../main.js';
import { AddOnSceneChangeListener } from '../sceneManager.js';
import { MainConsole } from '../consoleManager.js';

let GeneratableRooms = [RoomHall];
let Rooms = [];

export function GenerateNextRoom() {
  let RoomClass = GeneratableRooms[Math.floor(Math.random() * GeneratableRooms.length)];
  let Room = new RoomClass(GameState.CurrentScene);

  if (Rooms.length === 0) {
    Room.SetPosition(new THREE.Vector3(0, 0, 0));
  } else {
    let PreviousRoom = Rooms[Rooms.length - 1];
    Room.SetPosition(PreviousRoom.End.clone().add(PreviousRoom.Position).add(new THREE.Vector3(0, 0, 0)).sub(Room.Start));
  }

  Rooms.push(Room);
}

AddOnSceneChangeListener("Game", () => {
  setTimeout(() => {
    for (let i = 0; i < 40; i++) {
      GenerateNextRoom();
      MainConsole.Log(`Generated room ${i + 1}`);
      MainConsole.Log(`Total cubes: ${6 * (i + 1)}`);
    }
  }, 1000);
});