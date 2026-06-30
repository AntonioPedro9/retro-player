const { BrowserWindow } = require("electron");
const path = require("node:path");

let mainWindowInstance = null;

const createMainWindowInstance = () => {
  mainWindowInstance = new BrowserWindow({
    width: 711,
    height: 219,
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
    },
  });

  mainWindowInstance.loadFile(path.join(__dirname, "../renderer/index.html"));
};

const getMainWindowInstance = () => mainWindowInstance;

module.exports = {
  createMainWindowInstance,
  getMainWindowInstance,
};
