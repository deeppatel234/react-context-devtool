import React, { useState } from "react";

import AppContext from "Containers/AppContext";
import Header from "Containers/Header";
import Content from "Containers/Content";

import "./app.scss";

const App = ({ appData, onDispatchAction }) => {
  const [selectedDebug, setDebug] = useState({});

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
