let audioPlaylist = [];
let uniqueFoldersList = [];
let selectedRootDirectory = "";
let currentTrackIndex = 0;
let isAudioPlaying = false;
let audioPlayerInstance = null;
let albumNameDisplayTimeout = null;
let isDisplayingAlbumTemporarily = false;

function toggleAudioPlaybackState() {
  const isPlaylistEmpty = audioPlaylist.length === 0;
  if (isPlaylistEmpty) return;

  const isAudioNotInitialized = !audioPlayerInstance;
  if (isAudioNotInitialized) {
    loadAudioTrackByIndex(currentTrackIndex);
    return;
  }

  if (isAudioPlaying) {
    audioPlayerInstance.pause();
    isAudioPlaying = false;
    refreshPlayerScreenDisplay();
    return;
  }

  audioPlayerInstance.play().catch((playbackError) => {
    console.error("Playback error:", playbackError);
  });

  isAudioPlaying = true;
  refreshPlayerScreenDisplay();
}

function playNextAudioTrack() {
  const isPlaylistEmpty = audioPlaylist.length === 0;
  if (isPlaylistEmpty) return;
  cancelTemporaryAlbumDisplay();
  currentTrackIndex = (currentTrackIndex + 1) % audioPlaylist.length;
  loadAudioTrackByIndex(currentTrackIndex);
  refreshPlayerScreenDisplay();
}

function playPreviousAudioTrack() {
  const isPlaylistEmpty = audioPlaylist.length === 0;
  if (isPlaylistEmpty) return;

  cancelTemporaryAlbumDisplay();

  const isTrackPlayingPastThreeSeconds = audioPlayerInstance && audioPlayerInstance.currentTime > 3;
  if (isTrackPlayingPastThreeSeconds) {
    audioPlayerInstance.currentTime = 0;
    return;
  }

  currentTrackIndex = (currentTrackIndex - 1 + audioPlaylist.length) % audioPlaylist.length;
  loadAudioTrackByIndex(currentTrackIndex);
  refreshPlayerScreenDisplay();
}

function playNextFolder() {
  const hasOneOrNoFolders = uniqueFoldersList.length <= 1;
  if (hasOneOrNoFolders) return;
  let folderIdx = indexOfCurrentFolder();
  folderIdx = (folderIdx + 1) % uniqueFoldersList.length;
  currentTrackIndex = uniqueFoldersList[folderIdx].startIndex;
  displayAlbumNameTemporarily(uniqueFoldersList[folderIdx].folderPath);
  loadAudioTrackByIndex(currentTrackIndex);
}

function playPreviousFolder() {
  const hasOneOrNoFolders = uniqueFoldersList.length <= 1;
  if (hasOneOrNoFolders) return;
  let folderIdx = indexOfCurrentFolder();
  folderIdx = (folderIdx - 1 + uniqueFoldersList.length) % uniqueFoldersList.length;
  currentTrackIndex = uniqueFoldersList[folderIdx].startIndex;
  displayAlbumNameTemporarily(uniqueFoldersList[folderIdx].folderPath);
  loadAudioTrackByIndex(currentTrackIndex);
}

function loadAudioTrackByIndex(trackIndex) {
  if (audioPlayerInstance) {
    audioPlayerInstance.pause();
    audioPlayerInstance = null;
  }

  const selectedTrackPath = audioPlaylist[trackIndex];
  const isTrackPathInvalid = !selectedTrackPath;
  if (isTrackPathInvalid) return;

  const secureMediaSourceUrl = "media://local-file/" + encodeURIComponent(selectedTrackPath);
  audioPlayerInstance = new Audio(secureMediaSourceUrl);
  audioPlayerInstance.addEventListener("ended", () => playNextAudioTrack());

  isAudioPlaying = true;

  audioPlayerInstance.play().catch((playbackError) => {
    console.error("Playback error:", playbackError);
    isAudioPlaying = false;
    refreshPlayerScreenDisplay();
  });
}

function displayAlbumNameTemporarily(folderPath) {
  if (albumNameDisplayTimeout) {
    clearTimeout(albumNameDisplayTimeout);
  }

  let albumName = "";
  const isSelectedRootFolder = folderPath === selectedRootDirectory;
  if (isSelectedRootFolder) albumName = "ROOT";
  else albumName = removeAccents(getFolderNameFromFolderPath(folderPath));

  const isScreenElementAvailable = !!screenTextElement;
  if (isScreenElementAvailable) screenTextElement.innerText = albumName;

  applyScreenTextScrollEffect();

  isDisplayingAlbumTemporarily = true;

  const playerScreenContainer = document.getElementById("player-screen");
  const isScreenTextScrolling =
    playerScreenContainer && playerScreenContainer.classList.contains("has-horizontal-scroll");
  const displayDuration = isScreenTextScrolling ? 10000 : 2500;

  albumNameDisplayTimeout = setTimeout(() => {
    isDisplayingAlbumTemporarily = false;
    refreshPlayerScreenDisplay();
  }, displayDuration);
}

function cancelTemporaryAlbumDisplay() {
  const isTimeoutActive = !!albumNameDisplayTimeout;
  if (isTimeoutActive) {
    clearTimeout(albumNameDisplayTimeout);
    albumNameDisplayTimeout = null;
  }

  isDisplayingAlbumTemporarily = false;

  const playerScreenContainer = document.getElementById("player-screen");
  if (playerScreenContainer) {
    playerScreenContainer.classList.remove("has-horizontal-scroll");
  }
}

function buildUniqueFoldersMap() {
  uniqueFoldersList = [];
  let previouslyProcessedFolder = null;

  for (let trackIdx = 0; trackIdx < audioPlaylist.length; trackIdx++) {
    const currentFileDirectory = getDirectoryPathFromFilePath(audioPlaylist[trackIdx]);
    const isDifferentFolder = currentFileDirectory !== previouslyProcessedFolder;

    if (isDifferentFolder) {
      uniqueFoldersList.push({ folderPath: currentFileDirectory, startIndex: trackIdx });
      previouslyProcessedFolder = currentFileDirectory;
    }
  }
}

function indexOfCurrentFolder() {
  let currentFolderIdx = 0;
  for (let folderIdx = 0; folderIdx < uniqueFoldersList.length; folderIdx++) {
    const isFolderStartIndexReached = uniqueFoldersList[folderIdx].startIndex <= currentTrackIndex;
    if (isFolderStartIndexReached) {
      currentFolderIdx = folderIdx;
      continue;
    }
    break;
  }
  return currentFolderIdx;
}
