export let Mouse = {X: 0, Y: 0, DeltaX: 0, DeltaY: 0, LastX: 0, LastY: 0, Buttons: [], ScrollX: 0, ScrollY: 0};

document.addEventListener("mousemove", (Event) => {
  // Use movementX/Y for locked pointer, fallback to position delta
  if (document.pointerLockElement) {
    Mouse.DeltaX = Event.movementX;
    Mouse.DeltaY = Event.movementY;
  } else {
    Mouse.DeltaX = Event.clientX - Mouse.X;
    Mouse.DeltaY = Event.clientY - Mouse.Y;
  }
  Mouse.X = Event.clientX;
  Mouse.Y = Event.clientY;
});

document.addEventListener("mousedown", (Event) => {
  Mouse.Buttons[Event.button] = true;
});

document.addEventListener("mouseup", (Event) => {
  Mouse.Buttons[Event.button] = false;
});

document.addEventListener("wheel", (Event) => {
  Mouse.ScrollX = Event.deltaX;
  Mouse.ScrollY = Event.deltaY;
  //Event.preventDefault();
}, { passive: false });

document.addEventListener("contextmenu", (Event) => {
  Event.preventDefault();
});

let Keys = [];

document.addEventListener("keydown", (Event) => {
  if (Keys.indexOf(Event.key.toLowerCase()) == -1) {
    Keys.push(Event.key.toLowerCase());
  }
});

document.addEventListener("keyup", (Event) => {
  Keys = Keys.filter(key => key != Event.key.toLowerCase());
});

export function IsKeyDown(Key) {
  return Keys.indexOf(Key.toLowerCase()) > -1;
}