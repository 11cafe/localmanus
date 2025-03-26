const { app, BrowserWindow } = require("electron");
const path = require("path");

const port =
  process.argv.find((arg) => arg.startsWith("--port="))?.split("=")[1] ||
  "8000";

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
    },
  });

  win.loadURL(`http://localhost:${port}`); // Use dynamic port
}

app.whenReady().then(createWindow);
