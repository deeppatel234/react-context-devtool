export const activateExtension = (mode, tabId) => {
  chrome.action.setIcon({
    tabId,
    path: {
      16: `assets/icons/icon16${mode ? `-${mode}` : ""}.png`,
      32: `assets/icons/icon32${mode ? `-${mode}` : ""}.png`,
      48: `assets/icons/icon48${mode ? `-${mode}` : ""}.png`,
      128: `assets/icons/icon128${mode ? `-${mode}` : ""}.png`,
    },
  });

  chrome.action.setPopup({
    tabId,
    popup: "popup/popup.html",
  });
};
