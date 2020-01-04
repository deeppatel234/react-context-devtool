import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import SideBar from "../components/SideBar";
import DataView from "../components/DataView";
import Switch from "../components/Switch";
import ConfigureMessage from "./ConfigureMessage";
import ThemeContext, { THEME } from "./ThemeContext";
import theme from "./theme";

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
  const [selectedTheme, changeTheme] = useState(THEME.DARK);

  useEffect(() => {
    chrome.storage.local.get(['theme'], function(result) {
      if (result && result.theme) {
        changeTheme(result.theme);
      }
    });
  }, []);

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

  const onChangeTheme = event => {
    const themeMode = event.target.checked ? THEME.DARK : THEME.LIGHT;
    changeTheme(themeMode);
    chrome.storage.local.set({theme: themeMode});
  };

  if (!appData || !selectedContext) {
    return (
      <ThemeProvider theme={theme[selectedTheme]}>
        <GlobalStyle />
        <ConfigureMessage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeContext.Provider value={selectedTheme}>
      <ThemeProvider theme={theme[selectedTheme]}>
        <AppLayout>
          <GlobalStyle fullHeight />
          <LayoutHeader>
            {appData.tab.title || "React Context Devtool"}
            <Switch
              className="theme-switcher"
              checked={selectedTheme === THEME.DARK}
              onChange={onChangeTheme}
            />
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
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
