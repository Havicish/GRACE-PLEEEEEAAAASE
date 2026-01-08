import { AddObject, RemoveObject, SetScene, CreateNewScene, ClearScene, Scenes, AddOnSceneChangeListener } from "../sceneManager.js";
import { CubeTest } from "../classes/cubeTest.js";
import { SunLight } from "../classes/sunLightTest.js";
import { AddUpdater } from "../updaters.js";
import { MainConsole } from "../consoleManager.js";

AddOnSceneChangeListener("Game", () => {
  ClearScene("Game");

  let Cube = new CubeTest();
  AddObject("Game", Cube);
  AddObject("Game", new SunLight(Cube));
});

AddUpdater((DT) => {
  document.getElementById("FPSDisplay").innerText = `FPS: ${Math.round(1 / DT)}`;
});