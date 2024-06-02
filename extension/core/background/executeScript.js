/* global chrome */

export function executeScriptInMainWorld({target, files}) {
  return chrome.scripting.executeScript({
    target,
    files,
    world: chrome.scripting.ExecutionWorld.MAIN,
  });
}

