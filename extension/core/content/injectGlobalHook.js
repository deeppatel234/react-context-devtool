import { sendMessage, onWindowMessage, sendToWindow } from "@ext-browser/messaging/content";

let isExtensionActive = false;
const defaultSettings = {
  // startDebugWhen: "extensionLoad",
  startDebugWhen: "pageLoad",
  debugUseReducer: true,
  debugContext: true,
};
let reactDevtoolPayload = {};

window.addEventListener(
  "message",
  function (event) {
    if (event.source != window) return;

    if (event.data.source === "react-devtools-detector"  || event.data.source === "react-devtools-hook") {
      if (!isExtensionActive) {
        sendMessage("background", "ACTIVATE_EXTENSTION", event.data.payload);
        isExtensionActive = true;
        reactDevtoolPayload = event.data.payload;
      }
    }
  },
  false
);

onWindowMessage("MAIN_CONTENT_LOADED", (event, ...abcd) => {
  chrome.storage.local.get(
    ["startDebugWhen", "debugUseReducer", "debugContext"],
    (settings) => {
      const settingsToUse = {
        ...defaultSettings,
        ...settings,
      };

      if (settingsToUse.startDebugWhen === "pageLoad") {
        sendToWindow("START_DEVTOOL", {
          settings: settingsToUse,
          reactDevtoolPayload,
        });
      }
    }
  );
});

onWindowMessage("CONTEXT_DATA_UPDATED", data => {
  sendMessage("background", "CONTEXT_DATA_UPDATED", data);
});















// import { installHook } from "./hook";

// /**
//  * Chrome limit sendMessage size to 64MB
//  */
// const MAX_DATA_SIZE = 5 * 1024 * 1024; // 50MB
// const HOOK_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_EVENT";
// const DATA_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_DATA_EVENT";
// const ADD_APP_DATA_EVENT = "ADD_APP_DATA";
// const APP_DATA_EVENT = "APP_DATA";
// const LOAD_HOOK_HELPER_EVENT = "LOAD_HOOK_HELPER";

// let isExtensionActive = false;




// function manualScriptToInject() {
//   window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.debug = (data) => {
//     const helpers = window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers;
//     window.postMessage(
//       {
//         type: "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_EVENT",
//         subType: "ADD_APP_DATA",
//         data: helpers.parseData({
//           context: {
//             [data.id]: {
//               displayName: data.displayName,
//               value: data.values,
//               valueChanged: true,
//               remove: false,
//             },
//           },
//         }),
//       },
//       "*"
//     );
//   };
// }

// chrome.runtime.sendMessage(
//   {
//     type: "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_DATA_EVENT",
//     subType: "LOCAL_STORAGE_DATA",
//   },
//   function (response) {
//     const settings = JSON.stringify(response);

//     injectCode(`

//       ;(${installHook.toString()}(window, ${settings}))
//     `);
//   }
// );

// window.addEventListener(
//   "message",
//   function (event) {
//     if (event.source != window) return;

//     if (event.data.source === "react-devtools-detector"  || event.data.source === "react-devtools-hook") {
//       if (!isExtensionActive) {
//         chrome.runtime.sendMessage({
//           type: DATA_EVENT,
//           subType: "ACTIVATE_EXTENSTION",
//           data: event.data,
//         });
//         isExtensionActive = true;
//       }
//     }

//     if (event.data.type === HOOK_EVENT) {
//       if (event.data.subType === LOAD_HOOK_HELPER_EVENT) {
//         loadHelpers();
//         return;
//       }

//       if (
//         event.data.subType === APP_DATA_EVENT ||
//         event.data.subType === ADD_APP_DATA_EVENT
//       ) {
//         try {
//           chrome.runtime.sendMessage({
//             type: DATA_EVENT,
//             subType: event.data.subType,
//             data: event.data.data,
//           });
//         } catch (err) {
//           if (
//             err.message.includes(
//               "Message length exceeded maximum allowed length"
//             )
//           ) {
//             const { data } = event.data;
//             const chunkCount = Math.ceil(data.length / MAX_DATA_SIZE);

//             for (let i = 0; i < chunkCount; i++) {
//               chrome.runtime.sendMessage({
//                 type: DATA_EVENT,
//                 subType: event.data.subType,
//                 split: "chunk",
//                 chunk: i,
//                 data: data.slice(i * MAX_DATA_SIZE, (i + 1) * MAX_DATA_SIZE),
//               });
//             }

//             chrome.runtime.sendMessage({
//               type: DATA_EVENT,
//               subType: event.data.subType,
//               split: "end",
//             });
//           } else {
//             console.error(err);
//           }
//         }
//       }
//     }
//   },
//   false
// );

// chrome.runtime.onMessage.addListener(function (request) {
//   window.postMessage(request);
// });
