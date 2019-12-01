/* global chrome */

console.log('Extension Loaded');

function inject(fn) {
  const script = document.createElement('script')
  script.text = `(${fn.toString()})();`
  document.documentElement.appendChild(script)
}

function scriptToInject () {
  window._REACT_CONTEXT_DEVTOOL = data => {
    console.log('Data to send ', data);
    const parsedData = JSON.stringify(data, function(k, v) {
      if (typeof v === 'function') {
        return 'function () {}';
      }
      return v;
    });
    window.postMessage({ type: "FROM_PAGE", data: JSON.parse(parsedData) }, "*")
  };
}

// const b = typeof browser !== 'undefined' ? browser : chrome

//   const script = document.createElement('script')
//   script.src = b.runtime.getURL('script.js')
//   document.documentElement.appendChild(script)

inject(scriptToInject);

// var s = chrome.runtime.connect();

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: ", event.data.data);
    chrome.runtime.sendMessage({
      type: 'REACT_CONTEXT_DEVTOOL_DATA',
      data: event.data.data
    });
    // port.postMessage(event.data.text);
  }
}, false);
