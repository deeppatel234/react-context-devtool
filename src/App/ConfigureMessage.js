import React from "react";

import { ConfigureText } from "./styled";

const ConfigureMessage = () => {
  return (
    <ConfigureText>
      <p>
        <a
          target="_blank"
          href="https://github.com/deeppatel234/react-context-devtool"
        >
          react-context-devtool
        </a>{" "}
        is not configured for this site
      </p>
      <p class="setup-text">
        please{" "}
        <a
          target="_blank"
          href="https://github.com/deeppatel234/react-context-devtool/blob/master/README.md"
        >
          click here
        </a>{" "}
        for configure devtool in your site
      </p>
      <hr />
      <p>
        <b>If you already configured then provide data in context for debug</b>
      </p>
    </ConfigureText>
  );
};

export default ConfigureMessage;
