import React, { useState, useEffect } from "react";
import JSONTree from "../components/JsonTree";

import { GlobalStyle } from "./styled";

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

  return (
    <>
      <GlobalStyle />
      <JSONTree data={appData.values} />
    </>
  );
};

export default DevPanel;
