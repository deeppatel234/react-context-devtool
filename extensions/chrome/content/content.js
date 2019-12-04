/* global chrome */

function inject(fn) {
  const script = document.createElement('script')
  script.text = `(${fn.toString()})();`
  document.documentElement.appendChild(script)
}

function scriptToInject () {
  window._REACT_CONTEXT_DEVTOOL = data => {
    const parsedData = JSON.stringify(data, function(k, v) {
      if (typeof v === 'function') {
        return 'function () {}';
      }
      return v;
    });
    window.postMessage({ type: "REACT_CONTEXT_DEVTOOL_EXTENSION", data: JSON.parse(parsedData) }, "*")
  };
}

inject(scriptToInject);

let isExtensionActive = false;

window.addEventListener("message", function(event) {
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "REACT_CONTEXT_DEVTOOL_EXTENSION")) {
    if (!isExtensionActive) {
      chrome.runtime.sendMessage({
        type: 'REACT_CONTEXT_DEVTOOL_DETECTED',
      });
      isExtensionActive = true;
    }

    chrome.runtime.sendMessage({
      type: 'REACT_CONTEXT_DEVTOOL_DATA',
      data: event.data.data
    });
  }
}, false);
