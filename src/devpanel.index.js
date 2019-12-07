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
    type: "REACT_CONTEXT_DEVTOOL_INIT"
  });
};

const DevPanel = () => {
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    registerTab(onMessage);
  }, []);

  const onMessage = message => {
    if (message.type === 'REACT_CONTEXT_DEVTOOL_DEVPANEL_DATA') {
      setAppData(message.data);
    }
  };

  return <App appData={appData} />;
};

ReactDOM.render(<DevPanel />, document.getElementById("devPanelRoot"));
