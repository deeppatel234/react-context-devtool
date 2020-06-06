import reactDebugTool from "./reactDebugTool";

const { inspectHooksOfFiber } = reactDebugTool;

if (!window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK) {
    window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK = {}
}

window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers = {
    inspectHooksOfFiber
};
