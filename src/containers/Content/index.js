import React, { useContext } from "react";

import Sidebar from "Containers/Sidebar";
import ContextView from "Containers/ContextView";
import UseReducerView from "Containers/UseReducerView";

import AppContext from "Containers/AppContext";

const Content = () => {
  const { appData, selectedDebug } = useContext(AppContext);

  const dubugData = appData[selectedDebug.type]?.[selectedDebug.id];

  console.log(dubugData);

  return (
    <div id="content">
      <Sidebar />
      <section>
        {
          selectedDebug.type === "context" && <ContextView dubugData={dubugData} />
        }
        {
          selectedDebug.type === "useReducer" && <UseReducerView dubugData={dubugData} />
        }
      </section>
    </div>
  );
};

export default Content;
