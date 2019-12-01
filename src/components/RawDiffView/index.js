import React from "react";
import ReactDiffViewer from "react-diff-viewer";
import Prism from "prismjs";

import "prismjs/themes/prism.css";

import { RawViewWrapper } from "./styled";

const newStyles = {
  variables: {
    diffViewerBackground: "rgb(39, 40, 34)",
  }
};

const highlightSyntax = str => (
  <pre
    style={{ display: "inline" }}
    dangerouslySetInnerHTML={{
      __html: Prism.highlight(str, Prism.languages.javascript)
    }}
  />
);

const RawDiffView = ({ oldValue, data }) => {
  return (
    <RawViewWrapper>
      <ReactDiffViewer
        oldValue={JSON.stringify(oldValue, null, 4)}
        newValue={JSON.stringify(data, null, 4)}
        splitView={false}
        hideLineNumbers
        styles={newStyles}
        extraLinesSurroundingDiff={Infinity}
        renderContent={highlightSyntax}
      />
    </RawViewWrapper>
  );
};

export default RawDiffView;
