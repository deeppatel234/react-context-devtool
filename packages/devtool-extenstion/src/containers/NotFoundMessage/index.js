import React from "react";

import "./index.scss";

const NotFoundMessage = () => {
  return (
    <div className="not-found-message">
      <p>React is not found in this page.</p>
      <p>
        if this seems wrong please <a target="_blank" href="https://github.com/deeppatel234/react-context-devtool/issues">create issue</a>.
      </p>
    </div>
  );
};

export default NotFoundMessage;
