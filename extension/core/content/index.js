import { sendMessage, onWindowMessage, sendToWindow, onMessage } from "@ext-browser/messaging/content";

let isExtensionActive = false;

window.addEventListener(
  "message",
  function (event) {
    if (event.source != window) return;

    if (event.data.source === "react-devtools-detector"  || event.data.source === "react-devtools-hook") {
      if (!isExtensionActive) {
        sendMessage("background", "REACT_JS_FOUND", event.data.payload);
        isExtensionActive = true;
      }
    }
  },
  false
);

onMessage("START_DEVTOOL", (data) => {
  sendToWindow("START_DEBUGGING", data);
});

onMessage("STOP_DEVTOOL", (data) => {
  sendToWindow("STOP_DEBUGGING", data);
});

onMessage("DISPATCH_ACTION", (data) => {
  sendToWindow("DISPATCH_USE_REDUCER_ACTION", data);
});

onWindowMessage("CONTEXT_DATA_UPDATED", data => {
  sendMessage("background", "CONTEXT_DATA_UPDATED", data);
});

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
