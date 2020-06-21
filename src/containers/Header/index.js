import React, { useContext } from "react";

import AppContext from "Containers/AppContext";

import "./index.scss";

const Header = () => {
  const { appData: { tab } } = useContext(AppContext);

  return <header>{tab.title}</header>;
};

export default Header;
