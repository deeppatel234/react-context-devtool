import React, { useState, useEffect } from "react";
import JSONTree from "../components/JsonTree";

import SideBar from "../components/SideBar";

import RawView from "../components/RawView";

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
  const [selectedContext, setSelectedContext] = useState('');

  useEffect(() => {
    if (!appData) {
      return;
    }
    const conList = Object.keys(appData).map(key => ({
      displayName: appData[key].newValue.displayName,
      value: key
    }));

    if (!selectedContext) {
      setSelectedContext(conList[0].value);
    }
    setContextList(conList);
  }, [appData]);

  if (!appData || !selectedContext) {
    return null;
  }

  return (
    <AppLayout>
      <GlobalStyle />
      <LayoutHeader> Tab Title</LayoutHeader>
      <LayoutBody>
        <LayoutSideBar>
          <SideBar
            contextList={contextList}
            selectedContext={selectedContext}
            onChangeSelectedContext={setSelectedContext}
          />
        </LayoutSideBar>
        <LayoutContent>
          {/* <JSONTree data={appData[selectedContext].newValue.values} /> */}
          <RawView data={appData[selectedContext].newValue.values} />
        </LayoutContent>
      </LayoutBody>
    </AppLayout>
  );
};

export default App;
