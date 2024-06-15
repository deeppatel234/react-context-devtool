import { onMessage } from "@ext-browser/messaging/contentWindow";

import { installHook } from "./dataProcess";

const start = () => {
  const hook = installHook();

  hook.init();
  // console.log("INIT_DEBUGGING");

  try {
    onMessage("START_DEBUGGING", ({ settings }) => {
      // console.log("START_DEBUGGING", settings);
      hook.setSettings(settings);
      hook.startDebug();
    });

    onMessage("STOP_DEBUGGING", () => {
      // console.log("STOP_DEBUGGING");
      hook.stopDebug();
    });
  } catch(err) {
    console.log("REACT_CONTEXT_DEVTOOL ERROR", err);
  }
};

start();