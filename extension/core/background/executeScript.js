/* global chrome */

function executeScriptForFirefoxInMainWorld({ target, files }) {
  return chrome.scripting.executeScript({
    target,
    func: (fileNames) => {
      function injectScriptSync(src) {
        let code = "";
        const request = new XMLHttpRequest();
        request.addEventListener("load", function () {
          code = this.responseText;
        });
        request.open("GET", src, false);
        request.send();

        const script = document.createElement("script");
        script.textContent = code;

        // This script runs before the <head> element is created,
        // so we add the script to <html> instead.
        if (document.documentElement) {
          document.documentElement.appendChild(script);
        }

        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }

      fileNames.forEach((file) =>
        injectScriptSync(chrome.runtime.getURL(file)),
      );
    },
    args: [files],
  });
}

export function executeScriptInMainWorld({ target, files }) {
  if (DEV_FOR === "firefox") {
    return executeScriptForFirefoxInMainWorld({ target, files });
  }

  return chrome.scripting.executeScript({
    target,
    files,
    world: chrome.scripting.ExecutionWorld.MAIN,
  });
}
