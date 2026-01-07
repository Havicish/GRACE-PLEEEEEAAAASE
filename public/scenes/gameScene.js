import { AddObject, RemoveObject, SetScene, CreateNewScene, ClearScene, Scenes, AddOnSceneChangeListener } from "../sceneManager.js";
import { CubeTest } from "../classes/cubeTest.js";
import { AddUpdater } from "../updaters.js";
import { MainConsole } from "../consoleManager.js";

AddOnSceneChangeListener("Game", () => {
  ClearScene("Game");

  AddObject("Game", new CubeTest());
});

AddUpdater((DT) => {
  document.getElementById("FPSDisplay").innerText = `FPS: ${Math.round(1 / DT)}`;
});