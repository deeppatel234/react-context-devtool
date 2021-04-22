import React, { useContext } from "react";

import AppContext from "Containers/AppContext";

import "./index.scss";

const Header = () => {
  const {
    appData: { tab, reactInfo },
  } = useContext(AppContext);

  return (
    <header>
      <div className="title">{tab.title || "React Context Devtool"}</div>
      <div>
        {reactInfo.version ? (
          <span className="pill">
            {reactInfo.rendererPackageName
              ? `${reactInfo.rendererPackageName}@`
              : null}
            {reactInfo.version}
          </span>
        ) : null}
        {reactInfo.mode ? <span className="pill">{reactInfo.mode}</span> : null}
      </div>
    </header>
  );
};

export default Header;
