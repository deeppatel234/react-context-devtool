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
  const helperUrl = chrome.runtime.getURL("react-context-devtool-helper.js");

  return fetch(helperUrl)
    .then(res => res.text())
    .then(text => {
      injectCode(text);
    });
};

/**
 * Depricated event REACT_CONTEXT_DEVTOOL_EXTENSION.
 *
 * removed in future release
 */
function lagecyScriptToInject() {
  window._REACT_CONTEXT_DEVTOOL = (data) => {
    const helpers = window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers;
    window.postMessage(
      {
        type: "REACT_CONTEXT_DEVTOOL_EXTENSION",
        data: helpers.parseData(data),
      },
      "*"
    );
  };
}

function injectHelpers(target) {
  const isHTMLElement = function (el) {
    if ("HTMLElement" in window) {
      return el instanceof HTMLElement;
    } else {
      return (
        typeof el === "object" &&
        el.nodeType === 1 &&
        typeof el.nodeName === "string"
      );
    }
  };

  const parseData = (data) => {
    return JSON.stringify(data, function (k, v) {
      if (typeof v === "function") {
        return "function () {}";
      }
      if (isHTMLElement(v)) {
        return `<${root1.tagName}> HTMLElemet`;
      }
      return v;
    });
  };

  const loadHookHelper = () => {
    target.postMessage({
      type: "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_EVENT",
      subType: "LOAD_HOOK_HELPER",
    }, "*");

    return new Promise((resolve, reject) => {
      target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.onHookHelperLoad = () => {
        if (target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.hookHelperLoaded) {
          resolve();
        } else {
          reject();
        }
      };
    });
  };

  target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers = {
    parseData,
    loadHookHelper,
  };
}

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
/**
 * Issue with loading order in react developer tool and
 * react-context-devtool so currenly not using this feature
 * ;(${injectReactDevtoolHook.toString()}(window))
 *
 */
 function injectReactDevtoolHook(target) {
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
}

const initHook = `
  window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK = {
    hookHelperLoaded: false,
    onHookHelperLoad: () => {},
  };
`;

injectCode(`
  ${initHook}
  ;(${injectHelpers.toString()}(window))
  ;(${lagecyScriptToInject.toString()}(window))
  ;(${installHook.toString()}(window))
`);

/**
 * Chrome limit sendMessage size to 64MB
 */
const MAX_DATA_SIZE = 5 * 1024 * 1024; // 50MB
const LEGACY_EVENT = "REACT_CONTEXT_DEVTOOL_EXTENSION";
const HOOK_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_EVENT";
const DATA_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_DATA_EVENT";
const APP_DATA_EVENT = "APP_DATA";
const LOAD_HOOK_HELPER_EVENT = "LOAD_HOOK_HELPER";

let isExtensionActive = false;

window.addEventListener(
  "message",
  function (event) {
    if (event.source != window) return;

    if (event.data.type === LEGACY_EVENT || event.data.type === HOOK_EVENT) {
      if (!isExtensionActive) {
        chrome.runtime.sendMessage({
          type: DATA_EVENT,
          subType: "ACTIVATE_EXTENSTION",
        });
        isExtensionActive = true;
      }

      if (event.data.subType === LOAD_HOOK_HELPER_EVENT) {
        loadHelpers();
        return;
      }

      if (
        event.data.subType === APP_DATA_EVENT ||
        event.data.type === LEGACY_EVENT
      ) {
        try {
          chrome.runtime.sendMessage({
            type: DATA_EVENT,
            subType: APP_DATA_EVENT,
            data: event.data.data,
          });
        } catch (err) {
          if (
            err.message.includes(
              "Message length exceeded maximum allowed length"
            )
          ) {
            const { data } = event.data;
            const chunkCount = Math.ceil(data.length / MAX_DATA_SIZE);

            for (let i = 0; i < chunkCount; i++) {
              chrome.runtime.sendMessage({
                type: DATA_EVENT,
                subType: APP_DATA_EVENT,
                split: "chunk",
                chunk: i,
                data: data.slice(i * MAX_DATA_SIZE, (i + 1) * MAX_DATA_SIZE),
              });
            }

            chrome.runtime.sendMessage({
              type: DATA_EVENT,
              subType: APP_DATA_EVENT,
              split: "end",
            });
          } else {
            console.error(err);
          }
        }
      }
    }
  },
  false
);
