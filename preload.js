const { contextBridge } = require("electron");

// We securely expose some version info functions to the renderer process
// using the contextBridge.
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});
