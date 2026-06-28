const { ipcMain, dialog, BrowserWindow } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");

async function scanAudioFilesRecursively(directoryPath) {
  let discoveredAudioFiles = [];

  try {
    const directoryEntries = await fs.readdir(directoryPath, { withFileTypes: true });
    for (const entry of directoryEntries) {
      const entryFullPath = path.join(directoryPath, entry.name);
      const isDirectoryEntry = entry.isDirectory();

      if (isDirectoryEntry) {
        const subResults = await scanAudioFilesRecursively(entryFullPath);
        discoveredAudioFiles = discoveredAudioFiles.concat(subResults);
        continue;
      }

      const fileExtension = path.extname(entry.name).toLowerCase();
      const isAudioFileExtension = [".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac"].includes(fileExtension);

      if (isAudioFileExtension) {
        discoveredAudioFiles.push(entryFullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading ${directoryPath}:`, error);
  }

  return discoveredAudioFiles;
}

function initIpcHandlers() {
  ipcMain.handle("dialog:select-directory", async () => {
    const activeWindowHandle = BrowserWindow.getFocusedWindow();
    const { canceled, filePaths } = await dialog.showOpenDialog(activeWindowHandle, {
      properties: ["openDirectory"],
    });

    const isSelectionCanceledOrEmpty = canceled || filePaths.length === 0;
    if (isSelectionCanceledOrEmpty) {
      return null;
    }

    const selectedDirectoryPath = filePaths[0];
    const scannedAudioFilesList = await scanAudioFilesRecursively(selectedDirectoryPath);
    return {
      rootDirectory: selectedDirectoryPath,
      files: scannedAudioFilesList,
    };
  });
}

module.exports = {
  initIpcHandlers,
};
