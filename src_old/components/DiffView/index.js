import React from "react";
import ReactDiffViewer from "react-diff-viewer";
import Prism from "prismjs";
import { withTheme } from 'styled-components';

import "prismjs/themes/prism.css";

import { DiffViewWrapper } from "./styled";

const highlightSyntax = str => (
  <pre
    style={{ display: "inline" }}
    dangerouslySetInnerHTML={{
      __html: Prism.highlight(str, Prism.languages.javascript)
    }}
  />
);

const DiffView = ({ oldValue, data, theme }) => {
  return (
    <DiffViewWrapper>
      <ReactDiffViewer
        oldValue={JSON.stringify(oldValue, null, 4)}
        newValue={JSON.stringify(data, null, 4)}
        splitView={false}
        hideLineNumbers
        styles={{
          variables: {
            diffViewerBackground: theme.editorBackground,
          }
        }}
        extraLinesSurroundingDiff={500}
        renderContent={highlightSyntax}
      />
    </DiffViewWrapper>
  );
};

export default withTheme(DiffView);
