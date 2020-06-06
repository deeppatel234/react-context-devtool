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

const loadHelpers = () => {
  const helperUrl = chrome.runtime.getURL('react-context-devtool-helper.js');

  fetch(helperUrl)
    .then(res => res.text())
    .then(text => {
      injectCode(text);
    });
};

// TODO: install helper when needed
// function installHelpers (target) {
//   if (!target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK) {
//     target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK = {};
//   }

//   target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.loadHelpers = () => {
//     target.postMessage({ type: "REACT_CONTEXT_DEVTOOL_HOOK_LOAD_HELPER" }, "*");
//   };
// }

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
function injectReactDevtoolHook (target) {
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

/**
 * Issue with loading order in react developer tool and
 * react-context-devtool so currenly not using this feature
 */
// ;(${injectReactDevtoolHook.toString()}(window))
// ;(${installHelpers.toString()}(window))

injectCode(`
  ;(${installHook.toString()}(window))
`);

loadHelpers();

// window.addEventListener("message", function(event) {
//   if (event.source != window)
//     return;

//   if (event.data.type == "REACT_CONTEXT_DEVTOOL_HOOK_LOAD_HELPER") {
//     loadHelpers();
//   }
// }, false);
