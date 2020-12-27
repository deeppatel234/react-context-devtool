import React, { useContext } from "react";

import AppContext from "Containers/AppContext";

import "./index.scss";

const Header = () => {
  const { appData: { tab } } = useContext(AppContext);

  return <header>{tab.title || "React Context Devtool"}</header>;
};

export default Header;
