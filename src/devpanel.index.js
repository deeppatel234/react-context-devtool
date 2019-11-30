import React from 'react';

const App = () => {
  return <div>Hello World</div>
}

export default App;


/* global chrome */

const tabId = chrome.devtools.inspectedWindow.tabId;

console.log(tabId);

var backgroundPageConnection = chrome.runtime.connect({
  name: tabId ? tabId.toString() : 'devtool',
});

backgroundPageConnection.onMessage.addListener(function (message) {
  // Handle responses from the background page, if any
  console.log('message from devpanel', message);

  document.getElementById('result').innerText = `${message.id} -> ${message.values.b}`;
});

backgroundPageConnection.postMessage({
  from: 'devpanel data'
});
