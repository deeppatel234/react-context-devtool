import React from "react";
import ReactJson from "react-json-view";

import { TreeViewWrapper } from "./styled";

const TreeView = props => {
  return (
    <TreeViewWrapper>
      <ReactJson
        name={null}
        theme="monokai"
        indentWidth={2}
        collapsed={1}
        src={props.data}
        enableClipboard
      />
    </TreeViewWrapper>
  );
};

export default TreeView;
