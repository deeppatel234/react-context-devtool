import React from "react";

declare global {
  interface Window {
    __REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK: any;
    _REACT_CONTEXT_DEVTOOL: any;
  }
}

interface DebugOptions {
  debugReducer?: boolean;
  debugContext?: boolean;
  disable?: boolean;
  disableAutoMode?: boolean;
}

interface ContextDevToolProps {
  id: string | number;
  context: any;
  displayName: string;
}

let debugOptions: DebugOptions = {
  debugReducer: true,
  debugContext: true,
  disable: false,
  disableAutoMode: false,
};

export const ContextDevTool = ({
  id,
  context: Context,
  displayName,
}: ContextDevToolProps) => {
  if (debugOptions.disable) {
    return null;
  }

  return (
    <Context.Consumer>
      {(values: any): null => {
        if (typeof window !== "undefined" && window._REACT_CONTEXT_DEVTOOL) {
          window._REACT_CONTEXT_DEVTOOL({ id, displayName, values });
        }
        return null;
      }}
    </Context.Consumer>
  );
};

export const debugContextDevtool = (
  container: HTMLElement | null,
  options?: DebugOptions
) => {
  debugOptions = { ...debugOptions, ...options };

  if (
    debugOptions.disable ||
    debugOptions.disableAutoMode ||
    typeof window === "undefined" ||
    (!debugOptions.debugReducer && !debugOptions.debugContext)
  ) {
    return false;
  }

  const hook = window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK;

  if (hook && hook.debugFiber) {
    if (
      hook.helpers &&
      hook.helpers.loadHookHelper &&
      debugOptions.debugReducer
    ) {
      hook.helpers.loadHookHelper().then(() => {
        hook.debugFiber(container, options);
      });
    } else {
      hook.debugFiber(container, options);
    }
  }
};
