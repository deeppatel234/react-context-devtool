import React, { useEffect, useRef } from "react";
import ReactJson from "react-json-view";

import { JsonTreeWrapper } from "./styled";

const JsonTree = props => {
  return (
    <JsonTreeWrapper>
      <ReactJson
        name={null}
        theme="monokai"
        indentWidth={2}
        collapsed={1}
        src={props.data}
        enableClipboard
      />
    </JsonTreeWrapper>
  );
};

export default JsonTree;
