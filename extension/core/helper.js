import reactDebugTool from "./reactDebugTool";

const { inspectHooksOfFiber } = reactDebugTool;

window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.hookHelperLoaded = true;

window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers.inspectHooksOfFiber = inspectHooksOfFiber;

window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.onHookHelperLoad();
