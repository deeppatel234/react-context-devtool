/* global chrome */

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import App from "Containers/App";

const DATA_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_DATA_EVENT";
const INIT_POPUP_EVENT = "INIT_POPUP";
const POPUP_DATA_EVENT = "POPUP_DATA";
const DISPATCH_EVENT = "DISPATCH_EVENT";

const registerTab = (onMessage, eventRef) => {
  let tabId = null;

  chrome.runtime.onMessage.addListener(event => {
    if (
      event.type === DATA_EVENT &&
      event.subType === POPUP_DATA_EVENT &&
      tabId &&
      tabId === event.tabId
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

  chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    tabId = tab[0].id;
    chrome.runtime.sendMessage({
      type: DATA_EVENT,
      subType: INIT_POPUP_EVENT,
      tabId
    });
  });

  eventRef.current.postMessage = (action) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
      tabId = tab[0].id;
      chrome.runtime.sendMessage({
        tabId,
        type: DATA_EVENT,
        subType: DISPATCH_EVENT,
        data: action
      });
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
    console.log(data);
    setAppData(data);
  };

  const onDispatchAction = action => {
    eventRef.current.postMessage(action);
  };

  if (!appData || !appData.tab) {
    return "...loading...";
  }

  return <App appData={appData} onDispatchAction={onDispatchAction} />;
};

ReactDOM.render(<DevPanel />, document.getElementById("popupRoot"));
