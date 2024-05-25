/* global chrome */

export function executeScriptInMainWorld({target, files}) {
  // if (__IS_FIREFOX__) {
  //   return executeScriptForFirefoxInMainWorld({target, files});
  // }

  return chrome.scripting.executeScript({
    target,
    files,
    world: chrome.scripting.ExecutionWorld.MAIN,
  });
}

