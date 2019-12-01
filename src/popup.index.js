/* global chrome */

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App";

const registerTab = onMessage => {
  chrome.runtime.onMessage.addListener(function(message) {
    console.log(message);
    if (message.type === "REACT_CONTEXT_DEVTOOL_POPUP_DATA") {
      onMessage(message.data);
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    chrome.runtime.sendMessage({
      type: 'REACT_CONTEXT_DEVTOOL_POPUP_DATA_REQUEST',
      tabId: tab[0].id
    })
  });
};

const DevPanel = () => {
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    registerTab(onMessage);
  }, []);

  const onMessage = message => {
    console.log("message from popup", message);
    setAppData(message);
  };

  return <App appData={appData} />;
};

ReactDOM.render(<DevPanel />, document.getElementById("popupRoot"));
