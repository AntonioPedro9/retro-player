const screenTextElement = document.getElementById("screen-text");

function refreshPlayerScreenDisplay() {
  const isScreenElementMissing = !screenTextElement;
  if (isScreenElementMissing) return;
  if (isDisplayingAlbumTemporarily) return;

  const isPlaylistEmpty = audioPlaylist.length === 0;
  if (isPlaylistEmpty) {
    screenTextElement.innerText = "NENHUMA FAIXA SELECIONADA";
    applyScreenTextScrollEffect();
    return;
  }

  const currentTrack = audioPlaylist[currentTrackIndex];
  const name = removeAccents(getFileNameWithoutExtension(currentTrack));
  screenTextElement.innerText = name;
  applyScreenTextScrollEffect();
}

function applyScreenTextScrollEffect() {
  const playerScreenContainer = document.getElementById("player-screen");
  const isElementsMissing = !playerScreenContainer || !screenTextElement;
  if (isElementsMissing) return;
  playerScreenContainer.classList.remove("has-horizontal-scroll");
  const isTextOverflowing = screenTextElement.scrollWidth > playerScreenContainer.clientWidth - 5;
  if (isTextOverflowing) playerScreenContainer.classList.add("has-horizontal-scroll");
}
