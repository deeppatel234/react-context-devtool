import reactDebugTool from "./reactDebugTool";
import { debugTool } from "./backend";

const { inspectHooksOfFiber } = reactDebugTool;

const injectCode = (code) => {
    const script = document.createElement("script");
    script.textContent = code;

    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    document.documentElement.appendChild(script);
    script.parentNode.removeChild(script);
};

const installHook = (target) => {
    target._REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK = {
        debugTool,
    };
};

injectCode(
    ";(" + installHook.toString() + "(window))" + saveNativeValues + detectReact
);
