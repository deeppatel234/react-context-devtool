/* global chrome */

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "Containers/App";

const DATA_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_DATA_EVENT";
const INIT_DEVPANEL_EVENT = "INIT_DEVPANEL";
const DEVPANEL_DATA_EVENT = "DEVPANEL_DATA";

let chunks = [];

const registerTab = onMessage => {
  const tabId = chrome.devtools.inspectedWindow.tabId;
  const backgroundPageConnection = chrome.runtime.connect({
    name: tabId ? tabId.toString() : undefined
  });

  backgroundPageConnection.onMessage.addListener(event => {
    if (
      event.type === DATA_EVENT &&
      event.subType === DEVPANEL_DATA_EVENT
    ) {
      let { data, split } = event;

      if (split === "chunk") {
        chunks.push(data);
        return;
      }

      if (split === "end") {
        data = chunks.join('') || "{}";
        chunks = [];
      }

      onMessage(JSON.parse(data));
    }
  });

  backgroundPageConnection.postMessage({
    tabId,
    type: DATA_EVENT,
    subType: INIT_DEVPANEL_EVENT,
  });
};

const DevPanel = () => {
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    registerTab(onMessage);
  }, []);

  const onMessage = data => {
    console.log(data);
    setAppData(data);
  };

  if (!appData || !appData.tab) {
    return "...loading...";
  }

  return <App appData={appData} />;
};

ReactDOM.render(<DevPanel />, document.getElementById("devPanelRoot"));
