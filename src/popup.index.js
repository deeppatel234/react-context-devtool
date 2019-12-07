/* global chrome */

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App";

const registerTab = onMessage => {
  let tabId = null;

  chrome.runtime.onMessage.addListener(function(message) {
    if (
      message.type === "REACT_CONTEXT_DEVTOOL_POPUP_DATA" &&
      tabId &&
      tabId === message.tabId
    ) {
      onMessage(message.data);
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    tabId = tab[0].id;
    chrome.runtime.sendMessage({
      type: "REACT_CONTEXT_DEVTOOL_POPUP_DATA_REQUEST",
      tabId
    });
  });
};

const DevPanel = () => {
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    registerTab(onMessage);
  }, []);

  const onMessage = message => {
    setAppData(message);
  };

  return <App appData={appData} />;
};

ReactDOM.render(<DevPanel />, document.getElementById("popupRoot"));
