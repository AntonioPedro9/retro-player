const srcButton = document.getElementById("src");
const playPauseButton = document.getElementById("play-pause");
const nextTrackButton = document.getElementById("track-next");
const prevTrackButton = document.getElementById("track-prev");
const folderUpButton = document.getElementById("folder-up");
const folderDownButton = document.getElementById("folder-down");

let oneOrMoreButtonsMissing =
  !srcButton || !playPauseButton || !nextTrackButton || !prevTrackButton || !folderUpButton || !folderDownButton;
if (oneOrMoreButtonsMissing) {
  console.error("One or more button elements not found in the DOM");
}

srcButton.addEventListener("click", async () => {
  const isApiMissing = !window.api || !window.api.selectDirectory;
  if (isApiMissing) {
    console.error("Preload API is not available");
    return;
  }

  const result = await window.api.selectDirectory();
  const isResultValid = result && result.files && result.files.length > 0;

  if (!isResultValid) {
    audioPlaylist = [];
    uniqueFoldersList = [];
    selectedRootDirectory = "";
    currentTrackIndex = 0;
    isAudioPlaying = false;
    cancelTemporaryAlbumDisplay();

    if (audioPlayerInstance) {
      audioPlayerInstance.pause();
      audioPlayerInstance = null;
    }

    return;
  }

  audioPlaylist = result.files;
  selectedRootDirectory = result.rootDirectory;
  buildUniqueFoldersMap();
  currentTrackIndex = 0;
  isAudioPlaying = false;
  loadAudioTrackByIndex(currentTrackIndex);
  refreshPlayerScreenDisplay();
});

playPauseButton.addEventListener("click", () => toggleAudioPlaybackState());
nextTrackButton.addEventListener("click", () => playNextAudioTrack());
prevTrackButton.addEventListener("click", () => playPreviousAudioTrack());
folderUpButton.addEventListener("click", () => playPreviousFolder());
folderDownButton.addEventListener("click", () => playNextFolder());

applyScreenTextScrollEffect();
