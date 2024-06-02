import React from "react";
import JsonView from "@uiw/react-json-view";
import { vscodeTheme } from "@uiw/react-json-view/vscode";
import { isObject } from "Utils";

import "./index.scss";

const TreeView = ({ data }) => {
  return (
    <div className="tree-view">
      <JsonView
        value={isObject(data) ? data : { root: data }}
        style={vscodeTheme}
        collapsed={1}
        displayObjectSize
        displayDataTypes
        enableClipboard
        highlightUpdates={false}
      />
    </div>
  );
};

export default TreeView;
