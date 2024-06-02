import React, { useContext } from "react";

import Sidebar from "Containers/Sidebar";
import ContextView from "Containers/ContextView";
import UseReducerView from "Containers/UseReducerView";

import AppContext from "Containers/AppContext";

const Content = () => {
  const { appData, selectedDebug } = useContext(AppContext);

  const debugData = appData[selectedDebug.type]?.[selectedDebug.id];

  return (
    <div id="content">
      <Sidebar />
      <section>
        {debugData && selectedDebug.type === "context" && (
          <ContextView id={selectedDebug.id} debugData={debugData} />
        )}
        {debugData && selectedDebug.type === "useReducer" && (
          <UseReducerView id={selectedDebug.id} debugData={debugData} />
        )}
      </section>
    </div>
  );
};

export default Content;
