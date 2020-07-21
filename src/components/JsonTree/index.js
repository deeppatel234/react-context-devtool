import React from "react";
import ReactJson from "react-json-view";

import { isObject, isSet } from "Utils";

import "./index.scss";

const TreeView = ({ data }) => {
  let srcData = { root: data };
  if (isSet(data)) { 
    srcData = { root: [...data]};
  } else if(isObject(data)) {
    srcData = data;
  }
  return (
    <div className="tree-view">
      <ReactJson
        name={null}
        theme={"railscasts"}
        indentWidth={2}
        collapsed={1}
        src={srcData}
        enableClipboard
      />
    </div>
  );
};

export default TreeView;
