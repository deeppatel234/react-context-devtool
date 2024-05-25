import { onMessage, initMessaging } from "@ext-browser/messaging/background";

import { activateExtension } from "./actions";
import { executeScriptInMainWorld } from "./executeScript";
import { saveCatchData } from "./contextData";

initMessaging();

onMessage("ACTIVATE_EXTENSTION", (event, { senderTab }) => {
  console.log("event", event, senderTab);

  activateExtension(event.reactBuildType, senderTab.id);

  executeScriptInMainWorld({
    target: { tabId: senderTab.id },
    files: ["mainContent.js"],
  });
});

onMessage("CONTEXT_DATA_UPDATED", (data, { senderTab }) => {
  saveCatchData(senderTab, data);
});




// /* global chrome */

// const DATA_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_DATA_EVENT";
// const ACTIVATE_EXTENSTION = "ACTIVATE_EXTENSTION";
// const APP_DATA_EVENT = "APP_DATA";
// const ADD_APP_DATA_EVENT = "ADD_APP_DATA";
// const INIT_DEVPANEL_EVENT = "INIT_DEVPANEL";
// const DEVPANEL_DATA_EVENT = "DEVPANEL_DATA";
// const INIT_POPUP_EVENT = "INIT_POPUP";
// const POPUP_DATA_EVENT = "POPUP_DATA";
// const DISPATCH_EVENT = "DISPATCH_EVENT";
// const LOCAL_STORAGE_DATA = "LOCAL_STORAGE_DATA";

// const MAX_DATA_SIZE = 5 * 1024 * 1024; // 50MB

// const connections = {};
// const catchData = {};
// const chunkData = {};

// const defaultSettings = {
//   startDebugWhen: "extensionLoad",
//   debugUseReducer: true,
//   debugContext: true,
// };

// chrome.runtime.onConnect.addListener((port) => {
//   const panelListener = (event) => {
//     if (event.type === DATA_EVENT && event.subType === INIT_DEVPANEL_EVENT) {
//       connections[event.tabId] = port;
//       sendData("DEVTOOL", event.tabId);
//     }

//     if (event.type === DATA_EVENT && event.subType === DISPATCH_EVENT) {
//       sendDataToContent(event);
//     }
//   };

//   port.onMessage.addListener(panelListener);

//   port.onDisconnect.addListener(function () {
//     port.onMessage.removeListener(panelListener);

//     // remove connection object
//     const tabs = Object.keys(connections);
//     for (let i = 0, len = tabs.length; i < len; i++) {
//       if (connections[tabs[i]] == port) {
//         delete connections[tabs[i]];
//         break;
//       }
//     }
//   });
// });

// chrome.tabs.onRemoved.addListener((tabId) => {
//   if (catchData[tabId]) {
//     delete catchData[tabId];
//   }
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === DATA_EVENT && request.subType) {
//     if (request.subType === ACTIVATE_EXTENSTION) {
//       setAppPopup(true, sender.tab.id);
//     } else if (
//       request.subType === APP_DATA_EVENT ||
//       request.subType === ADD_APP_DATA_EVENT
//     ) {
//       saveCatchData(request, sender.tab, request.subType);
//       sendData("DEVTOOL", sender.tab.id);
//       sendData("POPUP", sender.tab.id);
//     } else if (request.subType === INIT_POPUP_EVENT) {
//       sendData("POPUP", request.tabId);
//     } else if (request.subType === DISPATCH_EVENT) {
//       sendDataToContent(request);
//     } else if (request.subType === LOCAL_STORAGE_DATA) {
//       chrome.storage.local.get(
//         ["startDebugWhen", "debugUseReducer", "debugContext"],
//         (settings) => {
//           sendResponse({
//             ...defaultSettings,
//             ...settings,
//           });
//         }
//       );
//       return true;
//     }
//   }
// });

// const sendDataToContent = (event) => {
//   chrome.tabs.sendMessage(event.tabId, event);
// };

// const transferTo = (to, tabId, params) => {
//   if (to === "DEVTOOL") {
//     if (tabId in connections) {
//       connections[tabId].postMessage({
//         type: DATA_EVENT,
//         subType: DEVPANEL_DATA_EVENT,
//         ...params,
//       });
//     }
//   } else if (to === "POPUP") {
//     chrome.runtime.sendMessage({
//       type: DATA_EVENT,
//       subType: POPUP_DATA_EVENT,
//       tabId,
//       ...params,
//     });
//   }
// };

// const sendData = (to, tabId) => {
//   const dataToSend = JSON.stringify(catchData[tabId] || {});

//   try {
//     const params = {
//       data: dataToSend,
//     };
//     transferTo(to, tabId, params);
//   } catch (err) {
//     if (
//       err.message.includes("Message length exceeded maximum allowed length")
//     ) {
//       const chunkCount = Math.ceil(dataToSend.length / MAX_DATA_SIZE);

//       for (let i = 0; i < chunkCount; i++) {
//         const params = {
//           split: "chunk",
//           chunk: i,
//           data: dataToSend.slice(i * MAX_DATA_SIZE, (i + 1) * MAX_DATA_SIZE),
//         };
//         transferTo(to, tabId, params);
//       }

//       transferTo(to, tabId, {
//         split: "end",
//       });
//     } else {
//       console.error(err);
//     }
//   }
// };
