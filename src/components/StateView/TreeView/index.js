import React, { useContext } from "react";
import ReactJson from "react-json-view";

import { isObject } from "../../../utilities";
import ThemeContext, { THEME } from "../../../App/ThemeContext";

import { TreeViewWrapper } from "./styled";

const jsonViewTheme = {
  [THEME.LIGHT]: 'rjv-default',
  [THEME.DARK]: 'monokai',
};

const TreeView = props => {
  const theme = useContext(ThemeContext);

  return (
    <TreeViewWrapper>
      <ReactJson
        name={null}
        theme={jsonViewTheme[theme]}
        indentWidth={2}
        collapsed={1}
        src={isObject(props.data) ? props.data : { root: props.data }}
        enableClipboard
      />
    </TreeViewWrapper>
  );
};

export default TreeView;
