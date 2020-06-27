import React, { useContext } from "react";

import Sidebar from "Containers/Sidebar";
import ContextView from "Containers/ContextView";
import UseReducerView from "Containers/UseReducerView";

import AppContext from "Containers/AppContext";

const Content = () => {
  const { appData, selectedDebug } = useContext(AppContext);

  const debugData = appData[selectedDebug.type]?.[selectedDebug.id];

  console.log(debugData);

  return (
    <div id="content">
      <Sidebar />
      <section>
        {selectedDebug.type === "context" && (
          <ContextView id={selectedDebug.id} debugData={debugData} />
        )}
        {selectedDebug.type === "useReducer" && (
          <UseReducerView id={selectedDebug.id} debugData={debugData} />
        )}
      </section>
    </div>
  );
};

export default Content;
