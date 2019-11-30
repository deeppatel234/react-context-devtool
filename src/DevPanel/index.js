import React, { useState, useEffect } from "react";

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

const DevPanel = () => {
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    registerTab(onMessage);
  }, []);

  const onMessage = message => {
    console.log("message from devpanel", message);
    setAppData(message);
  };

  if (!appData) {
    return null;
  }

  return <div>Hello World : {appData.values.b}</div>;
};

export default DevPanel;
