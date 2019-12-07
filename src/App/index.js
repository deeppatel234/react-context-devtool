import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import DataView from "../components/DataView";
import ConfigureMessage from "./ConfigureMessage";

import {
  GlobalStyle,
  AppLayout,
  LayoutHeader,
  LayoutBody,
  LayoutSideBar,
  LayoutContent
} from "./styled";

const App = ({ appData }) => {
  const [contextList, setContextList] = useState([]);
  const [selectedContext, setSelectedContext] = useState("");

  useEffect(() => {
    if (!appData) {
      return;
    }
    const { context } = appData;
    const conList = Object.keys(context).map(key => ({
      displayName: context[key].newValue.displayName,
      value: key
    }));

    if (!selectedContext) {
      setSelectedContext(conList[0].value);
    }
    setContextList(conList);
  }, [appData]);

  if (!appData || !selectedContext) {
    return (
      <>
        <GlobalStyle />
        <ConfigureMessage />
      </>
    );
  }

  return (
    <AppLayout>
      <GlobalStyle fullHeight />
      <LayoutHeader>
        {appData.tab.title || "React Context Devtool"}
      </LayoutHeader>
      <LayoutBody>
        <LayoutSideBar>
          <SideBar
            contextList={contextList}
            selectedContext={selectedContext}
            onChangeSelectedContext={setSelectedContext}
          />
        </LayoutSideBar>
        <LayoutContent>
          <DataView
            data={appData.context[selectedContext].newValue.values}
            oldValue={appData.context[selectedContext].oldValue.values}
          />
        </LayoutContent>
      </LayoutBody>
    </AppLayout>
  );
};

export default App;
