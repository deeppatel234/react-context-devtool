import React from "react";
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';

import "./index.scss";

const TreeView = ({ data }) => {
  return (
    <div className="tree-view">
      <JsonView
        value={data}
        style={vscodeTheme}
        collapsed={1}
        displayObjectSize
        displayDataTypes
        enableClipboard
      />
    </div>
  );
};

export default TreeView;
