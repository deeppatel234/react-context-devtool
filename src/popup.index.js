/* global chrome */

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { onMessage, sendMessage } from "@ext-browser/messaging/popup";

const domNode = document.getElementById("popupRoot");
const root = createRoot(domNode);

import App from "Containers/App";

const Popup = () => {
  const [appData, setAppData] = useState(null);

  const loadData = async () => {
    try {
      const data = await sendMessage("background", "GET_CONTEXT_DATA", { currentTab: true });
      setAppData(data);
    } catch (err) {
      console.log("Error", err);
    }
    onMessage("CONTEXT_DATA", (data) => {
      setAppData(data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const onDispatchAction = (action) => {
    sendMessage(`content:${appData.tabId}`, "DISPATCH_ACTION", action);
  };

  console.log("appData", appData);

  return <App appData={appData} onDispatchAction={onDispatchAction} />;
};

root.render(<Popup />);
