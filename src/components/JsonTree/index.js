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
      />
    </div>
  );
};

export default TreeView;
