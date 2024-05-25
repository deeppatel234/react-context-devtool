/* global chrome */

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { onMessage, sendMessage } from "@ext-browser/messaging/popup";

import App from "Containers/App";

const domNode = document.getElementById("popupRoot");
const root = createRoot(domNode);

const Popup = () => {
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    onMessage("context-data", (data) => {
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


root.render(<Popup />);
