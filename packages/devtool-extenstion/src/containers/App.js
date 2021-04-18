import React, { useEffect, useState } from "react";

import AppContext from "Containers/AppContext";
import Header from "Containers/Header";
import Content from "Containers/Content";
import NotFoundMessage from "Containers/NotFoundMessage";

import "./app.scss";

const defaultSettings = {
  startDebugWhen: "extensionLoad",
  debugUseReducer: true,
  debugContext: true,
};

const App = ({ appData, onDispatchAction }) => {
  const [selectedDebug, setDebug] = useState({});
  const [settings, setSettings] = useState({
    ...defaultSettings,
  });

  useEffect(() => {
    chrome.storage.local.get(
      ["startDebugWhen", "debugUseReducer", "debugContext"],
      function (result) {
        setSettings({ ...defaultSettings, ...result });
      }
    );
  }, []);

  if (!appData || !appData.tab) {
    return <NotFoundMessage />;
  }

  return (
    <AppContext.Provider
      value={{
        appData,
        settings,
        selectedDebug,
        setDebug,
        onDispatchAction,
      }}
    >
      <div id="main-app">
        <Header />
        <Content />
      </div>
    </AppContext.Provider>
  );
};

export default App;
