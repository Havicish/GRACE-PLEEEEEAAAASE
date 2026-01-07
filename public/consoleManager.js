class Console {
  constructor() {
    this.Visible = false;
    this.ToggleKey = "`";
    this.PauseKey = "p";
    this.LastToggleKeyDown = false;
    this.LastPauseKeyDown = false;
    this.TotalMessages = 0;
    this.MaxMessages = 200;
    this.IsPaused = false;
    this.keysDown = new Set();

    // Track key states
    window.addEventListener("keydown", (e) => {
      this.keysDown.add(e.key);
    });

    window.addEventListener("keyup", (e) => {
      this.keysDown.delete(e.key);
    });

    this.Log("Console initialized.");
  }

  IsKeyDown(key) {
    return this.keysDown.has(key);
  }

  Update() {
    let IsToggleKeyDown = this.IsKeyDown(this.ToggleKey);

    if (IsToggleKeyDown && !this.LastToggleKeyDown) {
      this.Visible = !this.Visible;

      if (this.Visible)
        document.getElementById("Console").style.display = "block";
      else
        document.getElementById("Console").style.display = "none";
    }

    this.LastToggleKeyDown = IsToggleKeyDown;

    if (this.PauseKey != null) {
      if (this.IsKeyDown(this.PauseKey) && !this.LastPauseKeyDown) {
        this.IsPaused = !this.IsPaused;
      }

      this.LastPauseKeyDown = this.IsKeyDown(this.PauseKey);
    }
  }

  Log(Msg) {
    if (this.IsPaused) return;

    let ConsoleEle = document.getElementById("Console");
    const line = document.createElement('div');
    line.style.color = "#fff";
    line.textContent = Msg;
    ConsoleEle.appendChild(line);
    ConsoleEle.scrollTop = ConsoleEle.scrollHeight;
    
    this.TotalMessages += 1;
    if (this.TotalMessages > this.MaxMessages) {
      ConsoleEle.removeChild(ConsoleEle.firstChild);
      this.TotalMessages = this.MaxMessages;
    }
  }

  Warn(Msg) {
    if (this.IsPaused) return;

    let ConsoleEle = document.getElementById("Console");
    const line = document.createElement('div');
    line.style.color = "#ff0";
    line.textContent = Msg;
    ConsoleEle.appendChild(line);
    ConsoleEle.scrollTop = ConsoleEle.scrollHeight;
    
    this.TotalMessages += 1;
    if (this.TotalMessages > this.MaxMessages) {
      ConsoleEle.removeChild(ConsoleEle.firstChild);
      this.TotalMessages = this.MaxMessages;
    }
  }

  Error(Msg) {
    if (this.IsPaused) return;

    let ConsoleEle = document.getElementById("Console");
    const line = document.createElement('div');
    line.style.color = "#f00";
    line.textContent = Msg;
    ConsoleEle.appendChild(line);
    ConsoleEle.scrollTop = ConsoleEle.scrollHeight;
    
    this.TotalMessages += 1;
    if (this.TotalMessages > this.MaxMessages) {
      ConsoleEle.removeChild(ConsoleEle.firstChild);
      this.TotalMessages = this.MaxMessages;
    }
  }
}

export let MainConsole = new Console();

window.addEventListener("error", (event) => {
  if (event.error && event.error.stack) {
    MainConsole.Error(event.error.stack);
  } else {
    MainConsole.Error(event.message + " at " + event.filename + ":" + event.lineno + ":" + event.colno);
  }
});

window.addEventListener("unhandledrejection", (event) => {
  if (event.reason && event.reason.stack) {
    MainConsole.Error("Unhandled Promise Rejection:\n" + event.reason.stack);
  } else {
    MainConsole.Error("Unhandled Promise Rejection: " + event.reason);
  }
});

setInterval(() => {
  MainConsole.Update();
}, 1000/60);