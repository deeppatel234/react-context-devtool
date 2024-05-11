/* global chrome */

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import App from "Containers/App";

const DATA_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_DATA_EVENT";
const INIT_DEVPANEL_EVENT = "INIT_DEVPANEL";
const DEVPANEL_DATA_EVENT = "DEVPANEL_DATA";
const DISPATCH_EVENT = "DISPATCH_EVENT";

let chunks = [];

const registerTab = (onMessage, eventRef) => {
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

  eventRef.current.postMessage = (action) => {
    backgroundPageConnection.postMessage({
      tabId,
      type: DATA_EVENT,
      subType: DISPATCH_EVENT,
      data: action
    });
  };
};

const DevPanel = () => {
  const [appData, setAppData] = useState(null);
  const eventRef = useRef();

  useEffect(() => {
    eventRef.current = {};
    registerTab(onMessage, eventRef);
  }, []);

  const onMessage = data => {
    setAppData(data);
  };

  const onDispatchAction = action => {
    eventRef.current.postMessage(action);
  };

  return <App appData={appData} onDispatchAction={onDispatchAction} />;
};

ReactDOM.render(<DevPanel />, document.getElementById("devPanelRoot"));
