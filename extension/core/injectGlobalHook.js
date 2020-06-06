import { installHook } from "./hook";

/**
 * This script runs before the <head> element is created,
 * so we add the script to <html> instead.
 *
 * @param {string} code
 */
const injectCode = (code) => {
  const script = document.createElement("script");
  script.textContent = code;

  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
};

/**
 * use react devtool internals for debug
 *
 * 1. user installed react-devtool then we return
 * 2. user not installed react-devtool then we inject devtool
 *    global hook becasue we used renderers and onCommitFiberRoot
 *    to debug.
 *
 * - When react-context-devtool is loaded first then?
 * - react devtool is override hook so react devtool is not break.
 *
 * @param {window} target
 */
const injectReactDevtoolHook = (target) => {
  if (target.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    return;
  }

  const renderers = new Map();
  let uidCounter = 0;

  const inject = (renderer) => {
    const id = ++uidCounter;
    renderers.set(id, renderer);
  };

  target.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    isDisabled: false,
    supportsFiber: true,
    renderers,
    inject,
    onCommitFiberRoot: function () {},
    onCommitFiberUnmount: function () {},
  };
};

injectCode(`
    (${injectReactDevtoolHook.toString()}(windows));
    (${installHook.toString()}(windows));
`);
