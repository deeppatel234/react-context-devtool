import React from "react";

function ContextDevTool({ id, context: Context, displayName }) {
  return (
    <Context.Consumer>
      {values => {
        if (typeof window !== 'undefined' && window._REACT_CONTEXT_DEVTOOL) {
          window._REACT_CONTEXT_DEVTOOL({ id, displayName, values });
        }
        return null;
      }}
    </Context.Consumer>
  );
}

export default ContextDevTool;
