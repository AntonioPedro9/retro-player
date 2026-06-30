const { protocol, net } = require("electron");
const { pathToFileURL } = require("node:url");

function registerMediaProtocol() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "media",
      privileges: {
        standard: true,
        secure: true,
        bypassCSP: true,
        supportFetchAPI: true,
        stream: true,
      },
    },
  ]);
}

function handleMediaProtocol() {
  protocol.handle("media", (request) => {
    try {
      const parsedRequestUrl = new URL(request.url);
      let decodedTargetFilePath = decodeURIComponent(parsedRequestUrl.pathname);

      const hasDoubleSlashPrefix = decodedTargetFilePath.startsWith("//");
      if (hasDoubleSlashPrefix) {
        decodedTargetFilePath = decodedTargetFilePath.slice(1);
      }

      const isWindowsPathWithLeadingSlash = process.platform === "win32" && decodedTargetFilePath.startsWith("/");
      if (isWindowsPathWithLeadingSlash) {
        decodedTargetFilePath = decodedTargetFilePath.slice(1);
      }

      const formattedLocalFileUrl = pathToFileURL(decodedTargetFilePath).toString();

      return net
        .fetch(formattedLocalFileUrl, {
          bypassCustomProtocolHandlers: true,
        })
        .catch((fetchError) => {
          throw fetchError;
        });
    } catch (protocolError) {
      console.error("Media protocol error:", protocolError);
    }
  });
}

module.exports = {
  registerMediaProtocol,
  handleMediaProtocol,
};
