import React from "react";

import "./index.scss";

const NotFoundMessage = () => {
  return (
    <div className="not-found-message">
      <p>
        <a
          target="_blank"
          href="https://github.com/deeppatel234/react-context-devtool"
        >
          react-context-devtool
        </a>{" "}
        is not configured for this site
      </p>
      <p className="setup-text">
        please{" "}
        <a
          target="_blank"
          href="https://github.com/deeppatel234/react-context-devtool/blob/master/README.md"
        >
          click here
        </a>{" "}
        for configure
      </p>
    </div>
  );
};

export default NotFoundMessage;
