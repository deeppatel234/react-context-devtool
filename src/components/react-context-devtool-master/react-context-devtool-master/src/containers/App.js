import React, { useState } from "react";

import AppContext from "Containers/AppContext";
import Header from "Containers/Header";
import Content from "Containers/Content";
import NotFoundMessage from "Containers/NotFoundMessage";

import "./app.scss";

const App = ({ appData, onDispatchAction }) => {
  const [selectedDebug, setDebug] = useState({});

  if (!appData || !appData.tab) {
    return <NotFoundMessage />
  }

  return (
    <AppContext.Provider
      value={{
        appData,
        selectedDebug,
        setDebug,
        onDispatchAction
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
