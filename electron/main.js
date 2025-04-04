const { app, BrowserWindow, ipcMain, shell } = require("electron");
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

ipcMain.on("show-in-folder", (event, filePath) => {
  shell.showItemInFolder(filePath);
});

app.whenReady().then(createWindow);
