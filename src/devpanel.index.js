/* global chrome */

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { onMessage, sendMessage } from "@ext-browser/messaging/devtools";

const domNode = document.getElementById("devPanelRoot");
const root = createRoot(domNode);

import App from "Containers/App";

const DevPanel = () => {
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    onMessage("CONTEXT_DATA", (data) => {
      setAppData(data);
    });
  }, []);

  const onDispatchAction = (action) => {
    sendMessage(`content:${appData.tabId}`, "DISPATCH_ACTION", action);
  };

  console.log("appData", appData);

  return <App appData={appData} onDispatchAction={onDispatchAction} />;
};

root.render(<DevPanel />);
