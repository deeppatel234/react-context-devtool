/* global chrome */

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App";

const registerTab = onMessage => {
  const tabId = chrome.devtools.inspectedWindow.tabId;
  const backgroundPageConnection = chrome.runtime.connect({
    name: tabId ? tabId.toString() : undefined
  });

  backgroundPageConnection.onMessage.addListener(onMessage);

  backgroundPageConnection.postMessage({
    tabId,
    type: "INIT"
  });
};

// const AppDataTemp = JSON.parse('{"hello":{"oldValue":{},"newValue":{"id":"hello","displayName":"Hello","values":{"a":"hello","b":0}}},"cont2":{"oldValue":{},"newValue":{"id":"cont2","displayName":"Cont2","values":{"a":0,"b":"world"}}}}')

const DevPanel = () => {
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    registerTab(onMessage);
  }, []);

  const onMessage = message => {
    console.log("message from devpanel", message);
    setAppData(message);
  };

  return <App appData={appData} />;
};

ReactDOM.render(<DevPanel />, document.getElementById("devPanelRoot"));
