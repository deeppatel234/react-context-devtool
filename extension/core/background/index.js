import {
  onMessage,
  initMessaging,
  sendMessage,
} from "@ext-browser/messaging/background";

import { activateExtension, getSettings, getCurrentTab } from "./utils";
import { executeScriptInMainWorld } from "./executeScript";
import { saveCatchData, removeCatchData } from "./contextData";

const enableTabMap = {
  popup: false,
  devtool: {},
};

initMessaging({
  onPortDisconnect: async ({ portName, tabId }) => {
    const settings = await getSettings();
    let tabIdToUse = tabId;

    if (!tabIdToUse) {
      const tab = await getCurrentTab();
      tabIdToUse = tab.id;
    }

    if (settings.startDebugWhenV2 === "extensionLoad") {
      if (portName.includes("popup")) {
        enableTabMap.popup = false;
      }

      if (portName.includes("devtool")) {
        delete enableTabMap.devtool[tabIdToUse];
      }

      if (!enableTabMap.popup && !enableTabMap.devtool[tabIdToUse]) {
        try {
          await sendMessage(`content:${tabIdToUse}`, "STOP_DEVTOOL", {
            settings,
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  },
  onPortConnect: async ({ portName, tabId }) => {
    const settings = await getSettings();

    if (settings.startDebugWhenV2 === "extensionLoad") {
      if (portName.includes("popup")) {
        enableTabMap.popup = true;
      }

      if (portName.includes("devtool")) {
        enableTabMap.devtool[tabId] = true;
      }

      if (enableTabMap.popup || enableTabMap.devtool[tabId]) {
        try {
          await sendMessage(
            `content:${enableTabMap.popup && !tabId ? "active" : tabId}`,
            "START_DEVTOOL",
            {
              settings,
            },
          );
        } catch (error) {
          console.error(error);
        }
      }
    }
  },
});

onMessage("GET_SETTINGS", () => {
  return getSettings();
});

onMessage("REACT_JS_FOUND", async (data, { sender }) => {
  activateExtension(data.reactBuildType, sender.tab.id);

  removeCatchData(sender.tab.id);

  saveCatchData(sender.tab, {
    isReactDetected: true,
    reactDevtoolPayload: data,
  });

  const settings = await getSettings();

  const isScriptLoaded = await executeScriptInMainWorld({
    target: { tabId: sender.tab.id },
    files: ["mainContent.js"],
  });

  if (isScriptLoaded) {
    let startDebug = settings.startDebugWhenV2 === "pageLoad";

    if (!startDebug) {
      startDebug =
        settings.startDebugWhenV2 === "extensionLoad" &&
        (enableTabMap.popup || enableTabMap.devtool[sender.tab.id]);
    }

    if (startDebug) {
      try {
        await sendMessage(`content:${sender.tab.id}`, "START_DEVTOOL", {
          settings,
          reactDevtoolPayload: data,
        });
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }

  return true;
});

onMessage("CONTEXT_DATA_UPDATED", (data, { sender }) => {
  saveCatchData(sender.tab, data);
});
