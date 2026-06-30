function removeAccents(text) {
  const isTextEmpty = !text;
  if (isTextEmpty) return "";
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getFileNameWithoutExtension(filePath) {
  const isPathEmpty = !filePath;
  if (isPathEmpty) return "";
  const pathSegments = filePath.split(/[/\\]/);
  const fileNameWithExtension = pathSegments[pathSegments.length - 1];
  const lastDotIndex = fileNameWithExtension.lastIndexOf(".");
  const hasNoExtension = lastDotIndex === -1;
  if (hasNoExtension) return fileNameWithExtension;
  return fileNameWithExtension.slice(0, lastDotIndex);
}

function getDirectoryPathFromFilePath(filePath) {
  const isPathEmpty = !filePath;
  if (isPathEmpty) return "";
  const pathSegments = filePath.split(/[/\\]/);
  pathSegments.pop();
  return pathSegments.join("/");
}

function getFolderNameFromFolderPath(folderPath) {
  const isPathEmpty = !folderPath;
  if (isPathEmpty) return "";
  const pathSegments = folderPath.split(/[/\\]/);
  return pathSegments[pathSegments.length - 1] || "";
}
