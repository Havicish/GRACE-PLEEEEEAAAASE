import { GameState } from "./main.js";
import { HideCanvas, ShowCanvas } from "./canvasManager.js";
import { Scene } from "./render.js";

export let Scenes = {
  "Game": { Objects: [], Type: "Canvas" } // Type can be Html or Canvas
};

export let OnSceneChangeListeners = {};

function Get(Selector) {
  return document.querySelector(Selector);
}

/** @param {string} Scene - The name of the scene. */
export function AddObject(Scene2, Object) {
  if (Scenes[Scene2] == undefined) {
    console.error(`Scene: \"${Scene2}\" does not exsist.`);
    return;
  }
  Scenes[Scene2].Objects.push(Object);
  Object.Scene = Scene2;
  if (Object.Mesh)
    Scene.add(Object.Mesh);
  if (Object.Light)
    Scene.add(Object.Light);
}

/** @param {string} Scene - The name of the scene. */
export function RemoveObject(Scene2, Object) {
  if (Scenes[Scene2] == undefined) {
    console.error(`Scene: \"${Scene2}\" does not exsist.`);
    return;
  }
  Scenes[Scene2].Objects = Scenes[Scene2].Objects.filter(obj => obj !== Object);
  Object.Scene = null;
  if (Object.Mesh)
    Scene.remove(Object.Mesh);
  if (Object.Light)
    Scene.remove(Object.Light);
}

/** @param {string} Scene - The name of the scene. */
export function SetScene(Scene) {
  if (Scenes[Scene] == undefined) {
    console.error(`Scene: \"${Scene}\" does not exsist.`);
    return;
  }
  let LastScene = GameState.CurrentScene;
  if (GameState.CurrentScene === Scene) return;
  GameState.CurrentScene = Scene;
  for (let Listener of OnSceneChangeListeners[Scene] || []) {
    Listener.Callback();
  }
  for (let Listener of OnSceneChangeListeners[""] || []) {
    Listener.Callback();
  }
  if (Scenes[Scene].Type === "Html") {
    HideCanvas();
    let HtmlElement = Get(`#HtmlScene${Scene}`);
    if (HtmlElement) {
      HtmlElement.style.display = "block";
    }
    Get("body").style.overflow = "auto";
  } else {
    ShowCanvas();
    let LastHtmlElement = Get(`#HtmlScene${LastScene}`);
    if (LastHtmlElement) {
      LastHtmlElement.style.display = "none";
    }
    Get("body").style.overflow = "hidden";
  }
}

/** @param {String} Scene */
export function ResetScene(Scene) {
  if (Scenes[Scene] == undefined) {
    console.error(`Scene: \"${Scene}\" does not exsist.`);
    return;
  }
  for (let Listener of OnSceneChangeListeners[Scene] || []) {
    Listener.Callback();
  }
}

/** @param {string} Scene - The name of the scene. */
export function CreateNewScene(Scene) {
  if (Scenes[Scene] == null) {
    Scenes[Scene] = { Objects: [], Type: "Canvas" };
  }
}

/** @param {string} Scene - The name of the scene. */
export function ClearScene(Scene) {
  if (Scenes[Scene] == undefined) {
    console.error(`Scene: \"${Scene}\" does not exsist.`);
    return;
  }
  for (let Object of Scenes[Scene].Objects) {
    if (Object.OnClear) {
      Object.OnClear();
    }
  }
  Scenes[Scene].Objects = [];
}

/** @param {string} Scene - The name of the scene. */
export function AddOnSceneChangeListener(Scene, Callback) {
  if (OnSceneChangeListeners[Scene] == null) {
    OnSceneChangeListeners[Scene] = [];
  }
  OnSceneChangeListeners[Scene].push({ Scene, Callback });
  return OnSceneChangeListeners[Scene][OnSceneChangeListeners[Scene].length - 1];
}

/** @param {string} Scene - The name of the scene. */
export function RemoveOnSceneChangeListener(Scene, Listener) {
  OnSceneChangeListeners[Scene] = OnSceneChangeListeners[Scene].filter(l => l !== Listener);
}

/** @param {string} Scene - The name of the scene. */
export function GetAllObjectsInScene(Scene) {
  if (Scenes[Scene] == undefined) {
    console.error(`Scene: \"${Scene}\" does not exsist.`);
    return;
  }
  return Scenes[Scene].Objects;
}