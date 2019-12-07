import React from "react";
import ReactJson from "react-json-view";

import { isObject } from "../../../utilities";

import { TreeViewWrapper } from "./styled";

const TreeView = props => {
  return (
    <TreeViewWrapper>
      <ReactJson
        name={null}
        theme="monokai"
        indentWidth={2}
        collapsed={1}
        src={isObject(props.data) ? props.data : { root: props.data }}
        enableClipboard
      />
    </TreeViewWrapper>
  );
};

export default TreeView;
