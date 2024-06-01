import { onMessage, initMessaging, sendMessage } from "@ext-browser/messaging/background";

import { activateExtension, getSettings } from "./utils";
import { executeScriptInMainWorld } from "./executeScript";
import { saveCatchData, removeCatchData } from "./contextData";

initMessaging({
  onPortDisconnect: (props) => {
    console.log("Port disconnected", props);
  },
  onPortConnect: (props) => {
    console.log("Port connected", props);
  },
});

onMessage("GET_SETTINGS", () => {
  return getSettings();
});

onMessage("REACT_JS_FOUND", async (data, { sender }) => {
  activateExtension(data.reactBuildType, sender.tab.id);

  saveCatchData(sender.tab, {
    isReactDetected: true,
    reactDevtoolPayload: data,
  });

  const settings = await getSettings();

  const isScriptLoaded = await executeScriptInMainWorld({
    target: { tabId: sender.tab.id },
    files: ["mainContent.js"],
  });

  if (settings.startDebugWhen === "pageLoad" && isScriptLoaded) {
    try {
      await sendMessage(`content:${sender.tab.id}`, "START_DEVTOOL", {
        settings,
        reactDevtoolPayload: data,
      })
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  return true;
});

onMessage("CONTEXT_DATA_UPDATED", (data, { sender }) => {
  saveCatchData(sender.tab, data);
});
