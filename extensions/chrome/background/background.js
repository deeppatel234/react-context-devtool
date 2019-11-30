/* global chrome */

const connections = {};
const catchInitData = {};

chrome.runtime.onConnect.addListener(port => {
  const panelListener = message => {
    if (message.type === "INIT") {
      connections[message.tabId] = port;
      if (catchInitData[message.tabId]) {
        port.postMessage(catchInitData[message.tabId]);
        delete catchInitData[message.tabId];
      }
      return;
    }
  };

  port.onMessage.addListener(panelListener);

  port.onDisconnect.addListener(function() {
    port.onMessage.removeListener(panelListener);

    // remove connection object
    const tabs = Object.keys(connections);
    for (let i=0, len=tabs.length; i < len; i++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]]
        break;
      }
    }
  });
});

chrome.tabs.onRemoved.addListener(tabId => {
  if (catchInitData[tabId]) {
    delete catchInitData[tabId];
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  console.log(request);
  console.log(sender.tab);
  if (sender.tab) {
    const tabId = sender.tab.id;
    if (tabId in connections) {
      connections[tabId].postMessage(request);
    } else {
      catchInitData[tabId] = request;
    }
  }
  return true;
});
