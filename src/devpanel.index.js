/* global chrome */

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { onMessage, sendMessage } from "@ext-browser/messaging/devtools";

const domNode = document.getElementById("devPanelRoot");
const root = createRoot(domNode);

import App from "Containers/App";

const convertStringToObj = (data) => {
  Object.values(data.context).forEach((item) => {
    if (typeof item.newValue.value === "string") {
      item.newValue.value = JSON.parse(item.newValue.value);
    }
  });

  Object.values(data.useReducer).forEach((item) => {
    item.actions = item.actions.map((action) => {
      if (typeof action === "string") {
        return JSON.parse(action);
      }
      return action;
    });
    item.state = item.state.map((state) => {
      if (typeof state === "string") {
        return JSON.parse(state);
      }
      return state;
    });
  });
};

const DevPanel = () => {
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    onMessage("context-data", (data) => {
      convertStringToObj(data);
      setAppData(data);
    });
  }, []);

  const onDispatchAction = (action) => {
    // eventRef.current.postMessage = (action) => {
    //   backgroundPageConnection.postMessage({
    //     tabId,
    //     type: DATA_EVENT,
    //     subType: DISPATCH_EVENT,
    //     data: action
    //   });
    // };
  };

  console.log("appData", appData);

  return <App appData={appData} onDispatchAction={onDispatchAction} />;
};

root.render(<DevPanel />);
