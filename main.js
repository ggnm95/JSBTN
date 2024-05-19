const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = import("electron-is-dev");
const waitOn = require("wait-on");

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  waitOn({ resources: [startURL], timeout: 30000 }, (err) => {
    if (err) {
      console.error("Failed to load the URL:", err);
    } else {
      mainWindow.loadURL(startURL);
      if (isDev) {
        mainWindow.webContents.openDevTools();
      }
    }
  });
}

app.whenReady().then(() => createWindow());

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
