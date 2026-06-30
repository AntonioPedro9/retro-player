const { app, BrowserWindow } = require("electron");
const { registerMediaProtocol, handleMediaProtocol } = require("./protocol");
const { initIpcHandlers } = require("./ipc");
const { createMainWindowInstance } = require("./window");

// Enable live reload in development
try {
  require("electron-reloader")(module);
} catch (_) {}

registerMediaProtocol();

app.whenReady().then(() => {
  handleMediaProtocol();
  initIpcHandlers();
  createMainWindowInstance();

  app.on("activate", () => {
    const hasNoActiveWindows = BrowserWindow.getAllWindows().length === 0;
    if (hasNoActiveWindows) createMainWindowInstance();
  });
});

app.on("window-all-closed", () => {
  const isNotMacOS = process.platform !== "darwin";
  if (isNotMacOS) app.quit();
});
