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

export const getSettings = () => {
  const defaultSettings = {
    startDebugWhen: "extensionLoad",
    // startDebugWhen: "pageLoad",
    debugUseReducer: true,
    debugContext: true,
  };

  return new Promise((resolve) => {
    chrome.storage.local.get(
      ["startDebugWhen", "debugUseReducer", "debugContext"],
      (settings) => {
        const settingsToUse = {
          ...defaultSettings,
          ...settings,
        };

        resolve(settingsToUse);
      }
    );
  });
};

export const getCurrentTab = async () => {
  if (!chrome.tabs?.query) {
    return null;
  }

  const queryOptions = { active: true };
  const tabs = await chrome.tabs.query(queryOptions);

  return tabs[0];
};
